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
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    projects: 0,
    quotes: 0,
    bookings: 0,
    invoices: 0,
    tickets: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    if (!supabase) return;

    try {
      // Use a SECURITY DEFINER RPC to get aggregated counts even when RLS is enforced
      const { data, error } = await supabase.rpc('get_dashboard_counts');
      if (error) {
        console.error('RPC get_dashboard_counts error:', error);
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
    } catch (error) {
      console.error('Error loading dashboard counts:', error);
    }
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Dubiqo Digital Solutions</p>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/">
                <Button variant="outline">Back to Site</Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {statCards.map((stat) => (
            <Link key={stat.title} to={stat.link}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions (nav-style) + System Overview + Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2" aria-label="Quick actions">
                <Link
                  to="/admin/users"
                  className="block w-full rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground transition"
                >
                  Manage Users
                </Link>
                <Link
                  to="/admin/projects"
                  className="block w-full rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground transition"
                >
                  View Projects
                </Link>
                <Link
                  to="/admin/invoices"
                  className="block w-full rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground transition"
                >
                  Create Invoice
                </Link>
                <Link
                  to="/admin/downloads"
                  className="block w-full rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground transition"
                >
                  Manage Downloads
                </Link>
                <Link
                  to="/admin/portfolio"
                  className="block w-full rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground transition"
                >
                  Manage Portfolio
                </Link>
                <Link
                  to="/admin/case-studies"
                  className="block w-full rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground transition"
                >
                  Manage Case Studies
                </Link>
                <Link
                  to="/admin/blogs"
                  className="block w-full rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground transition"
                >
                  Manage Blog Posts
                </Link>
                <Link
                  to="/admin/pricing"
                  className="block w-full rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground transition"
                >
                  Manage Pricing
                </Link>
              </nav>
            </CardContent>
          </Card>

          <Card className="min-h-[220px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                System Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Database</span>
                  <span className="text-sm font-medium text-green-500">Healthy</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Storage</span>
                  <span className="text-sm font-medium text-green-500">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Functions</span>
                  <span className="text-sm font-medium text-green-500">Running</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="min-h-[220px]">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 overflow-auto">
                <p className="text-sm text-muted-foreground">Activity monitoring coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
