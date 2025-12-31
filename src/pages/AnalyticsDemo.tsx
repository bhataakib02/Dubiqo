import { useState, useEffect, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { Section } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Clock,
  MousePointer,
  ArrowUpRight,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Loader2,
  RefreshCw
} from "lucide-react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AnalyticsDemo() {
  const [timeRange, setTimeRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVisitors: 0,
    pageViews: 0,
    avgSession: "0m 0s",
    bounceRate: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [pageViewsData, setPageViewsData] = useState<any[]>([]);
  const [trafficSources, setTrafficSources] = useState<any[]>([]);
  const [realtimeUsers, setRealtimeUsers] = useState(0);

  const loadTelemetryData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get date range
      const now = new Date();
      const startDate = new Date();
      switch (timeRange) {
        case "24h":
          startDate.setHours(startDate.getHours() - 24);
          break;
        case "7d":
          startDate.setDate(startDate.getDate() - 7);
          break;
        case "30d":
          startDate.setDate(startDate.getDate() - 30);
          break;
        case "90d":
          startDate.setDate(startDate.getDate() - 90);
          break;
      }

      // Fetch telemetry events
      const { data: events, error } = await supabase
        .from('telemetry_events')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Process data
      const uniqueSessions = new Set(events?.map(e => e.session_id).filter(Boolean));
      const pageViewEvents = events?.filter(e => e.event_type === 'page_view') || [];
      
      // Calculate stats
      setStats({
        totalVisitors: uniqueSessions.size || generateDemoValue(24892, 1000),
        pageViews: pageViewEvents.length || generateDemoValue(89234, 5000),
        avgSession: calculateAvgSession(events || []),
        bounceRate: calculateBounceRate(events || []),
      });

      // Generate chart data
      setChartData(generateChartData(events || [], timeRange));
      
      // Generate page views breakdown
      setPageViewsData(generatePageViewsData(events || []));
      
      // Generate traffic sources
      setTrafficSources(generateTrafficSources(events || []));

      setRealtimeUsers(Math.floor(Math.random() * 50) + 100);
    } catch (error) {
      console.error('Error loading telemetry:', error);
      // Use demo data if no real data
      setStats({
        totalVisitors: generateDemoValue(24892, 1000),
        pageViews: generateDemoValue(89234, 5000),
        avgSession: "4m 32s",
        bounceRate: 42.3,
      });
      setChartData(generateDemoChartData(timeRange));
      setPageViewsData([
        { page: "/", views: 15234, unique: 12890 },
        { page: "/services", views: 8921, unique: 7234 },
        { page: "/pricing", views: 6543, unique: 5432 },
        { page: "/portfolio", views: 5234, unique: 4321 },
        { page: "/contact", views: 4123, unique: 3456 },
      ]);
      setTrafficSources([
        { source: "Organic Search", visitors: 12500, percentage: 50 },
        { source: "Direct", visitors: 6250, percentage: 25 },
        { source: "Social Media", visitors: 3750, percentage: 15 },
        { source: "Referral", visitors: 1875, percentage: 7.5 },
        { source: "Email", visitors: 625, percentage: 2.5 },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    loadTelemetryData();
    // Simulate realtime users
    const interval = setInterval(() => {
      setRealtimeUsers(Math.floor(Math.random() * 50) + 80);
    }, 5000);
    return () => clearInterval(interval);
  }, [loadTelemetryData]);

  const generateDemoValue = (base: number, variance: number) => {
    return base + Math.floor(Math.random() * variance - variance / 2);
  };

  const calculateAvgSession = (events: any[]) => {
    if (events.length === 0) return "4m 32s";
    // Simple calculation - in real app would track session duration
    const avgMinutes = 4 + Math.floor(Math.random() * 3);
    const avgSeconds = Math.floor(Math.random() * 60);
    return `${avgMinutes}m ${avgSeconds}s`;
  };

  const calculateBounceRate = (events: any[]) => {
    if (events.length === 0) return 42.3;
    return 35 + Math.random() * 15;
  };

  const generateChartData = (events: any[], range: string) => {
    const days = range === "24h" ? 24 : range === "7d" ? 7 : range === "30d" ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      if (range === "24h") {
        date.setHours(date.getHours() - i);
      } else {
        date.setDate(date.getDate() - i);
      }
      
      const dateStr = range === "24h" 
        ? date.toLocaleTimeString('en-IN', { hour: '2-digit' })
        : date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      
      // Count events for this period
      const periodEvents = events.filter(e => {
        const eventDate = new Date(e.created_at);
        if (range === "24h") {
          return eventDate.getHours() === date.getHours() && 
                 eventDate.getDate() === date.getDate();
        }
        return eventDate.toDateString() === date.toDateString();
      });
      
      data.push({
        date: dateStr,
        visitors: periodEvents.length || Math.floor(Math.random() * 500 + 200),
        pageViews: (periodEvents.length * 3) || Math.floor(Math.random() * 1500 + 500),
      });
    }
    
    return data;
  };

  const generateDemoChartData = (range: string) => {
    const days = range === "24h" ? 24 : range === "7d" ? 7 : range === "30d" ? 30 : 90;
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      if (range === "24h") {
        date.setHours(date.getHours() - (days - 1 - i));
      } else {
        date.setDate(date.getDate() - (days - 1 - i));
      }
      return {
        date: range === "24h" 
          ? date.toLocaleTimeString('en-IN', { hour: '2-digit' })
          : date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        visitors: Math.floor(Math.random() * 500 + 200),
        pageViews: Math.floor(Math.random() * 1500 + 500),
      };
    });
  };

  const generatePageViewsData = (events: any[]) => {
    const pageMap = new Map();
    events.forEach(e => {
      if (e.page_url) {
        const path = new URL(e.page_url, 'http://localhost').pathname;
        const current = pageMap.get(path) || { views: 0, unique: new Set() };
        current.views++;
        if (e.session_id) current.unique.add(e.session_id);
        pageMap.set(path, current);
      }
    });
    
    if (pageMap.size === 0) {
      return [
        { page: "/", views: 15234, unique: 12890 },
        { page: "/services", views: 8921, unique: 7234 },
        { page: "/pricing", views: 6543, unique: 5432 },
        { page: "/portfolio", views: 5234, unique: 4321 },
        { page: "/contact", views: 4123, unique: 3456 },
      ];
    }
    
    return Array.from(pageMap.entries())
      .map(([page, data]) => ({
        page,
        views: data.views,
        unique: data.unique.size,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  };

  const generateTrafficSources = (events: any[]) => {
    // In real app, would parse referrer data
    return [
      { source: "Organic Search", visitors: 12500, percentage: 50 },
      { source: "Direct", visitors: 6250, percentage: 25 },
      { source: "Social Media", visitors: 3750, percentage: 15 },
      { source: "Referral", visitors: 1875, percentage: 7.5 },
      { source: "Email", visitors: 625, percentage: 2.5 },
    ];
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Visitors', 'Page Views'];
    const rows = chartData.map(d => [d.date, d.visitors, d.pageViews]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('CSV exported successfully');
  };

  const overviewStats = [
    { 
      label: "Total Visitors", 
      value: stats.totalVisitors.toLocaleString(), 
      change: "+12.5%", 
      trend: "up", 
      icon: Users 
    },
    { 
      label: "Page Views", 
      value: stats.pageViews.toLocaleString(), 
      change: "+8.3%", 
      trend: "up", 
      icon: Eye 
    },
    { 
      label: "Avg. Session", 
      value: stats.avgSession, 
      change: "+2.1%", 
      trend: "up", 
      icon: Clock 
    },
    { 
      label: "Bounce Rate", 
      value: `${stats.bounceRate.toFixed(1)}%`, 
      change: "-3.2%", 
      trend: "down", 
      icon: MousePointer 
    },
  ];

  const deviceData = [
    { device: "Desktop", icon: Monitor, percentage: 58, sessions: 14437 },
    { device: "Mobile", icon: Smartphone, percentage: 36, sessions: 8961 },
    { device: "Tablet", icon: Monitor, percentage: 6, sessions: 1494 },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Badge variant="outline" className="mb-4">Live Analytics</Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-muted-foreground">
                Real-time insights into your website performance
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="icon" onClick={loadTelemetryData} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Realtime Banner */}
      <Section className="pt-0 pb-8">
        <div className="container mx-auto px-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-success animate-ping" />
                </div>
                <span className="font-medium">
                  <span className="text-2xl font-bold text-primary">{realtimeUsers}</span>
                  {" "}active users right now
                </span>
              </div>
              <Button variant="ghost" size="sm">
                View Realtime
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Overview Stats */}
      <Section className="pt-0">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {overviewStats.map((stat) => (
                  <Card key={stat.label} className="bg-card/50 backdrop-blur border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <stat.icon className="w-5 h-5 text-primary" />
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            stat.trend === "up"
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-destructive/10 text-destructive border-destructive/20"
                          }
                        >
                          {stat.trend === "up" ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {stat.change}
                        </Badge>
                      </div>
                      <p className="text-2xl font-bold mb-1">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {/* Visitors Chart */}
                <Card className="lg:col-span-2 bg-card/50 backdrop-blur border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="w-5 h-5 text-primary" />
                      Visitor Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis dataKey="date" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))' 
                            }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="visitors" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                            dot={false}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="pageViews" 
                            stroke="hsl(var(--muted-foreground))" 
                            strokeWidth={2}
                            dot={false}
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Traffic Sources */}
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-primary" />
                      Traffic Sources
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {trafficSources.map((source) => (
                      <div key={source.source}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{source.source}</span>
                          <span className="text-muted-foreground">{source.percentage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${source.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Bottom Grid */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Top Pages */}
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Top Pages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pageViewsData.map((page, index) => (
                        <div key={page.page} className="flex items-center gap-4">
                          <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{page.page}</p>
                            <p className="text-sm text-muted-foreground">
                              {page.unique.toLocaleString()} unique visitors
                            </p>
                          </div>
                          <p className="font-semibold">{page.views.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Devices */}
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-primary" />
                      Devices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {deviceData.map((device) => (
                        <div key={device.device} className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center">
                            <device.icon className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">{device.device}</span>
                              <span className="text-muted-foreground">{device.percentage}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${device.percentage}%` }}
                              />
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {device.sessions.toLocaleString()} sessions
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </Section>

      {/* CTA */}
      <Section variant="muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Want Analytics Like This?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            We can build custom analytics dashboards tailored to your business needs.
          </p>
          <Button size="lg" asChild className="glow-primary">
            <a href="/quote">Get Started</a>
          </Button>
        </div>
      </Section>
    </Layout>
  );
}
