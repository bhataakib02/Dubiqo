import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Search, Calendar, RefreshCw, Eye, Clock, Edit, Trash2, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';
import { DateTimePicker } from '@/components/ui/date-time-picker';

type BookingWithClient = Tables<'bookings'> & {
  client?: { full_name: string | null; email: string; client_code: string | null } | null;
  assigned_staff?: { id: string; full_name: string | null; email: string; metadata: any } | null;
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState<BookingWithClient[]>([]);
  const [viewingBooking, setViewingBooking] = useState<BookingWithClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [staffOnlyView, setStaffOnlyView] = useState(false);
  const [myClientIds, setMyClientIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [reschedulingBookingId, setReschedulingBookingId] = useState<string | null>(null);
  const [newScheduledAt, setNewScheduledAt] = useState<string>('');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<BookingWithClient | null>(null);
  const [editFormData, setEditFormData] = useState({
    booking_type: '',
    scheduled_at: '',
    duration_minutes: '',
    notes: '',
    status: '',
    assigned_to: '',
  });
  const [staffMembers, setStaffMembers] = useState<Array<{ id: string; full_name: string | null; email: string; role?: string }>>([]);

  const loadStaffMembers = useCallback(async () => {
    if (!supabase) return;
    try {
      // Get all users with staff or admin role
      const { data: roles } = await supabase
        .from('user_roles')
        .select('user_id')
        .in('role', ['staff', 'admin']);
      
      if (!roles || roles.length === 0) {
        setStaffMembers([]);
        return;
      }

      const userIds = roles.map((r) => r.user_id);
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, metadata')
        .in('id', userIds);

      if (error) throw error;

      const staffWithRoles = (profiles || []).map((p) => {
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
  }, []);

  const loadBookings = useCallback(async () => {
    if (!supabase) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          client:profiles!bookings_client_id_fkey(full_name, email, client_code)
        `)
        .order('scheduled_at', { ascending: true });

      // Load assigned staff separately if assigned_to column exists
      if (data && data.length > 0) {
        const assignedToIds = data
          .map((b: any) => b.assigned_to)
          .filter((id: string | null) => id !== null) as string[];
        
        if (assignedToIds.length > 0) {
          const { data: staffProfiles } = await supabase
            .from('profiles')
            .select('id, full_name, email, metadata')
            .in('id', assignedToIds);
          
          const staffMap = new Map((staffProfiles || []).map((s: any) => [s.id, s]));
          
          // Add assigned_staff to each booking
          data.forEach((booking: any) => {
            if (booking.assigned_to && staffMap.has(booking.assigned_to)) {
              booking.assigned_staff = staffMap.get(booking.assigned_to);
            }
          });
        }
      }

      if (error) throw error;

      let result = data || [];
      if (staffOnlyView && myClientIds.size > 0) {
        // Only bookings whose client is both in myClientIds and the client has the role 'client'
        const clientRoleMap = new Map<string, string>();
        try {
          const { data: roles } = await supabase.from('user_roles').select('user_id, role');
          (roles || []).forEach((r: any) => {
            if (r.role === 'client') clientRoleMap.set(r.user_id, 'client');
          });
        } catch {
          // Ignore errors when fetching user roles
        }
        result = result.filter((b: any) => b.client_id && myClientIds.has(b.client_id) && clientRoleMap.has(b.client_id));
      }
      setBookings(result);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  }, [staffOnlyView, myClientIds]);

  const initializeBookings = useCallback(async () => {
    if (!supabase) {
      await loadBookings();
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        await loadBookings();
        return;
      }

      setCurrentUserId(user.id);

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      const isAdmin = roles?.some((r) => r.role === 'admin');
      const isStaff = roles?.some((r) => r.role === 'staff');
      const staffOnly = !!isStaff && !isAdmin;
      setStaffOnlyView(staffOnly);

      if (staffOnly) {
        const { data: myTickets, error } = await supabase
          .from('tickets')
          .select('client_id')
          .eq('assigned_to', user.id);

        if (error) {
          console.error('Error loading staff booking tickets:', error);
        } else {
          const ids = new Set<string>();
          (myTickets || []).forEach((t: any) => {
            if (t.client_id) ids.add(t.client_id);
          });
          setMyClientIds(ids);
        }
      }

      await loadBookings();
    } catch (error) {
      console.error('Error initializing bookings view:', error);
      await loadBookings();
    }
  }, [loadBookings]);

  useEffect(() => {
    initializeBookings();
    loadStaffMembers();
  }, [initializeBookings, loadStaffMembers]);

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;
      toast.success('Booking status updated');
      loadBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    }
  };

  const handleView = async (booking: BookingWithClient) => {
    // Ensure we have the latest booking data with client relationship
    if (!supabase) {
      setViewingBooking(booking);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          client:profiles!bookings_client_id_fkey(full_name, email, client_code)
        `)
        .eq('id', booking.id)
        .single();
      
      if (error) throw error;
      setViewingBooking(data);
    } catch (error) {
      console.error('Error loading booking details:', error);
      // Fallback to the booking data we already have
      setViewingBooking(booking);
    }
  };

  const handleReschedule = (bookingId: string) => {
    // Find the booking to pre-populate the date
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking && booking.scheduled_at) {
      setNewScheduledAt(booking.scheduled_at);
    } else {
      // Default to current date/time if no booking found
      setNewScheduledAt(new Date().toISOString());
    }
    setReschedulingBookingId(bookingId);
    setIsRescheduleOpen(true);
  };

  const submitReschedule = async () => {
    if (!supabase || !reschedulingBookingId) return;
    
    if (!newScheduledAt) {
      toast.error('Please select a date and time');
      return;
    }

    // Validate the date
    const parsed = new Date(newScheduledAt);
    if (isNaN(parsed.getTime())) {
      toast.error('Invalid date/time');
      return;
    }

    // Ensure the date is in the future
    if (parsed <= new Date()) {
      toast.error('Please select a future date and time');
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          scheduled_at: parsed.toISOString(),
        })
        .eq('id', reschedulingBookingId);

      if (error) {
        console.error('Supabase reschedule error', error);
        toast.error(error.message || 'Failed to reschedule booking');
        return;
      }

      toast.success('Booking rescheduled successfully');
      setIsRescheduleOpen(false);
      setReschedulingBookingId(null);
      setNewScheduledAt('');
      setViewingBooking(null);
      loadBookings();
    } catch (err: any) {
      console.error('Error rescheduling booking', err);
      const msg = err?.message || String(err);
      toast.error(msg || 'Failed to reschedule booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!supabase) return;
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) {
        console.error('Supabase cancel error', error);
        const msg = error.message || 'Failed to cancel booking';
        if (
          (error as any)?.status === 401 ||
          (error as any)?.status === 403 ||
          /permission|row level security|RLS/i.test(msg)
        ) {
          toast.error(`${msg}. Permission denied — ensure you are signed in as an admin.`);
        } else {
          toast.error(msg);
        }
        return;
      }

      toast.success('Booking cancelled');
      setViewingBooking(null);
      loadBookings();
    } catch (err: any) {
      console.error('Error cancelling booking', err);
      const msg = err?.message || String(err);
      toast.error(msg || 'Failed to cancel booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (booking: BookingWithClient) => {
    setEditingBooking(booking);
    setEditFormData({
      booking_type: booking.booking_type || '',
      scheduled_at: booking.scheduled_at || new Date().toISOString(),
      duration_minutes: booking.duration_minutes?.toString() || '',
      notes: booking.notes || '',
      status: booking.status || 'pending',
      assigned_to: (booking as any).assigned_to || '',
    });
    // Ensure staff members are loaded when opening edit dialog
    if (staffMembers.length === 0) {
      loadStaffMembers();
    }
    setIsEditOpen(true);
  };

  const handleDelete = async (bookingId: string) => {
    if (!supabase) return;
    if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) return;
    
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;
      toast.success('Booking deleted successfully');
      if (viewingBooking?.id === bookingId) {
        setViewingBooking(null);
      }
      loadBookings();
    } catch (err: any) {
      console.error('Error deleting booking', err);
      const msg = err?.message || String(err);
      toast.error(msg || 'Failed to delete booking');
    } finally {
      setActionLoading(false);
    }
  };

  const submitEdit = async () => {
    if (!supabase || !editingBooking) return;

    if (!editFormData.booking_type || !editFormData.scheduled_at) {
      toast.error('Please fill all required fields');
      return;
    }

    const parsedDate = new Date(editFormData.scheduled_at);
    if (isNaN(parsedDate.getTime())) {
      toast.error('Invalid date/time');
      return;
    }

    setActionLoading(true);
    try {
      const updateData: any = {
        booking_type: editFormData.booking_type,
        scheduled_at: parsedDate.toISOString(),
        status: editFormData.status,
        notes: editFormData.notes || null,
        assigned_to: editFormData.assigned_to || null,
      };

      if (editFormData.duration_minutes) {
        const duration = parseInt(editFormData.duration_minutes);
        if (!isNaN(duration) && duration > 0) {
          updateData.duration_minutes = duration;
        }
      }

      const { error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', editingBooking.id);

      if (error) throw error;
      toast.success('Booking updated successfully');
      setIsEditOpen(false);
      setEditingBooking(null);
      setViewingBooking(null);
      loadBookings();
    } catch (err: any) {
      console.error('Error updating booking', err);
      const msg = err?.message || String(err);
      toast.error(msg || 'Failed to update booking');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const metadata = booking.metadata as any;
    const clientEmail = booking.client?.email || '';
    const clientName = booking.client?.full_name || '';
    const metadataEmail = metadata?.email || '';
    const metadataName = metadata?.firstName && metadata?.lastName 
      ? `${metadata.firstName} ${metadata.lastName}`
      : metadata?.firstName || metadata?.name || '';
    
    const matchesSearch =
      (booking.notes || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.booking_type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      metadataEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      metadataName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'confirmed':
        return 'bg-success/10 text-success border-success/20';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'completed':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'no_show':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const upcomingBookings = filteredBookings.filter((b) => {
    try {
      if (!b.scheduled_at) return false;
      const dt = new Date(b.scheduled_at);
      return dt > new Date() && b.status !== 'cancelled';
    } catch (e) {
      return false;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Bookings</h1>
              <p className="text-muted-foreground">Manage appointments and consultations</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Summary */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming Bookings</p>
                  <p className="text-2xl font-bold">{upcomingBookings.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">{filteredBookings.length}</p>
                </div>
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <CardTitle>All Bookings ({filteredBookings.length})</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search bookings..."
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no_show">No Show</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={loadBookings} disabled={isLoading}>
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
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No bookings found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Assigned Staff</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => {
                      let scheduledDate: Date;
                      try {
                        scheduledDate = booking.scheduled_at ? new Date(booking.scheduled_at) : new Date();
                      } catch {
                        scheduledDate = new Date();
                      }
                      const isPast = scheduledDate < new Date();

                      // Get client info from client profile or metadata
                      const metadata = booking.metadata as any;
                      const clientName = booking.client?.full_name || 
                        (metadata?.firstName && metadata?.lastName 
                          ? `${metadata.firstName} ${metadata.lastName}`
                          : metadata?.firstName || metadata?.name || 'N/A');
                      const clientEmail = booking.client?.email || metadata?.email || '';
                      const clientPhone = metadata?.phone || '';

                      return (
                        <TableRow key={booking.id} className={isPast ? 'opacity-60' : ''}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{clientName}</p>
                              {clientEmail && (
                                <p className="text-xs text-muted-foreground">{clientEmail}</p>
                              )}
                              {clientPhone && (
                                <p className="text-xs font-mono text-primary">{clientPhone}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{booking.booking_type || '-'}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {isNaN(scheduledDate.getTime()) 
                                  ? 'Invalid Date' 
                                  : scheduledDate.toLocaleDateString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {isNaN(scheduledDate.getTime())
                                  ? 'Invalid Time'
                                  : scheduledDate.toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {booking.duration_minutes
                              ? `${booking.duration_minutes} min`
                              : '-'}
                          </TableCell>
                          <TableCell>
                            {(booking as any).assigned_staff ? (
                              <div>
                                <p className="font-medium">{(booking as any).assigned_staff.full_name || (booking as any).assigned_staff.email}</p>
                                {(booking as any).assigned_staff.metadata && ((booking as any).assigned_staff.metadata as any)?.role && (
                                  <p className="text-xs text-muted-foreground">{((booking as any).assigned_staff.metadata as any).role}</p>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Unassigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {booking.assigned_staff ? (
                              <div>
                                <p className="font-medium">{booking.assigned_staff.full_name || booking.assigned_staff.email}</p>
                                {booking.assigned_staff.metadata && (booking.assigned_staff.metadata as any)?.role && (
                                  <p className="text-xs text-muted-foreground">{(booking.assigned_staff.metadata as any).role}</p>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Unassigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={booking.status}
                              onValueChange={(value) => updateBookingStatus(booking.id, value)}
                            >
                              <SelectTrigger className="w-28 h-8">
                                <Badge variant="outline" className={getStatusColor(booking.status)}>
                                  {booking.status.replace('_', ' ')}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                <SelectItem value="no_show">No Show</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {booking.notes || '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleView(booking)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(booking)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleReschedule(booking.id)}>
                                  <Calendar className="w-4 h-4 mr-2" />
                                  Reschedule
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(booking.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      {/* View Booking Dialog */}
      <Dialog open={!!viewingBooking} onOpenChange={() => setViewingBooking(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {viewingBooking && (() => {
            const metadata = viewingBooking.metadata as any;
            const clientName = viewingBooking.client?.full_name || 
              (metadata?.firstName && metadata?.lastName 
                ? `${metadata.firstName} ${metadata.lastName}`
                : metadata?.firstName || metadata?.name || 'N/A');
            const clientEmail = viewingBooking.client?.email || metadata?.email || '';
            const clientPhone = metadata?.phone || '';
            let scheduledDate: Date;
            try {
              scheduledDate = viewingBooking.scheduled_at ? new Date(viewingBooking.scheduled_at) : new Date();
            } catch {
              scheduledDate = new Date();
            }
            
            return (
              <div className="space-y-4 py-2">
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{clientName}</p>
                  {clientEmail && (
                    <p className="text-xs text-muted-foreground">{clientEmail}</p>
                  )}
                  {clientPhone && (
                    <p className="text-xs text-primary">{clientPhone}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{viewingBooking.booking_type || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium">
                    {isNaN(scheduledDate.getTime()) 
                      ? 'Invalid Date' 
                      : scheduledDate.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {viewingBooking.duration_minutes ? `${viewingBooking.duration_minutes} min` : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="font-medium">{viewingBooking.notes || '-'}</p>
                </div>
              </div>
            );
          })()}
          <DialogFooter>
            {viewingBooking && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleReschedule(viewingBooking.id)}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Rescheduling...' : 'Reschedule'}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleCancelBooking(viewingBooking.id)}
                  disabled={actionLoading}
                >
                  Cancel Booking
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => setViewingBooking(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reschedule Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Select New Date & Time</Label>
              <DateTimePicker
                value={newScheduledAt}
                onChange={(value) => setNewScheduledAt(value)}
                placeholder="Select date and time"
                fromDate={new Date()}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Please select a future date and time for the booking.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRescheduleOpen(false);
                setReschedulingBookingId(null);
                setNewScheduledAt('');
              }}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={submitReschedule}
              disabled={actionLoading || !newScheduledAt}
            >
              {actionLoading ? 'Rescheduling...' : 'Reschedule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Booking Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
          </DialogHeader>
          {editingBooking && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Booking Type *</Label>
                <Input
                  value={editFormData.booking_type}
                  onChange={(e) => setEditFormData({ ...editFormData, booking_type: e.target.value })}
                  placeholder="e.g., consultation, review, support"
                />
              </div>
              <div className="space-y-2">
                <Label>Date & Time *</Label>
                <DateTimePicker
                  value={editFormData.scheduled_at}
                  onChange={(value) => setEditFormData({ ...editFormData, scheduled_at: value })}
                  placeholder="Select date and time"
                />
              </div>
              <div className="space-y-2">
                <Label>Assign Staff</Label>
                <Select
                  value={editFormData.assigned_to || 'unassigned'}
                  onValueChange={(value) => setEditFormData({ ...editFormData, assigned_to: value === 'unassigned' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">None (Unassigned)</SelectItem>
                    {staffMembers.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.full_name || staff.email} {staff.role && `(${staff.role})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={editFormData.duration_minutes}
                    onChange={(e) => setEditFormData({ ...editFormData, duration_minutes: e.target.value })}
                    placeholder="45"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editFormData.status}
                    onValueChange={(value) => setEditFormData({ ...editFormData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="no_show">No Show</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <textarea
                  className="w-full min-h-[100px] px-3 py-2 text-sm border rounded-md bg-background"
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                  placeholder="Additional notes..."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditOpen(false);
                setEditingBooking(null);
              }}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button onClick={submitEdit} disabled={actionLoading}>
              {actionLoading ? 'Updating...' : 'Update Booking'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
