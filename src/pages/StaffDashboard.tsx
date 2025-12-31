import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Ticket, FolderKanban, FileText, Users, Clock, Search as SearchIcon, RefreshCw, LogOut } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export default function StaffDashboard() {
  const navigate = useNavigate();
  const [assignedTickets, setAssignedTickets] = useState<number | null>(null);
  const [openProjects, setOpenProjects] = useState<number | null>(null);
  const [pendingQuotes, setPendingQuotes] = useState<number | null>(null);
  const [recentClients, setRecentClients] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadStaffStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStaffStats = async () => {
    if (!supabase) return;

    setIsRefreshing(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // First, get tickets assigned to this staff member to discover "their" clients/projects
      const { data: myTickets, error: ticketsError, count } = await supabase
        .from('tickets')
        .select('client_id, project_id', { count: 'exact', head: false })
        .eq('assigned_to', user.id)
        .in('status', ['open', 'in_progress']);

      if (ticketsError) {
        console.error('Error loading staff tickets:', ticketsError);
        return;
      }

      const clientIds = new Set<string>();
      const projectIds = new Set<string>();
      (myTickets || []).forEach((t: any) => {
        if (t.client_id) clientIds.add(t.client_id);
        if (t.project_id) projectIds.add(t.project_id);
      });

      const clientIdArray = Array.from(clientIds);
      const projectIdArray = Array.from(projectIds);

      setAssignedTickets(count ?? (myTickets?.length ?? 0));

      // If no related clients/projects, remaining stats are 0
      if (clientIdArray.length === 0 && projectIdArray.length === 0) {
        setOpenProjects(0);
        setPendingQuotes(0);
        setRecentClients(0);
        return;
      }

      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const [projectsRes, quotesRes, clientsRes] = await Promise.all([
        projectIdArray.length > 0
          ? supabase
              .from('projects')
              .select('*', { count: 'exact', head: true })
              .in('id', projectIdArray)
              .in('status', ['discovery', 'planning', 'development', 'review'])
          : Promise.resolve({ count: 0 } as any),
        clientIdArray.length > 0
          ? supabase
              .from('quotes')
              .select('*', { count: 'exact', head: true })
              .eq('status', 'pending')
              .in('client_id', clientIdArray)
          : Promise.resolve({ count: 0 } as any),
        clientIdArray.length > 0
          ? supabase
              .from('profiles')
              .select('*', { count: 'exact', head: true })
              .in('id', clientIdArray)
              .gte('created_at', sevenDaysAgo)
          : Promise.resolve({ count: 0 } as any),
      ]);

      setOpenProjects(projectsRes.count ?? 0);
      setPendingQuotes(quotesRes.count ?? 0);
      setRecentClients(clientsRes.count ?? 0);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading staff dashboard stats:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadStaffStats();
  };

  const handleLogout = async () => {
    if (!supabase) return;
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (err) {
      console.error('Logout error', err);
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-[#222739] to-[#171921] noise">
      <header className="border-b bg-card/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="gradient-text text-3xl font-bold tracking-tight">Staff Workspace</h1>
              <p className="text-sm text-muted-foreground text-balance">
                Focused view for support and delivery teams. Welcome back!
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 mt-4">
            <div className="relative w-full md:w-96 flex items-center">
              <SearchIcon className="absolute left-3 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                className="pl-9 pr-4 bg-background/70 focus:ring-1 focus:ring-primary rounded-xl focus:bg-background"
                placeholder="Quick search tickets, projects, quotes..."
                type="search"
                autoComplete="off"
              />
              <span className="sr-only">Quick search</span>
            </div>
            <div className="ml-2 text-xs text-muted-foreground flex items-center gap-1 whitespace-nowrap">
              <Clock className="inline w-4 h-4 mr-1 text-primary/80" />
              {lastUpdated ? `Last updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Loading...'}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-10">
        {/* Staff quick access */}
        <section className="rounded-xl border border-border/60 bg-card/70 px-4 py-4 shadow-sm glass gradient-subtle">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              <h2 className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                Staff Shortcuts
              </h2>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
            <Link
              to="/admin/tickets"
              state={{ from: 'staff' }}
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-foreground transition whitespace-nowrap"
            >
              <Ticket className="h-3.5 w-3.5" />
              Support Tickets
            </Link>
            <Link
              to="/admin/projects"
              state={{ from: 'staff' }}
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-foreground transition whitespace-nowrap"
            >
              <FolderKanban className="h-3.5 w-3.5" />
              Active Projects
            </Link>
            <Link
              to="/admin/quotes"
              state={{ from: 'staff' }}
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-foreground transition whitespace-nowrap"
            >
              <FileText className="h-3.5 w-3.5" />
              Pending Quotes
            </Link>
            <Link
              to="/admin/users"
              state={{ from: 'staff' }}
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-foreground transition whitespace-nowrap"
            >
              <Users className="h-3.5 w-3.5" />
              Clients
            </Link>
          </nav>
        </section>

        {/* Staff stats */}
        <section className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">
          {/* Assigned Tickets Card */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/admin/tickets" state={{ from: 'staff' }} style={{ textDecoration: 'none' }}>
                <Card className="glass-hover card-hover border-primary/60 relative overflow-hidden cursor-pointer group">
                  <div className="absolute -top-7 -right-10 opacity-20 scale-150 group-hover:opacity-35 transition"><Ticket className="w-24 h-24 text-primary" /></div>
                  <CardHeader className="pb-2 z-10">
                    <CardTitle className="text-sm font-semibold text-primary flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-primary shrink-0" /> Assigned Tickets
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold tracking-tight mb-1">
                      {assignedTickets === null ? <Skeleton className="h-7 w-16" /> : assignedTickets}
                    </p>
                    <span className="text-[12px] text-muted-foreground">Tickets currently assigned to you</span>
                  </CardContent>
                </Card>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom">Open support or delivery tickets assigned to you.</TooltipContent>
          </Tooltip>

          {/* Open Projects Card */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/admin/projects" state={{ from: 'staff' }} style={{ textDecoration: 'none' }}>
                <Card className="glass-hover card-hover border-accent/60 relative overflow-hidden cursor-pointer group">
                  <div className="absolute -top-7 -right-10 opacity-20 scale-150 group-hover:opacity-35 transition"><FolderKanban className="w-24 h-24 text-accent" /></div>
                  <CardHeader className="pb-2 z-10">
                    <CardTitle className="text-sm font-semibold text-accent flex items-center gap-2">
                      <FolderKanban className="w-5 h-5 text-accent shrink-0" /> Open Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold tracking-tight mb-1">
                      {openProjects === null ? <Skeleton className="h-7 w-16" /> : openProjects}
                    </p>
                    <span className="text-[12px] text-muted-foreground">Active projects you're involved in</span>
                  </CardContent>
                </Card>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom">Projects in active states where you have assigned tickets.</TooltipContent>
          </Tooltip>

          {/* Pending Quotes Card */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/admin/quotes" state={{ from: 'staff' }} style={{ textDecoration: 'none' }}>
                <Card className="glass-hover card-hover border-warning/50 relative overflow-hidden cursor-pointer group">
                  <div className="absolute -top-7 -right-10 opacity-15 scale-150 group-hover:opacity-30 transition"><FileText className="w-24 h-24 text-warning" /></div>
                  <CardHeader className="pb-2 z-10">
                    <CardTitle className="text-sm font-semibold text-warning flex items-center gap-2">
                      <FileText className="w-5 h-5 text-warning shrink-0" /> Pending Quotes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold tracking-tight mb-1">
                      {pendingQuotes === null ? <Skeleton className="h-7 w-16" /> : pendingQuotes}
                    </p>
                    <span className="text-[12px] text-muted-foreground">Quotes awaiting client action</span>
                  </CardContent>
                </Card>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom">Open/pending project/service quotes for your assigned clients.</TooltipContent>
          </Tooltip>

          {/* New Clients Card */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/admin/users" state={{ from: 'staff' }} style={{ textDecoration: 'none' }}>
                <Card className="glass-hover card-hover border-success/50 relative overflow-hidden cursor-pointer group">
                  <div className="absolute -top-7 -right-10 opacity-15 scale-150 group-hover:opacity-30 transition"><Users className="w-24 h-24 text-success" /></div>
                  <CardHeader className="pb-2 z-10">
                    <CardTitle className="text-sm font-semibold text-success flex items-center gap-2">
                      <Users className="w-5 h-5 text-success shrink-0" /> New Clients (7 days)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold tracking-tight mb-1">
                      {recentClients === null ? <Skeleton className="h-7 w-16" /> : recentClients}
                    </p>
                    <span className="text-[12px] text-muted-foreground">Clients you worked with, recently joined</span>
                  </CardContent>
                </Card>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom">Clients newly onboarded in the past 7 days from your assigned list.</TooltipContent>
          </Tooltip>
        </section>
        {/* Recent Activity Feed (Placeholder for now) */}
        <section className="rounded-xl border border-border/70 bg-card/70 shadow-sm mt-10 py-6 px-6 glass">
          <h2 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2"><BarChart className="w-5 h-5" />Recent Activity</h2>
          <Separator className="mb-4" />
          <p className="text-muted-foreground text-sm flex items-center"><span className="mr-1">Coming soon:</span> Your recent tickets, project updates, and key events will appear here for an at-a-glance overview.</p>
        </section>

      </main>
    </div>
  );
}

