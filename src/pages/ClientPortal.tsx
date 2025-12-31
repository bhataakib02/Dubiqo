import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  FolderKanban,
  FileText,
  CheckCircle2,
  MessageSquare,
  LogOut,
  Plus,
  ArrowRight,
  Download,
  User,
  Send,
  Loader2,
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { Tables } from '@/integrations/supabase/types';

type Project = Tables<'projects'>;
type Invoice = Tables<'invoices'>;
type Ticket = Tables<'tickets'>;
type TicketMessage = Tables<'ticket_messages'>;

type TicketWithMessages = Ticket & {
  messages?: TicketMessage[];
};

export default function ClientPortal() {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Tables<'profiles'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState({
    activeProjects: 0,
    pendingInvoices: 0,
    completedProjects: 0,
    openTickets: 0,
    pendingAmount: 0,
  });

  // New ticket dialog
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: '', description: '', priority: 'medium' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Project details dialog
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [assignedStaff, setAssignedStaff] = useState<Array<{ id: string; profiles?: { full_name: string | null; email: string } }>>([]);

  // Ticket details dialog
  const [viewingTicket, setViewingTicket] = useState<TicketWithMessages | null>(null);
  const [isTicketDetailOpen, setIsTicketDetailOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Payment processing
  const [processingInvoiceId, setProcessingInvoiceId] = useState<string | null>(null);

  // Invoice details dialog
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (!supabase) {
        toast.error('Authentication not configured');
        navigate('/');
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      // Check if user is admin or staff - redirect to admin dashboard
      try {
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (roleError) {
          console.error('Error checking role:', roleError);
        }

        console.log('User role check:', { userId: session.user.id, roleData, roleError });

        if (roleData && (roleData.role === 'admin' || roleData.role === 'staff')) {
          console.log('Redirecting admin/staff to admin dashboard');
          navigate('/admin/dashboard', { replace: true });
          return;
        }
      } catch (error) {
        console.error('Error checking role:', error);
        // Continue to client portal if role check fails
      }

      setUser(session.user);
      await loadUserData(session.user.id);
      setIsLoading(false);
    };

    checkAuth();

    if (!supabase) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Check for payment success/cancellation in URL
  useEffect(() => {
    if (!user) return;

    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    const invoiceId = params.get('invoice');

    if (paymentStatus === 'success' && invoiceId) {
      toast.success('Payment successful! Your invoice has been marked as paid.');
      // Reload user data to refresh invoice status
      loadUserData(user.id);
      // Clean up URL
      window.history.replaceState({}, '', '/client-portal');
    } else if (paymentStatus === 'cancelled') {
      toast.info('Payment was cancelled. You can try again anytime.');
      // Clean up URL
      window.history.replaceState({}, '', '/client-portal');
    }
  }, [user]);

  const loadUserData = async (userId: string) => {
    if (!supabase) return;

    try {
      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      setProfile(profileData);

      // Load user's projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: false });

      setProjects(projectsData || []);

      // Load user's invoices
      const { data: invoicesData } = await supabase
        .from('invoices')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: false });

      setInvoices(invoicesData || []);

      // Load user's tickets
      const { data: ticketsData } = await supabase
        .from('tickets')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: false });

      setTickets(ticketsData || []);

      // Calculate stats
      const activeProjects = (projectsData || []).filter((p) =>
        ['discovery', 'in_progress', 'review'].includes(p.status)
      ).length;
      const completedProjects = (projectsData || []).filter((p) => p.status === 'completed').length;
      const pendingInvoices = (invoicesData || []).filter((i) =>
        ['pending', 'sent', 'overdue'].includes(i.status)
      );
      const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + Number(inv.total_amount), 0);
      const openTickets = (ticketsData || []).filter((t) =>
        ['open', 'in_progress'].includes(t.status)
      ).length;

      setStats({
        activeProjects,
        pendingInvoices: pendingInvoices.length,
        completedProjects,
        openTickets,
        pendingAmount,
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load your data');
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleCreateTicket = async () => {
    if (!supabase || !user) return;

    if (!newTicket.title.trim() || !newTicket.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('tickets').insert({
        client_id: user.id,
        title: newTicket.title,
        description: newTicket.description,
        priority: newTicket.priority,
        status: 'open',
      });

      if (error) throw error;

      toast.success('Support ticket created successfully');
      setIsTicketDialogOpen(false);
      setNewTicket({ title: '', description: '', priority: 'medium' });

      // Reload tickets
      await loadUserData(user.id);
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Failed to create ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewTicket = async (ticket: Ticket) => {
    if (!supabase || !user) return;

    try {
      // Load ticket messages (excluding internal messages)
      const { data: messages } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', ticket.id)
        .eq('is_internal', false) // Only show non-internal messages to clients
        .order('created_at', { ascending: true });

      // Ensure we have the client_id from the ticket
      const ticketWithClientId = {
        ...ticket,
        client_id: ticket.client_id || user.id, // Fallback to current user if not set
        messages: messages || [],
      };

      setViewingTicket(ticketWithClientId);
      setIsTicketDetailOpen(true);
    } catch (error) {
      console.error('Error loading ticket messages:', error);
      const ticketWithClientId = {
        ...ticket,
        client_id: ticket.client_id || user?.id,
        messages: [],
      };
      setViewingTicket(ticketWithClientId);
      setIsTicketDetailOpen(true);
    }
  };

  const handlePayInvoice = async (invoice: Invoice) => {
    if (!supabase || !user) {
      toast.error('Please log in to make a payment');
      return;
    }

    setProcessingInvoiceId(invoice.id);

    try {
      // Call the create-checkout-session Edge Function
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          invoice_id: invoice.id,
          success_url: `${window.location.origin}/client-portal?payment=success&invoice=${invoice.id}`,
          cancel_url: `${window.location.origin}/client-portal?payment=cancelled`,
        },
      });

      if (error) throw error;

      if (data?.checkout_url) {
        // Redirect to Stripe Checkout
        window.location.href = data.checkout_url;
      } else if (data?.demo_mode) {
        // Demo mode - show message
        toast.info('Payment demo mode - Stripe not configured', {
          description: 'In production, this would redirect to Stripe Checkout.',
        });
        setProcessingInvoiceId(null);
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment. Please try again.');
      setProcessingInvoiceId(null);
    }
  };

  const handleSubmitReply = async () => {
    if (!supabase || !user || !viewingTicket || !replyMessage.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    setIsSubmittingReply(true);
    try {
      // Get user profile ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!profile) {
        toast.error('Profile not found');
        return;
      }

      // Create reply message (clients can't create internal messages)
      const { data: reply, error: replyError } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: viewingTicket.id,
          user_id: profile.id,
          message: replyMessage.trim(),
          is_internal: false,
        })
        .select()
        .single();

      if (replyError) throw replyError;

      // Update ticket updated_at
      const { error: updateError } = await supabase
        .from('tickets')
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq('id', viewingTicket.id);

      if (updateError) {
        console.error('Error updating ticket:', updateError);
      }

      toast.success('Reply sent successfully');
      setReplyMessage('');

      // Reload ticket messages
      const { data: messages } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', viewingTicket.id)
        .eq('is_internal', false)
        .order('created_at', { ascending: true });

      if (viewingTicket) {
        setViewingTicket({
          ...viewingTicket,
          messages: messages || [],
        });
      }

      // Reload tickets list
      await loadUserData(user.id);
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast.error('Failed to send reply');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'bg-success/10 text-success border-success/20';
      case 'in_progress':
      case 'pending':
      case 'sent':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'review':
      case 'open':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'overdue':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatINR = (paise: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(paise / 100);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-28 pb-16 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Client Portal</h1>
              <p className="text-muted-foreground">
                Welcome back, {profile?.full_name || user?.email}
              </p>
              {profile?.client_code && (
                <p className="text-sm text-muted-foreground mt-1">
                  <User className="w-4 h-4 inline mr-1" />
                  Client ID: <span className="font-mono font-semibold">{profile.client_code}</span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button asChild>
                <Link to="/quote">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FolderKanban className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.activeProjects}</p>
                    <p className="text-sm text-muted-foreground">Active Projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      ₹{(stats.pendingAmount / 100).toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-muted-foreground">Pending Invoices</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.completedProjects}</p>
                    <p className="text-sm text-muted-foreground">Completed Projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.openTickets}</p>
                    <p className="text-sm text-muted-foreground">Open Tickets</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList className="bg-card/50 border border-border/50">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-4">
              {projects.length === 0 ? (
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-8 text-center">
                    <FolderKanban className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">No projects yet</p>
                    <Button asChild>
                      <Link to="/quote">Start Your First Project</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                projects.map((project) => (
                  <Card key={project.id} className="bg-card/50 backdrop-blur border-border/50">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{project.title}</h3>
                            <Badge variant="outline" className={getStatusColor(project.status)}>
                              {formatStatus(project.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {project.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Type: {project.project_type} | Started:{' '}
                            {project.start_date
                              ? new Date(project.start_date).toLocaleDateString()
                              : 'TBD'}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            setViewingProject(project);
                            // Load assigned staff
                            if (supabase) {
                              try {
                                const { data } = await (supabase as any)
                                  .from('project_staff_assignments')
                                  .select(`
                                    id,
                                    profiles:staff_id(full_name, email)
                                  `)
                                  .eq('project_id', project.id);
                                setAssignedStaff(data || []);
                              } catch (error) {
                                console.error('Error loading assigned staff:', error);
                              }
                            }
                          }}
                        >
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="invoices" className="space-y-4">
              {invoices.length === 0 ? (
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-8 text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No invoices yet</p>
                  </CardContent>
                </Card>
              ) : (
                invoices.map((invoice) => (
                  <Card key={invoice.id} className="bg-card/50 backdrop-blur border-border/50">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                            <FileText className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{invoice.invoice_number}</h3>
                            <p className="text-sm text-muted-foreground">
                              Due: {new Date(invoice.due_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              ₹{(Number(invoice.total_amount) / 100).toLocaleString('en-IN')}
                            </p>
                            <Badge variant="outline" className={getStatusColor(invoice.status)}>
                              {formatStatus(invoice.status)}
                            </Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingInvoice(invoice)}
                          >
                            View Details
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                          {['pending', 'sent', 'overdue'].includes(invoice.status) && (
                            <Button
                              size="sm"
                              className="glow-primary"
                              onClick={() => handlePayInvoice(invoice)}
                              disabled={processingInvoiceId === invoice.id}
                            >
                              {processingInvoiceId === invoice.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                'Pay Now'
                              )}
                            </Button>
                          )}
                          {invoice.status === 'paid' && invoice.pdf_url && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={invoice.pdf_url} target="_blank" rel="noopener noreferrer">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="support" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Support Tickets</h3>
                <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      New Ticket
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Support Ticket</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          placeholder="Brief description of your issue"
                          value={newTicket.title}
                          onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Provide details about your issue or request"
                          rows={4}
                          value={newTicket.description}
                          onChange={(e) =>
                            setNewTicket({ ...newTicket, description: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={newTicket.priority}
                          onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        className="w-full"
                        onClick={handleCreateTicket}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Creating...' : 'Create Ticket'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {tickets.length === 0 ? (
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">No support tickets yet</p>
                    <Button onClick={() => setIsTicketDialogOpen(true)}>
                      Create Your First Ticket
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                tickets.map((ticket) => (
                  <Card key={ticket.id} className="bg-card/50 backdrop-blur border-border/50">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold mb-1">{ticket.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {ticket.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getStatusColor(ticket.status)}>
                              {formatStatus(ticket.status)}
                            </Badge>
                            <Badge variant="secondary">{ticket.priority}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(ticket.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewTicket(ticket)}
                        >
                          View
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>

          {/* Ticket Details Dialog */}
          <Dialog
            open={isTicketDetailOpen}
            onOpenChange={(open) => {
              setIsTicketDetailOpen(open);
              if (!open) {
                setReplyMessage('');
              }
            }}
          >
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{viewingTicket?.title}</DialogTitle>
              </DialogHeader>
              {viewingTicket && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <Badge variant="outline" className={getStatusColor(viewingTicket.status)}>
                        {formatStatus(viewingTicket.status)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Priority</p>
                      <Badge variant="outline">{viewingTicket.priority}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Created</p>
                      <p className="text-sm">
                        {new Date(viewingTicket.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                      <p className="text-sm">
                        {new Date(viewingTicket.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                    <div className="p-4 bg-muted rounded-md">
                      <p className="text-sm whitespace-pre-wrap">{viewingTicket.description}</p>
                    </div>
                  </div>

                  {/* Messages Section */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Conversation</p>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {/* Initial ticket description as first message */}
                      <div className="p-3 rounded-md bg-muted">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">You</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(viewingTicket.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{viewingTicket.description}</p>
                      </div>

                      {/* Reply messages */}
                      {viewingTicket.messages && viewingTicket.messages.length > 0 && (
                        <>
                          {viewingTicket.messages.map((msg) => {
                            // Determine if message is from client or admin/staff
                            // Compare msg.user_id with ticket.client_id or current user.id to determine if it's from the client
                            const ticketClientId = viewingTicket.client_id || user?.id;
                            const isFromClient = msg.user_id === ticketClientId;
                            return (
                              <div
                                key={msg.id}
                                className={`p-3 rounded-md ${
                                  isFromClient
                                    ? 'bg-primary/10 border border-primary/20'
                                    : 'bg-muted'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-muted-foreground">
                                    {isFromClient ? 'You' : 'Support Team'}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(msg.created_at).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Reply Section */}
                  <div className="pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="reply-message">Reply</Label>
                      <Textarea
                        id="reply-message"
                        placeholder="Type your reply..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setIsTicketDetailOpen(false)}>
                        Close
                      </Button>
                      <Button
                        onClick={handleSubmitReply}
                        disabled={isSubmittingReply || !replyMessage.trim()}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {isSubmittingReply ? 'Sending...' : 'Send Reply'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Invoice Details Dialog */}
          <Dialog open={!!viewingInvoice} onOpenChange={() => setViewingInvoice(null)}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Invoice Details</DialogTitle>
              </DialogHeader>
              {viewingInvoice && (
                <div className="space-y-6">
                  {/* Header Section */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-4 border-b">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        Invoice {viewingInvoice.invoice_number}
                      </h2>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStatusColor(viewingInvoice.status)}>
                          {formatStatus(viewingInvoice.status)}
                        </Badge>
                        {viewingInvoice.paid_at && (
                          <span className="text-sm text-muted-foreground">
                            Paid on {formatDate(viewingInvoice.paid_at)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-3xl font-bold text-primary">
                        {formatINR(Number(viewingInvoice.total_amount))}
                      </p>
                    </div>
                  </div>

                  {/* Invoice Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Invoice Date</p>
                      <p className="font-medium">{formatDate(viewingInvoice.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Due Date</p>
                      <p className="font-medium">{formatDate(viewingInvoice.due_date)}</p>
                    </div>
                    {profile && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Bill To</p>
                          <p className="font-medium">{profile.full_name || 'N/A'}</p>
                          {profile.email && (
                            <p className="text-sm text-muted-foreground">{profile.email}</p>
                          )}
                          {profile.client_code && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Client ID: {profile.client_code}
                            </p>
                          )}
                        </div>
                        {profile.company_name && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                              Company
                            </p>
                            <p className="font-medium">{profile.company_name}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Items/Amount Breakdown */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Amount Breakdown</h3>
                    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-semibold">
                          {formatINR(Number(viewingInvoice.amount))}
                        </span>
                      </div>
                      {viewingInvoice.tax_amount && Number(viewingInvoice.tax_amount) > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Tax</span>
                          <span className="font-semibold">
                            {formatINR(Number(viewingInvoice.tax_amount))}
                          </span>
                        </div>
                      )}
                      <div className="border-t pt-3 flex justify-between items-center">
                        <span className="font-semibold text-lg">Total Amount</span>
                        <span className="font-bold text-xl text-primary">
                          {formatINR(Number(viewingInvoice.total_amount))}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Actions */}
                  {['pending', 'sent', 'overdue'].includes(viewingInvoice.status) && (
                    <div className="pt-4 border-t">
                      <Button
                        className="w-full glow-primary"
                        onClick={() => {
                          setViewingInvoice(null);
                          handlePayInvoice(viewingInvoice);
                        }}
                        disabled={processingInvoiceId === viewingInvoice.id}
                      >
                        {processingInvoiceId === viewingInvoice.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            Pay {formatINR(Number(viewingInvoice.total_amount))}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {viewingInvoice.status === 'paid' && viewingInvoice.pdf_url && (
                    <div className="pt-4 border-t">
                      <Button variant="outline" className="w-full" asChild>
                        <a href={viewingInvoice.pdf_url} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4 mr-2" />
                          Download Invoice PDF
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewingInvoice(null)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Project Details Dialog */}
          <Dialog open={!!viewingProject} onOpenChange={() => { setViewingProject(null); setAssignedStaff([]); }}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Project Details</DialogTitle>
              </DialogHeader>
              {viewingProject && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Title</p>
                    <p className="font-semibold text-lg">{viewingProject.title}</p>
                  </div>
                  {viewingProject.description && (
                    <div>
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p className="text-sm">{viewingProject.description}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <Badge variant="outline">{viewingProject.project_type}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant="outline" className={getStatusColor(viewingProject.status)}>
                        {formatStatus(viewingProject.status)}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="font-semibold">
                        {viewingProject.budget ? formatINR(Number(viewingProject.budget)) : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-medium">
                        {viewingProject.start_date
                          ? new Date(viewingProject.start_date).toLocaleDateString()
                          : 'TBD'}
                      </p>
                    </div>
                  </div>
                  {viewingProject.end_date && (
                    <div>
                      <p className="text-sm text-muted-foreground">End Date</p>
                      <p className="font-medium">
                        {new Date(viewingProject.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">
                      {new Date(viewingProject.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {/* Assigned Staff Section */}
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-4 h-4" />
                      <p className="text-sm font-semibold">Assigned Staff</p>
                    </div>
                    {assignedStaff.length > 0 ? (
                      <div className="space-y-2">
                        {assignedStaff.map((assignment) => (
                          <div key={assignment.id} className="flex items-center p-2 bg-muted rounded-md">
                            <span className="text-sm">
                              {assignment.profiles?.full_name || assignment.profiles?.email || 'Staff Member'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No staff assigned yet</p>
                    )}
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewingProject(null)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </Layout>
  );
}
