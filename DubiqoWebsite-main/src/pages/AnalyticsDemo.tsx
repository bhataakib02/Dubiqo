import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  TrendingUp,
  Eye,
  MousePointer,
  Clock,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Globe,
  Smartphone,
  Monitor,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

const AnalyticsDemo = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const stats = [
    { label: "Total Visitors", value: "12,847", change: "+12.5%", trend: "up", icon: Users },
    { label: "Page Views", value: "45,231", change: "+8.3%", trend: "up", icon: Eye },
    { label: "Bounce Rate", value: "42.3%", change: "-3.2%", trend: "down", icon: MousePointer },
    { label: "Avg. Session", value: "2m 45s", change: "+15.7%", trend: "up", icon: Clock },
  ];

  const topPages = [
    { path: "/", views: 8420, percentage: 35 },
    { path: "/services", views: 4215, percentage: 18 },
    { path: "/portfolio", views: 3180, percentage: 13 },
    { path: "/pricing", views: 2845, percentage: 12 },
    { path: "/blog", views: 2140, percentage: 9 },
    { path: "/contact", views: 1580, percentage: 7 },
  ];

  const trafficSources = [
    { source: "Direct", visits: 4850, percentage: 38, color: "bg-primary" },
    { source: "Organic Search", visits: 3920, percentage: 31, color: "bg-green-500" },
    { source: "Social Media", visits: 2140, percentage: 17, color: "bg-blue-500" },
    { source: "Referral", visits: 1420, percentage: 11, color: "bg-purple-500" },
    { source: "Email", visits: 517, percentage: 4, color: "bg-yellow-500" },
  ];

  const devices = [
    { type: "Desktop", icon: Monitor, visits: 6423, percentage: 50 },
    { type: "Mobile", icon: Smartphone, visits: 5139, percentage: 40 },
    { type: "Tablet", icon: Monitor, visits: 1285, percentage: 10 },
  ];

  const locations = [
    { country: "India", flag: "🇮🇳", visits: 5420 },
    { country: "United States", flag: "🇺🇸", visits: 2845 },
    { country: "United Kingdom", flag: "🇬🇧", visits: 1580 },
    { country: "Canada", flag: "🇨🇦", visits: 980 },
    { country: "Germany", flag: "🇩🇪", visits: 720 },
  ];

  // Simulated chart data (bars)
  const chartData = [
    { day: "Mon", value: 65 },
    { day: "Tue", value: 78 },
    { day: "Wed", value: 82 },
    { day: "Thu", value: 70 },
    { day: "Fri", value: 95 },
    { day: "Sat", value: 55 },
    { day: "Sun", value: 45 },
  ];

  return (
    <div className="min-h-screen bg-card/30">
      {/* Header */}
      <div className="gradient-primary border-b border-border/40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">Analytics Dashboard</h1>
              <p className="text-primary-foreground/80 text-sm">Demo: See how we build custom analytics for clients</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32 bg-white/10 border-white/20 text-primary-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="glass border-border/40">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-foreground/60 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <div className={`flex items-center gap-1 text-sm mt-1 ${
                        stat.trend === "up" ? "text-green-500" : "text-red-500"
                      }`}>
                        {stat.trend === "up" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                        <span>{stat.change}</span>
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Chart & Traffic Sources */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Simple Bar Chart */}
          <Card className="glass border-border/40 lg:col-span-2">
            <CardHeader>
              <CardTitle>Visitor Trend</CardTitle>
              <CardDescription>Daily visitors over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-2 h-48">
                {chartData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full gradient-primary rounded-t-lg transition-all duration-500 hover:opacity-80"
                      style={{ height: `${item.value}%` }}
                    />
                    <span className="text-xs text-foreground/60 mt-2">{item.day}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card className="glass border-border/40">
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your visitors come from</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {trafficSources.map((source, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>{source.source}</span>
                    <span className="text-foreground/60">{source.percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className={`h-full ${source.color} transition-all duration-500`}
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Top Pages, Devices, Locations */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Top Pages */}
          <Card className="glass border-border/40">
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>Most visited pages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="text-sm font-mono">{page.path}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground/60">{page.views.toLocaleString()}</span>
                    <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full gradient-primary"
                        style={{ width: `${page.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Devices */}
          <Card className="glass border-border/40">
            <CardHeader>
              <CardTitle>Devices</CardTitle>
              <CardDescription>Visitor device breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {devices.map((device, index) => {
                const Icon = device.icon;
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>{device.type}</span>
                        <span className="text-foreground/60">{device.percentage}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div 
                          className="h-full gradient-primary transition-all duration-500"
                          style={{ width: `${device.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Locations */}
          <Card className="glass border-border/40">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <CardTitle>Top Locations</CardTitle>
              </div>
              <CardDescription>Visitors by country</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {locations.map((location, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{location.flag}</span>
                    <span className="text-sm">{location.country}</span>
                  </div>
                  <span className="text-sm text-foreground/60">{location.visits.toLocaleString()}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="glass border-primary glow">
          <CardContent className="p-8 text-center">
            <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Want a Dashboard Like This?</h2>
            <p className="text-foreground/70 mb-6 max-w-xl mx-auto">
              We build custom analytics dashboards tailored to your business needs. Track the metrics that matter most to you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="gradient-primary">
                <Link to="/quote">Get a Quote</Link>
              </Button>
              <Button asChild variant="outline" className="border-primary/50">
                <Link to="/services/dashboards">Learn More</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDemo;
