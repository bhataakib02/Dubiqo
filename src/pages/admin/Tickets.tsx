import { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import {
  ArrowLeft,
  Search,
  Ticket,
  RefreshCw,
  Eye,
  MoreVertical,
  MessageSquare,
  UserPlus,
  Trash2,
  Mail,
  Download,
  Send,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type TicketWithClient = Tables<'tickets'> & {
  client?: { email: string; full_name: string | null; client_code: string | null } | null;
  messages?: Array<{
    id: string;
    message: string;
    is_internal: boolean | null;
    created_at: string;
    user_id: string;
  }>;
};

export default function AdminTickets() {
  const [tickets, setTickets] = useState<TicketWithClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [staffOnlyView, setStaffOnlyView] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<TicketWithClient | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [assigningTicket, setAssigningTicket] = useState<TicketWithClient | null>(null);
  const [staffMembers, setStaffMembers] = useState<
    Array<{ id: string; full_name: string | null; email: string; role?: string }>
  >([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('unassign');
  const [projects, setProjects] = useState<Array<{ id: string; title: string; client_id: string }>>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('none');

  const location = useLocation();
  const cameFromStaff = (location.state as any)?.from === 'staff';
  const backHref = cameFromStaff ? '/staff' : '/admin/dashboard';
  const backLabel = cameFromStaff ? 'Back to Staff Workspace' : 'Back to Dashboard';

  const initializeTickets = useCallback(async () => {
    if (!supabase) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        await loadTickets();
        return;
      }

      setCurrentUserId(user.id);

      // Determine if this user is staff-only (staff but not admin)
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      const isAdmin = roles?.some((r) => r.role === 'admin');
      const isStaff = roles?.some((r) => r.role === 'staff');
      const staffOnly = !!isStaff && !isAdmin;
      setStaffOnlyView(staffOnly);

      await loadTickets(user.id, staffOnly);
    } catch (error) {
      console.error('Error initializing tickets view:', error);
      await loadTickets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    initializeTickets();
    loadStaffMembers();
  }, [initializeTickets]);

  const loadStaffMembers = async () => {
    if (!supabase) return;
    try {
      // Load all admin and staff users
      const { data: roles } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('role', ['admin', 'staff']);

      if (!roles || roles.length === 0) {
        setStaffMembers([]);
        return;
      }

      const userIds = roles.map((r) => r.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email, metadata')
        .in('id', userIds);

      // Add descriptive role from metadata
      const staffWithRoles = (profiles || []).map(p => {
        const metadata = p.metadata as any;
        const descriptiveRole = metadata?.role || metadata?.job_title || metadata?.position || 'staff';
        return {
          ...p,
          role: descriptiveRole
        };
      });

      setStaffMembers(staffWithRoles);
    } catch (error) {
      console.error('Error loading staff members:', error);
      setStaffMembers([]);
    }
  };

  const loadProjectsForClient = async (clientId: string) => {
    if (!supabase || !clientId) {
      setProjects([]);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, client_id')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    }
  };

  const loadTickets = async (userIdParam?: string, staffOnlyParam?: boolean) => {
    if (!supabase) return;
    setIsLoading(true);

    try {
      const userId = userIdParam ?? currentUserId;
      const staffOnly = staffOnlyParam ?? staffOnlyView;

      let query = supabase
        .from('tickets')
        .select(
          `
          *,
          client:profiles!tickets_client_id_fkey(email, full_name, client_code)
        `
        )
        .order('created_at', { ascending: false });

      // For staff users (non-admin), show only tickets assigned to them
      if (staffOnly && userId) {
        query = query.eq('assigned_to', userId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast.error('Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', ticketId);

      if (error) throw error;
      toast.success('Ticket status updated');
      loadTickets();
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error('Failed to update ticket');
    }
  };

  const handleViewTicket = async (ticket: TicketWithClient) => {
    setOpenDropdownId(null); // Close dropdown
    // Load ticket with messages
    try {
      const { data: messages } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', ticket.id)
        .order('created_at', { ascending: true });

      setSelectedTicket({
        ...ticket,
        messages: messages || [],
      });
      setIsDetailOpen(true);
    } catch (error) {
      console.error('Error loading ticket messages:', error);
      toast.error('Failed to load ticket messages');
      setSelectedTicket({
        ...ticket,
        messages: [],
      });
      setIsDetailOpen(true);
    }
  };

  const handleReplyTicket = (ticket: TicketWithClient) => {
    setOpenDropdownId(null); // Close dropdown
    setSelectedTicket(ticket);
    setReplyMessage('');
    setIsInternal(false);
    setIsReplyOpen(true);
  };

  const submitReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    setIsSubmittingReply(true);

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to reply');
        return;
      }

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

      // Create reply message
      const { data: reply, error: replyError } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: selectedTicket.id,
          user_id: profile.id,
          message: replyMessage.trim(),
          is_internal: isInternal,
        })
        .select()
        .single();

      if (replyError) throw replyError;

      // Update ticket status and updated_at
      // If ticket was closed, reopen it when a reply is added
      const newStatus = selectedTicket.status === 'closed' ? 'open' : selectedTicket.status;
      const { error: updateError } = await supabase
        .from('tickets')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedTicket.id);

      if (updateError) {
        console.error('Error updating ticket:', updateError);
        // Don't fail the whole operation if status update fails
      }

      toast.success('Reply sent successfully');
      setIsReplyOpen(false);
      setReplyMessage('');
      setIsInternal(false);

      // Reload tickets to show updated status
      await loadTickets();

      // If detail dialog was open, refresh the ticket data with messages
      if (isDetailOpen && selectedTicket) {
        // Reload the ticket with updated messages
        const { data: messages } = await supabase
          .from('ticket_messages')
          .select('*')
          .eq('ticket_id', selectedTicket.id)
          .order('created_at', { ascending: true });

        // Get updated ticket from fresh load
        const { data: updatedTicketData } = await supabase
          .from('tickets')
          .select(
            `
            *,
            client:profiles!tickets_client_id_fkey(email, full_name, client_code)
          `
          )
          .eq('id', selectedTicket.id)
          .single();

        if (updatedTicketData) {
          setSelectedTicket({
            ...updatedTicketData,
            messages: messages || [],
          });
        }
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast.error('Failed to send reply');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleAssignTicket = async (ticket: TicketWithClient) => {
    setOpenDropdownId(null); // Close dropdown
    setAssigningTicket(ticket);
    setSelectedStaffId(ticket.assigned_to || 'unassign');
    setSelectedProjectId(ticket.project_id || 'none');
    // Load projects for this ticket's client
    if (ticket.client_id) {
      await loadProjectsForClient(ticket.client_id);
    }
    setIsAssignDialogOpen(true);
  };

  const submitAssignTicket = async () => {
    if (!assigningTicket) {
      toast.error('No ticket selected');
      return;
    }

    try {
      const isUnassigning = selectedStaffId === 'unassign';
      const updateData: { assigned_to: string | null; updated_at: string; status?: string; project_id?: string | null } = {
        assigned_to: isUnassigning ? null : selectedStaffId,
        updated_at: new Date().toISOString(),
        project_id: selectedProjectId === 'none' ? null : selectedProjectId,
      };

      // Only auto-update status if assigning (not unassigning)
      if (!isUnassigning && assigningTicket.status === 'open') {
        updateData.status = 'in_progress';
      }

      const { error } = await supabase
        .from('tickets')
        .update(updateData)
        .eq('id', assigningTicket.id);

      if (error) throw error;

      if (isUnassigning) {
        toast.success('Ticket unassigned');
      } else {
        const assignedStaff = staffMembers.find((s) => s.id === selectedStaffId);
        toast.success(
          `Ticket assigned to ${assignedStaff?.full_name || assignedStaff?.email || 'staff member'}`
        );
      }

      setIsAssignDialogOpen(false);
      setAssigningTicket(null);
      setSelectedStaffId('unassign');
      setSelectedProjectId('none');
      setProjects([]);
      await loadTickets();
    } catch (error) {
      console.error('Error assigning ticket:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to assign ticket: ${errorMessage}`);
    }
  };

  const handleEmailClient = (ticket: TicketWithClient) => {
    if (!ticket.client?.email) {
      toast.error('Client email not available');
      return;
    }
    // Open email client or copy email
    const subject = encodeURIComponent(`Re: ${ticket.title}`);
    window.location.href = `mailto:${ticket.client.email}?subject=${subject}`;
    toast.success('Opening email client...');
  };

  const handleDeleteTicket = async (ticket: TicketWithClient) => {
    if (!supabase) return;
    if (!confirm(`Are you sure you want to delete ticket "${ticket.title}"?`)) {
      return;
    }

    try {
      const { error } = await supabase.from('tickets').delete().eq('id', ticket.id);

      if (error) throw error;
      toast.success('Ticket deleted successfully');
      await loadTickets();
    } catch (error) {
      console.error('Error deleting ticket:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to delete ticket: ${errorMessage}`);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.client?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.client?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.client?.client_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'resolved':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'closed':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'high':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'medium':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'low':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to={backHref}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {backLabel}
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Support Tickets</h1>
              <p className="text-muted-foreground">Manage customer support requests</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5" />
                <CardTitle>All Tickets ({filteredTickets.length})</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={loadTickets} disabled={isLoading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="text-center py-8">
                <Ticket className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No tickets found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{ticket.client?.full_name || 'N/A'}</p>
                            <p className="text-xs text-muted-foreground">
                              {ticket.client?.email || 'N/A'}
                            </p>
                            {ticket.client?.client_code && (
                              <p className="text-xs font-mono text-primary">
                                {ticket.client.client_code}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{ticket.title}</TableCell>
                        <TableCell>{ticket.category || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={ticket.status}
                            onValueChange={(value) => updateTicketStatus(ticket.id, value)}
                          >
                            <SelectTrigger className="w-32 h-8 border-0 p-0">
                              <Badge variant="outline" className={getStatusColor(ticket.status)}>
                                {formatStatus(ticket.status)}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">Open</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {new Date(ticket.created_at).toLocaleDateString('en-US', {
                            month: 'numeric',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu
                            open={openDropdownId === ticket.id}
                            onOpenChange={(open) => setOpenDropdownId(open ? ticket.id : null)}
                          >
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewTicket(ticket)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReplyTicket(ticket)}>
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Reply
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAssignTicket(ticket)}>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Assign
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setOpenDropdownId(null);
                                  handleEmailClient(ticket);
                                }}
                              >
                                <Mail className="w-4 h-4 mr-2" />
                                Email Client
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setOpenDropdownId(null);
                                  handleDeleteTicket(ticket);
                                }}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Ticket Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTicket?.title}</DialogTitle>
            <DialogDescription>Ticket Details</DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Client</p>
                  <p className="font-medium">{selectedTicket.client?.full_name || 'N/A'}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedTicket.client?.email || 'N/A'}
                  </p>
                  {selectedTicket.client?.client_code && (
                    <p className="text-xs font-mono text-primary">
                      {selectedTicket.client.client_code}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant="outline" className={getStatusColor(selectedTicket.status)}>
                    {formatStatus(selectedTicket.status)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Priority</p>
                  <Badge variant="outline" className={getPriorityColor(selectedTicket.priority)}>
                    {selectedTicket.priority}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <p>{selectedTicket.category || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p>
                    {new Date(selectedTicket.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p>
                    {new Date(selectedTicket.updated_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                <div className="p-4 bg-muted rounded-md">
                  <p className="whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>
              </div>

              {/* Messages Section */}
              {selectedTicket.messages && selectedTicket.messages.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Messages</p>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedTicket.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-md ${
                          msg.is_internal ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-muted'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">
                            {msg.is_internal ? 'Internal Note' : 'Public Reply'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(msg.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDetailOpen(false);
                    handleReplyTicket(selectedTicket);
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Reply
                </Button>
                <Link to="/admin/projects">
                  <Button variant="ghost" size="sm">
                    View Client Projects
                  </Button>
                </Link>
                <Link to="/admin/invoices">
                  <Button variant="ghost" size="sm">
                    View Client Invoices
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reply to Ticket</DialogTitle>
            <DialogDescription>
              {selectedTicket?.title} - {selectedTicket?.client?.email}
            </DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="reply-message">Message</Label>
                <Textarea
                  id="reply-message"
                  placeholder="Enter your reply..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={6}
                  className="mt-2"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="internal-note"
                  checked={isInternal}
                  onCheckedChange={(checked) => setIsInternal(checked === true)}
                />
                <Label htmlFor="internal-note" className="text-sm font-normal cursor-pointer">
                  Internal note (not visible to client)
                </Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsReplyOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={submitReply} disabled={isSubmittingReply || !replyMessage.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmittingReply ? 'Sending...' : 'Send Reply'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Ticket Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Ticket</DialogTitle>
            <DialogDescription>{assigningTicket?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="assign-staff">Assign to</Label>
              <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                <SelectTrigger id="assign-staff">
                  <SelectValue placeholder="Select a staff member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassign">Unassign</SelectItem>
                  {staffMembers.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.full_name || staff.email} {staff.role && `(${staff.role})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {assigningTicket?.client_id && (
              <div className="space-y-2">
                <Label htmlFor="assign-project">Assign to Project (Optional)</Label>
                <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                  <SelectTrigger id="assign-project">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Project</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAssignDialogOpen(false);
                  setAssigningTicket(null);
                  setSelectedStaffId('unassign');
                  setSelectedProjectId('none');
                  setProjects([]);
                }}
              >
                Cancel
              </Button>
              <Button onClick={submitAssignTicket}>
                {selectedStaffId === 'unassign' ? 'Unassign' : 'Assign'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
