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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Search, Calendar, RefreshCw, Eye, Clock } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type BookingWithClient = Tables<'bookings'>;

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

  const loadBookings = useCallback(async () => {
    if (!supabase) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('scheduled_at', { ascending: true });

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
  }, [initializeBookings]);

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
    setViewingBooking(booking);
  };

  const handleReschedule = async (bookingId: string) => {
    if (!supabase) return;
    const newDate = window.prompt('Enter new date (YYYY-MM-DD):');
    if (!newDate) return;
    const newTime = window.prompt('Enter new time (HH:MM, 24h):');
    if (!newTime) return;

    // Basic validation
    const dateRe = /^\d{4}-\d{2}-\d{2}$/;
    const timeRe = /^\d{2}:\d{2}$/;
    if (!dateRe.test(newDate)) {
      toast.error('Invalid date format. Use YYYY-MM-DD');
      return;
    }
    if (!timeRe.test(newTime)) {
      toast.error('Invalid time format. Use HH:MM (24h)');
      return;
    }
    const parsed = new Date(`${newDate}T${newTime}`);
    if (isNaN(parsed.getTime())) {
      toast.error('Invalid date/time');
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ date: newDate, time_slot: newTime })
        .eq('id', bookingId);

      if (error) {
        console.error('Supabase reschedule error', error);
        toast.error(error.message || 'Failed to reschedule booking');
        return;
      }

      toast.success('Booking rescheduled');
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
        // Show specific message when available
        const msg = error.message || 'Failed to cancel booking';
        // Common cause: RLS / permission error — hint to check admin role
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

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      (booking.service_type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.name || '').toLowerCase().includes(searchTerm.toLowerCase());
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
      const dt = new Date(`${b.date}T${b.time_slot || '00:00'}`);
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
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => {
                      const scheduledDate = new Date(
                        `${booking.date}T${booking.time_slot || '00:00'}`
                      );
                      const isPast = scheduledDate < new Date();

                      return (
                        <TableRow key={booking.id} className={isPast ? 'opacity-60' : ''}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{booking.name || 'N/A'}</p>
                              <p className="text-xs text-muted-foreground">{booking.email}</p>
                              {booking.phone && (
                                <p className="text-xs font-mono text-primary">{booking.phone}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{booking.service_type}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{scheduledDate.toLocaleDateString()}</p>
                              <p className="text-xs text-muted-foreground">
                                {scheduledDate.toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {booking.duration_minutes
                              ? `${booking.duration_minutes} min`
                              : booking.time_slot || '-'}
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
                            <Button variant="ghost" size="sm" onClick={() => handleView(booking)}>
                              <Eye className="w-4 h-4" />
                            </Button>
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
          {viewingBooking && (
            <div className="space-y-4 py-2">
              <div>
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="font-medium">{viewingBooking.name}</p>
                <p className="text-xs text-muted-foreground">{viewingBooking.email}</p>
                {viewingBooking.phone && (
                  <p className="text-xs text-primary">{viewingBooking.phone}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium">{viewingBooking.service_type || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date & Time</p>
                <p className="font-medium">
                  {new Date(
                    `${viewingBooking.date}T${viewingBooking.time_slot || '00:00'}`
                  ).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="font-medium">{viewingBooking.notes || '-'}</p>
              </div>
            </div>
          )}
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
    </div>
  );
}
