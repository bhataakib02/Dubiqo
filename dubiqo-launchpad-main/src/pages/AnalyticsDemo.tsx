import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Section, SectionHeader } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  LineChart
} from "lucide-react";

// Mock analytics data
const overviewStats = [
  { label: "Total Visitors", value: "24,892", change: "+12.5%", trend: "up", icon: Users },
  { label: "Page Views", value: "89,234", change: "+8.3%", trend: "up", icon: Eye },
  { label: "Avg. Session", value: "4m 32s", change: "+2.1%", trend: "up", icon: Clock },
  { label: "Bounce Rate", value: "42.3%", change: "-3.2%", trend: "down", icon: MousePointer },
];

const pageViews = [
  { page: "/", views: 15234, unique: 12890 },
  { page: "/services", views: 8921, unique: 7234 },
  { page: "/pricing", views: 6543, unique: 5432 },
  { page: "/portfolio", views: 5234, unique: 4321 },
  { page: "/contact", views: 4123, unique: 3456 },
];

const trafficSources = [
  { source: "Organic Search", visitors: 12500, percentage: 50 },
  { source: "Direct", visitors: 6250, percentage: 25 },
  { source: "Social Media", visitors: 3750, percentage: 15 },
  { source: "Referral", visitors: 1875, percentage: 7.5 },
  { source: "Email", visitors: 625, percentage: 2.5 },
];

const deviceData = [
  { device: "Desktop", icon: Monitor, percentage: 58, sessions: 14437 },
  { device: "Mobile", icon: Smartphone, percentage: 36, sessions: 8961 },
  { device: "Tablet", icon: Monitor, percentage: 6, sessions: 1494 },
];

const realtimeUsers = 127;

export default function AnalyticsDemo() {
  const [timeRange, setTimeRange] = useState("7d");

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Badge variant="outline" className="mb-4">Demo</Badge>
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
              <Button variant="outline">Export</Button>
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
            {/* Visitors Chart Placeholder */}
            <Card className="lg:col-span-2 bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-primary" />
                  Visitor Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Interactive chart visualization</p>
                    <p className="text-sm">Connect to your analytics data</p>
                  </div>
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
                  {pageViews.map((page, index) => (
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
