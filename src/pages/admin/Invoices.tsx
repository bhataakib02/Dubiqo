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
import { DatePicker } from '@/components/ui/date-picker';
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
import {
  ArrowLeft,
  Search,
  IndianRupee,
  RefreshCw,
  Eye,
  Plus,
  Edit,
  Trash2,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

const formatINR = (paise: number) => {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(rupees);
};

type InvoiceWithClient = Tables<'invoices'> & {
  client?: { email: string; full_name: string | null; client_code: string | null } | null;
};

type Profile = { id: string; email: string; full_name: string | null; client_code: string | null };

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState<InvoiceWithClient[]>([]);
  const [clients, setClients] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [staffOnlyView, setStaffOnlyView] = useState(false);
  const [myClientIds, setMyClientIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceWithClient | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<InvoiceWithClient | null>(null);

  const [formData, setFormData] = useState({
    client_id: '',
    amount: '',
    tax_amount: '0',
    due_date: '',
    status: 'draft',
  });

  const initializeInvoices = useCallback(async () => {
    if (!supabase) {
      await loadInvoices();
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        await loadInvoices();
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
          console.error('Error loading staff invoice tickets:', error);
        } else {
          const ids = new Set<string>();
          (myTickets || []).forEach((t: any) => {
            if (t.client_id) ids.add(t.client_id);
          });
          setMyClientIds(ids);
        }
      }

      await loadInvoices();
    } catch (error) {
      console.error('Error initializing invoices view:', error);
      await loadInvoices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    initializeInvoices();
    loadClients();
  }, [initializeInvoices]);

  const loadClients = async () => {
    if (!supabase) return;
    try {
      // First, clear existing clients to avoid stale data
      setClients([]);
      
      // Get all admin and staff user IDs to exclude them
      // This ensures users who have both 'client' and 'staff'/'admin' roles are excluded
      const { data: adminStaffRoles, error: excludeError } = await supabase
        .from('user_roles')
        .select('user_id')
        .in('role', ['admin', 'staff']);

      if (excludeError) {
        console.error('Error loading admin/staff roles:', excludeError);
        throw excludeError; // Fail early if we can't get the exclusion list
      }

      const adminStaffIds = new Set<string>();
      if (adminStaffRoles) {
        adminStaffRoles.forEach((r) => adminStaffIds.add(r.user_id));
      }

      // Get all profiles that have a 'client' role
      const { data: clientRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'client');

      if (rolesError) throw rolesError;

      if (!clientRoles || clientRoles.length === 0) {
        console.log('No client roles found');
        setClients([]);
        return;
      }

      // Filter out any user IDs that are in the adminStaffIds set
      const pureClientIds = clientRoles
        .map((r) => r.user_id)
        .filter((id) => !adminStaffIds.has(id));

      if (pureClientIds.length === 0) {
        console.log('No pure client IDs found after filtering');
        setClients([]);
        return;
      }

      // Load only pure client profiles (no admin/staff roles)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name, client_code')
        .in('id', pureClientIds)
        .order('email');

      if (profilesError) throw profilesError;

      console.log('Loaded clients:', {
        totalClientRoles: clientRoles.length,
        adminStaffIdsToExclude: adminStaffIds.size,
        pureClientIdsAfterFilter: pureClientIds.length,
        finalClientsLoaded: profiles?.length || 0
      });

      setClients(profiles || []);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast.error('Failed to load clients');
      setClients([]);
    }
  };

  const loadInvoices = async () => {
    if (!supabase) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`*, client:profiles!invoices_client_id_fkey(email, full_name, client_code)`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      let result = data || [];
      if (staffOnlyView && myClientIds.size > 0) {
        // Only invoices whose client is both in myClientIds and the client has the role 'client'
        const clientRoleMap = new Map<string, string>();
        try {
          const { data: roles } = await supabase.from('user_roles').select('user_id, role');
          (roles || []).forEach((r: any) => {
            if (r.role === 'client') clientRoleMap.set(r.user_id, 'client');
          });
        } catch {
          // Ignore errors when fetching user roles
        }
        result = result.filter((inv: any) => inv.client_id && myClientIds.has(inv.client_id) && clientRoleMap.has(inv.client_id));
      }
      setInvoices(result);
    } catch (error) {
      console.error('Error loading invoices:', error);
      toast.error('Failed to load invoices');
    } finally {
      setIsLoading(false);
    }
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `INV-${year}${month}-${random}`;
  };

  const handleCreate = async () => {
    if (!supabase) return;
    if (!formData.client_id || !formData.amount || !formData.due_date) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      // Validate and parse amount
      const amountValue = parseFloat(formData.amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        toast.error('Please enter a valid amount greater than 0');
        return;
      }

      // Validate and parse tax amount
      const taxValue = parseFloat(formData.tax_amount || '0');
      if (isNaN(taxValue) || taxValue < 0) {
        toast.error('Please enter a valid tax amount (0 or greater)');
        return;
      }

      // Date input type="date" already provides YYYY-MM-DD format, use it directly
      // But validate it's not empty
      if (!formData.due_date || formData.due_date.trim() === '') {
        toast.error('Please select a due date');
        return;
      }

      // Database stores amounts as numeric (rupees), not paise
      const subtotal = amountValue;
      const tax = taxValue;
      const total = subtotal + tax;

      const invoiceData = {
        invoice_number: generateInvoiceNumber(),
        client_id: formData.client_id,
        subtotal,
        tax,
        total_amount: total,
        due_date: formData.due_date, // Already in YYYY-MM-DD format from date input
        status: formData.status || 'draft',
      };

      console.log('Creating invoice with data:', invoiceData);

      const { error, data } = await supabase.from('invoices').insert(invoiceData).select();

      if (error) {
        console.error('Supabase error details:', error);
        toast.error(error.message || 'Failed to create invoice. Please check console for details.');
        return;
      }
      
      console.log('Invoice created successfully:', data);
      toast.success('Invoice created successfully');
      resetForm();
      setIsCreateOpen(false);
      loadInvoices();
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast.error(error?.message || 'Failed to create invoice. Please try again.');
    }
  };

  const handleUpdate = async () => {
    if (!supabase || !editingInvoice) return;

    try {
      // Validate and parse amounts
      const amountValue = parseFloat(formData.amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        toast.error('Please enter a valid amount greater than 0');
        return;
      }
      const taxValue = parseFloat(formData.tax_amount || '0');
      if (isNaN(taxValue) || taxValue < 0) {
        toast.error('Please enter a valid tax amount (0 or greater)');
        return;
      }
      
      // Database stores amounts as numeric (rupees), not paise
      const subtotal = amountValue;
      const tax = taxValue;
      const total = subtotal + tax;

      const updateData: Record<string, any> = {
        client_id: formData.client_id,
        subtotal,
        tax,
        total_amount: total,
        due_date: formData.due_date,
        status: formData.status,
        updated_at: new Date().toISOString(),
      };

      if (formData.status === 'paid' && editingInvoice.status !== 'paid') {
        updateData.paid_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('invoices')
        .update(updateData)
        .eq('id', editingInvoice.id);

      if (error) throw error;
      toast.success('Invoice updated successfully');
      resetForm();
      loadInvoices();
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error('Failed to update invoice');
    }
  };

  const handleDelete = async (invoice: InvoiceWithClient) => {
    if (!supabase) return;
    if (!confirm('Are you sure you want to delete this invoice?')) return;

    try {
      const { error } = await supabase.from('invoices').delete().eq('id', invoice.id);
      if (error) throw error;
      toast.success('Invoice deleted successfully');
      await loadInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to delete invoice: ${errorMessage}`);
    }
  };

  const handleEdit = async (invoice: InvoiceWithClient) => {
    setEditingInvoice(invoice);
    await loadClients(); // Reload clients to ensure fresh filtered data
    // Database stores amounts as numeric (rupees), access as subtotal and tax
    const invoiceData = invoice as any;
    setFormData({
      client_id: invoice.client_id,
      amount: (invoiceData.subtotal || 0).toString(),
      tax_amount: (invoiceData.tax || 0).toString(),
      due_date: invoice.due_date,
      status: invoice.status,
    });
  };

  const resetForm = () => {
    setFormData({ client_id: '', amount: '', tax_amount: '0', due_date: '', status: 'draft' });
    setIsCreateOpen(false);
    setEditingInvoice(null);
  };

  const updateInvoiceStatus = async (invoiceId: string, newStatus: string) => {
    if (!supabase) return;

    try {
      const updateData: Record<string, any> = { status: newStatus };
      if (newStatus === 'paid') updateData.paid_at = new Date().toISOString();

      const { error } = await supabase.from('invoices').update(updateData).eq('id', invoiceId);
      if (error) throw error;
      toast.success('Invoice status updated');
      loadInvoices();
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error('Failed to update invoice');
    }
  };

  const downloadInvoice = (invoice: InvoiceWithClient) => {
    // Generate simple text-based invoice for download
    const content = `
INVOICE
=======
Invoice #: ${invoice.invoice_number}
Date: ${new Date(invoice.created_at).toLocaleDateString()}
Due Date: ${new Date(invoice.due_date).toLocaleDateString()}

Bill To:
${invoice.client?.full_name || 'N/A'}
${invoice.client?.email || 'N/A'}

Amount: ${formatINR(Number((invoice as any).subtotal || 0) * 100)}
Tax: ${formatINR(Number((invoice as any).tax || 0) * 100)}
Total: ${formatINR(Number(invoice.total_amount) * 100)}

Status: ${invoice.status.toUpperCase()}
${invoice.paid_at ? `Paid On: ${new Date(invoice.paid_at).toLocaleDateString()}` : ''}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.invoice_number}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Invoice downloaded');
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client?.client_code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-muted text-muted-foreground';
      case 'sent':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'paid':
        return 'bg-success/10 text-success border-success/20';
      case 'overdue':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const totalPending = filteredInvoices
    .filter((i) => ['pending', 'sent', 'overdue'].includes(i.status))
    .reduce((sum, i) => sum + Number(i.total_amount) * 100, 0);

  const totalPaid = filteredInvoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + Number(i.total_amount) * 100, 0);

  // Data quality checks
  const invoiceIssues = filteredInvoices.filter((invoice) => {
    const amount = Number(invoice.amount) || 0;
    const tax = Number(invoice.tax_amount || 0);
    const total = Number(invoice.total_amount || 0);
    const expectedTotal = amount + tax;

    const statusPaidMismatch = invoice.status === 'paid' && !invoice.paid_at;
    const statusUnpaidWithPaidAt = invoice.status !== 'paid' && !!invoice.paid_at;
    const totalMismatch = total !== 0 && expectedTotal !== 0 && total !== expectedTotal;

    return statusPaidMismatch || statusUnpaidWithPaidAt || totalMismatch;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Invoices</h1>
                <p className="text-muted-foreground">Manage billing and invoices</p>
              </div>
            </div>
            <Button
              onClick={async () => {
                resetForm();
                await loadClients(); // Reload clients to ensure fresh data
                setIsCreateOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {invoiceIssues.length > 0 && (
          <div className="mb-6">
            <Card className="border-amber-500/40 bg-amber-500/5">
              <CardContent className="pt-4 pb-4">
                <p className="text-sm font-medium text-amber-500">
                  {invoiceIssues.length} invoice
                  {invoiceIssues.length > 1 ? 's have' : ' has'} potential data issues (totals or
                  status). Review them below.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Pending</p>
                  <p className="text-2xl font-bold text-warning">{formatINR(totalPending)}</p>
                </div>
                <IndianRupee className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                  <p className="text-2xl font-bold text-success">{formatINR(totalPaid)}</p>
                </div>
                <IndianRupee className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5" />
                All Invoices ({filteredInvoices.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-48"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={loadInvoices} disabled={isLoading}>
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredInvoices.length === 0 ? (
              <div className="text-center py-8">
                <IndianRupee className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No invoices found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-mono font-semibold">
                          {invoice.invoice_number}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {invoice.client?.full_name || invoice.client?.email || 'N/A'}
                              {invoice.client?.client_code && (
                                <span className="text-muted-foreground ml-1">({invoice.client.client_code})</span>
                              )}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatINR(Number(invoice.total_amount) * 100)}
                        </TableCell>
                        <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Select
                            value={invoice.status}
                            onValueChange={(value) => updateInvoiceStatus(invoice.id, value)}
                          >
                            <SelectTrigger className="w-28 h-8">
                              <Badge variant="outline" className={getStatusColor(invoice.status)}>
                                {invoice.status}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="sent">Sent</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="overdue">Overdue</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setViewingInvoice(invoice)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => downloadInvoice(invoice)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(invoice)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDelete(invoice);
                              }}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
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

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateOpen || !!editingInvoice} onOpenChange={() => resetForm()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingInvoice ? 'Edit Invoice' : 'Create Invoice'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Client *</Label>
              <Select
                value={formData.client_id}
                onValueChange={(value) => setFormData({ ...formData, client_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.length === 0 ? (
                    <SelectItem value="no-clients" disabled>
                      No clients available
                    </SelectItem>
                  ) : (
                    clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.full_name || client.email}{' '}
                        {client.client_code && `(${client.client_code})`}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {clients.length === 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  No clients found. Make sure users have the 'client' role assigned.
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount (₹) *</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Tax Amount (₹)</Label>
                <Input
                  type="number"
                  value={formData.tax_amount}
                  onChange={(e) => setFormData({ ...formData, tax_amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Due Date *</Label>
                <DatePicker
                  value={formData.due_date}
                  onChange={(value) => setFormData({ ...formData, due_date: value })}
                  placeholder="Select due date"
                  fromDate={new Date()}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button onClick={editingInvoice ? handleUpdate : handleCreate}>
              {editingInvoice ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Invoice Dialog */}
      <Dialog open={!!viewingInvoice} onOpenChange={() => setViewingInvoice(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          {viewingInvoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Invoice Number</p>
                  <p className="font-mono font-semibold">{viewingInvoice.invoice_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="outline" className={getStatusColor(viewingInvoice.status)}>
                    {viewingInvoice.status}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="font-medium">
                  {viewingInvoice.client?.full_name || viewingInvoice.client?.email || 'N/A'}
                  {viewingInvoice.client?.client_code && (
                    <span className="text-muted-foreground ml-1">({viewingInvoice.client.client_code})</span>
                  )}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-semibold">{formatINR(Number((viewingInvoice as any).subtotal || 0) * 100)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tax</p>
                  <p className="font-semibold">
                    {formatINR(Number((viewingInvoice as any).tax || 0) * 100)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-bold text-lg">
                    {formatINR(Number(viewingInvoice.total_amount) * 100)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p>{new Date(viewingInvoice.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p>{new Date(viewingInvoice.due_date).toLocaleDateString()}</p>
                </div>
              </div>
              {viewingInvoice.paid_at && (
                <div>
                  <p className="text-sm text-muted-foreground">Paid On</p>
                  <p className="text-success">
                    {new Date(viewingInvoice.paid_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingInvoice(null)}>
              Close
            </Button>
            {viewingInvoice && (
              <Button
                onClick={() => {
                  downloadInvoice(viewingInvoice);
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
