import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Ticket, FolderKanban, FileText, Users } from 'lucide-react';

export default function StaffDashboard() {
  const [assignedTickets, setAssignedTickets] = useState<number | null>(null);
  const [openProjects, setOpenProjects] = useState<number | null>(null);
  const [pendingQuotes, setPendingQuotes] = useState<number | null>(null);
  const [recentClients, setRecentClients] = useState<number | null>(null);

  useEffect(() => {
    loadStaffStats();
  }, []);

  const loadStaffStats = async () => {
    if (!supabase) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // First, get tickets assigned to this staff member to discover "their" clients/projects
      const {
        data: myTickets,
        error: ticketsError,
        count,
      } = await supabase
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

      setAssignedTickets(count ?? myTickets?.length ?? 0);

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
    } catch (error) {
      console.error('Error loading staff dashboard stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">Staff Workspace</h1>
              <p className="text-sm text-muted-foreground">
                Focused view for support and delivery teams.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/admin/dashboard">
                <Button variant="outline" size="sm">
                  Switch to Admin View
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Staff quick access */}
        <section className="rounded-xl border border-border/60 bg-card/70 px-4 py-4 shadow-sm">
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
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/70 bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Assigned Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tracking-tight">{assignedTickets ?? '—'}</p>
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Open Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tracking-tight">{openProjects ?? '—'}</p>
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Quotes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tracking-tight">{pendingQuotes ?? '—'}</p>
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                New Clients (7 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tracking-tight">{recentClients ?? '—'}</p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
