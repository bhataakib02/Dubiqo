import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import {
  Users,
  FolderKanban,
  FileText,
  Calendar,
  IndianRupee,
  Ticket,
  TrendingUp,
  BarChart,
  LogOut,
} from 'lucide-react';

type StatusLevel = 'healthy' | 'degraded' | 'down' | 'unknown';

interface SystemStatusItem {
  label: string;
  status: StatusLevel;
  message: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    projects: 0,
    quotes: 0,
    bookings: 0,
    invoices: 0,
    tickets: 0,
  });

  const [systemStatus, setSystemStatus] = useState<{
    database: SystemStatusItem;
    storage: SystemStatusItem;
    functions: SystemStatusItem;
  }>({
    database: { label: 'Database', status: 'unknown', message: 'Not checked yet' },
    storage: { label: 'Storage', status: 'unknown', message: 'Not checked yet' },
    functions: {
      label: 'Functions',
      status: 'unknown',
      message: 'Edge function status not checked yet',
    },
  });

  useEffect(() => {
    loadStats();
    checkSystemStatus();
  }, []);

  const loadStats = async () => {
    if (!supabase) return;

    try {
      // Use a SECURITY DEFINER RPC to get aggregated counts even when RLS is enforced
      const { data, error } = await supabase.rpc('get_dashboard_counts');
      if (error) {
        console.error('RPC get_dashboard_counts error:', error);
        setSystemStatus((prev) => ({
          ...prev,
          database: {
            label: 'Database',
            status: 'down',
            message: 'Failed to load dashboard counts',
          },
        }));
        return;
      }

      const counts = (data as any) ?? {};
      setStats({
        users: counts.total_profiles ?? 0,
        projects: counts.total_projects ?? 0,
        quotes: counts.total_quotes ?? 0,
        bookings: counts.total_bookings ?? 0,
        invoices: counts.total_invoices ?? 0,
        tickets: counts.total_tickets ?? 0,
      });

      setSystemStatus((prev) => ({
        ...prev,
        database: {
          label: 'Database',
          status: 'healthy',
          message: 'Dashboard counts loaded successfully',
        },
      }));
    } catch (error) {
      console.error('Error loading dashboard counts:', error);
      setSystemStatus((prev) => ({
        ...prev,
        database: {
          label: 'Database',
          status: 'down',
          message: 'Unexpected error while talking to the database',
        },
      }));
    }
  };

  const checkSystemStatus = async () => {
    if (!supabase) return;

    // Storage health
    try {
      const { data, error } = await supabase.storage.listBuckets();
      if (error) {
        throw error;
      }

      setSystemStatus((prev) => ({
        ...prev,
        storage: {
          label: 'Storage',
          status: 'healthy',
          message: `${data?.length ?? 0} buckets accessible`,
        },
      }));
    } catch (error) {
      console.error('Storage health check failed:', error);
      setSystemStatus((prev) => ({
        ...prev,
        storage: {
          label: 'Storage',
          status: 'down',
          message: 'Unable to list storage buckets',
        },
      }));
    }

    // Functions health (best-effort check via metadata endpoint, may remain "unknown")
    setSystemStatus((prev) => ({
      ...prev,
      functions: {
        label: 'Functions',
        status: 'unknown',
        message: 'Detailed edge function health is not available in this dashboard',
      },
    }));
  };

  const handleLogout = async () => {
    if (!supabase) return;
    try {
      // Sign out via Supabase
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout error', err);
    }
    // Redirect to auth page
    window.location.href = '/auth';
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.users,
      icon: Users,
      link: '/admin/users',
      color: 'text-blue-500',
    },
    {
      title: 'Active Projects',
      value: stats.projects,
      icon: FolderKanban,
      link: '/admin/projects',
      color: 'text-green-500',
    },
    {
      title: 'Pending Quotes',
      value: stats.quotes,
      icon: FileText,
      link: '/admin/quotes',
      color: 'text-yellow-500',
    },
    {
      title: 'Upcoming Bookings',
      value: stats.bookings,
      icon: Calendar,
      link: '/admin/bookings',
      color: 'text-purple-500',
    },
    {
      title: 'Invoices',
      value: stats.invoices,
      icon: IndianRupee,
      link: '/admin/invoices',
      color: 'text-emerald-500',
    },
    {
      title: 'Open Tickets',
      value: stats.tickets,
      icon: Ticket,
      link: '/admin/tickets',
      color: 'text-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/90 text-foreground">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Dubiqo Digital Solutions · Monitor and control your operations at a glance
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/">
                <Button variant="outline">Back to Site</Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Quick Actions - top horizontal nav */}
        <section
          className="rounded-xl border border-border/60 bg-card/70 px-4 py-4 shadow-sm"
          aria-label="Quick actions"
        >
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                Quick Actions
              </h2>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
            <Link
              to="/admin/users"
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-foreground transition whitespace-nowrap"
            >
              Manage Users
            </Link>
            <Link
              to="/admin/projects"
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-foreground transition whitespace-nowrap"
            >
              View Projects
            </Link>
            <Link
              to="/admin/invoices"
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-foreground transition whitespace-nowrap"
            >
              Create Invoice
            </Link>
            <Link
              to="/admin/downloads"
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-foreground transition whitespace-nowrap"
            >
              Manage Downloads
            </Link>
            <Link
              to="/admin/portfolio"
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-foreground transition whitespace-nowrap"
            >
              Manage Portfolio
            </Link>
            <Link
              to="/admin/case-studies"
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-foreground transition whitespace-nowrap"
            >
              Manage Case Studies
            </Link>
            <Link
              to="/admin/blogs"
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-foreground transition whitespace-nowrap"
            >
              Manage Blog Posts
            </Link>
            <Link
              to="/admin/pricing"
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-foreground transition whitespace-nowrap"
            >
              Manage Pricing
            </Link>
          </nav>
        </section>

        {/* Stats Grid */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat) => (
            <Link key={stat.title} to={stat.link}>
              <Card className="relative overflow-hidden border-border/70 bg-card/80 hover:border-primary/60 hover:bg-card transition-colors cursor-pointer shadow-sm">
                <div className="pointer-events-none absolute inset-x-0 -top-12 h-24 bg-gradient-to-b from-primary/15 to-transparent" />
                <CardHeader className="relative flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-semibold tracking-tight">{stat.value}</div>
                  <p className="mt-1 text-xs text-muted-foreground">Tap to view details</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>

        {/* System Overview + Recent Activity */}
        <section className="grid gap-6 md:grid-cols-2">
          <Card className="min-h-[220px] border-border/70 bg-card/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                System Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(['database', 'storage', 'functions'] as const).map((key) => {
                  const item = systemStatus[key];

                  const colorClasses: Record<StatusLevel, string> = {
                    healthy: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
                    degraded: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
                    down: 'text-red-500 bg-red-500/10 border-red-500/30',
                    unknown: 'text-muted-foreground bg-muted/10 border-border/50',
                  };

                  return (
                    <div key={item.label} className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground/80">{item.message}</p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${colorClasses[item.status]}`}
                      >
                        {item.status === 'healthy' && 'Healthy'}
                        {item.status === 'degraded' && 'Degraded'}
                        {item.status === 'down' && 'Down'}
                        {item.status === 'unknown' && 'Unknown'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="min-h-[220px] border-border/70 bg-card/80">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 overflow-auto">
                <p className="text-sm text-muted-foreground">Activity monitoring coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
