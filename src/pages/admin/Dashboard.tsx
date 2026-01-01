import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
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
  Download,
  Briefcase,
  BookOpen,
  DollarSign,
  Star,
  Image,
  Activity,
  Clock,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
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

  const [recentActivities, setRecentActivities] = useState<Array<{
    id: string;
    action: string;
    entity_type: string;
    entity_id: string | null;
    created_at: string;
    user_name?: string;
  }>>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  useEffect(() => {
    loadStats();
    checkSystemStatus();
    loadRecentActivities();
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
          message: `${data?.length ?? 0} bucket${data?.length !== 1 ? 's' : ''} accessible`,
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

  const loadRecentActivities = async () => {
    if (!supabase) {
      setIsLoadingActivities(false);
      return;
    }

    try {
      // First, try to get audit logs
      const { data: logsData, error: logsError } = await supabase
        .from('audit_logs')
        .select('id, action, entity_type, entity_id, created_at, user_id')
        .order('created_at', { ascending: false })
        .limit(10);

      if (logsError) {
        console.error('Error loading recent activities:', logsError);
        setRecentActivities([]);
        setIsLoadingActivities(false);
        return;
      }

      if (!logsData || logsData.length === 0) {
        setRecentActivities([]);
        setIsLoadingActivities(false);
        return;
      }

      // Get unique user IDs
      const userIds = [...new Set(logsData.map((log) => log.user_id).filter(Boolean))];
      
      // Fetch user profiles if we have user IDs
      let userMap: Record<string, { full_name: string | null; email: string }> = {};
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds);
        
        if (profilesData) {
          profilesData.forEach((profile) => {
            userMap[profile.id] = {
              full_name: profile.full_name,
              email: profile.email,
            };
          });
        }
      }

      // Map activities with user names
      const activities = logsData.map((item) => {
        const user = item.user_id ? userMap[item.user_id] : null;
        return {
          id: item.id,
          action: item.action,
          entity_type: item.entity_type,
          entity_id: item.entity_id,
          created_at: item.created_at,
          user_name: user?.full_name || user?.email || 'System',
        };
      });

      setRecentActivities(activities);
    } catch (error) {
      console.error('Error loading recent activities:', error);
      setRecentActivities([]);
    } finally {
      setIsLoadingActivities(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'created':
        return <Plus className="w-4 h-4" />;
      case 'updated':
      case 'edited':
        return <Edit className="w-4 h-4" />;
      case 'deleted':
      case 'deleted':
        return <Trash2 className="w-4 h-4" />;
      case 'completed':
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'created':
        return 'text-green-500 bg-green-500/10';
      case 'updated':
      case 'edited':
        return 'text-blue-500 bg-blue-500/10';
      case 'deleted':
        return 'text-red-500 bg-red-500/10';
      case 'completed':
      case 'approved':
        return 'text-emerald-500 bg-emerald-500/10';
      default:
        return 'text-muted-foreground bg-muted/10';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatActivityText = (action: string, entityType: string) => {
    const actionFormatted = action.charAt(0).toUpperCase() + action.slice(1);
    const entityFormatted = entityType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return `${actionFormatted} ${entityFormatted}`;
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
          className="relative rounded-2xl border border-border/50 bg-gradient-to-br from-card/90 via-card/80 to-card/90 backdrop-blur-xl px-6 py-6 shadow-lg shadow-black/5"
          aria-label="Quick actions"
        >
          {/* Background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-2xl opacity-50" />
          
          <div className="relative flex items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-wide text-foreground uppercase">
                  Quick Actions
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">Navigate to management sections</p>
              </div>
            </div>
          </div>
          
          <nav className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {[
              { to: '/admin/users', label: 'Manage Users', icon: Users, color: 'from-blue-500/20 to-blue-600/20', iconColor: 'text-blue-500', borderColor: 'border-blue-500/30' },
              { to: '/admin/projects', label: 'View Projects', icon: FolderKanban, color: 'from-green-500/20 to-green-600/20', iconColor: 'text-green-500', borderColor: 'border-green-500/30' },
              { to: '/admin/invoices', label: 'Create Invoice', icon: IndianRupee, color: 'from-emerald-500/20 to-emerald-600/20', iconColor: 'text-emerald-500', borderColor: 'border-emerald-500/30' },
              { to: '/admin/downloads', label: 'Manage Downloads', icon: Download, color: 'from-purple-500/20 to-purple-600/20', iconColor: 'text-purple-500', borderColor: 'border-purple-500/30' },
              { to: '/admin/portfolio', label: 'Manage Portfolio', icon: Briefcase, color: 'from-orange-500/20 to-orange-600/20', iconColor: 'text-orange-500', borderColor: 'border-orange-500/30' },
              { to: '/admin/case-studies', label: 'Manage Case Studies', icon: BookOpen, color: 'from-indigo-500/20 to-indigo-600/20', iconColor: 'text-indigo-500', borderColor: 'border-indigo-500/30' },
              { to: '/admin/blogs', label: 'Manage Blog Posts', icon: FileText, color: 'from-pink-500/20 to-pink-600/20', iconColor: 'text-pink-500', borderColor: 'border-pink-500/30' },
              { to: '/admin/pricing', label: 'Manage Pricing', icon: DollarSign, color: 'from-yellow-500/20 to-yellow-600/20', iconColor: 'text-yellow-500', borderColor: 'border-yellow-500/30' },
              { to: '/admin/testimonials', label: 'Manage Testimonials', icon: Star, color: 'from-amber-500/20 to-amber-600/20', iconColor: 'text-amber-500', borderColor: 'border-amber-500/30' },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.to}
                  to={action.to}
                  className="group relative flex items-center gap-3 rounded-xl border border-border/50 bg-background/60 backdrop-blur-sm px-4 py-3.5 transition-all duration-300 hover:border-primary/50 hover:bg-gradient-to-br hover:from-card hover:to-card/80 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] hover:-translate-y-0.5"
                >
                  <div className={`flex-shrink-0 p-2 rounded-lg bg-gradient-to-br ${action.color} border ${action.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-4 w-4 ${action.iconColor}`} />
                  </div>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {action.label}
                  </span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-all duration-300 pointer-events-none" />
                </Link>
              );
            })}
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
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[220px] overflow-y-auto space-y-3 pr-2">
                {isLoadingActivities ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : recentActivities.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="p-3 rounded-full bg-muted/30 mb-3">
                      <Activity className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">No activity yet</p>
                    <p className="text-xs text-muted-foreground">
                      System activities will appear here as actions are performed
                    </p>
                  </div>
                ) : (
                  recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className={`flex-shrink-0 p-1.5 rounded-md ${getActionColor(activity.action)}`}>
                        {getActionIcon(activity.action)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-foreground truncate">
                            {formatActivityText(activity.action, activity.entity_type)}
                          </p>
                          <span className="flex-shrink-0 text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(activity.created_at)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          by {activity.user_name}
                          {activity.entity_id && (
                            <span className="ml-2 font-mono text-[10px]">#{activity.entity_id.slice(0, 8)}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
