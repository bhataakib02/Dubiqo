import { useEffect, useState } from 'react';
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

  useEffect(() => {
    loadInvoices();
    loadClients();
  }, []);

  const loadClients = async () => {
    if (!supabase) return;
    try {
      // Load all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name, client_code')
        .order('email');

      if (profilesError) throw profilesError;

      // Get admin and staff user IDs to exclude them from the client list
      const { data: adminStaffRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .in('role', ['admin', 'staff']);

      if (adminStaffRoles && adminStaffRoles.length > 0) {
        const adminStaffIds = new Set(adminStaffRoles.map((r) => r.user_id));
        // Filter out admin and staff, show everyone else (clients and users without roles)
        const clientProfiles = (profiles || []).filter((p) => !adminStaffIds.has(p.id));
        setClients(clientProfiles);
      } else {
        // If no admin/staff roles found, show all profiles
        setClients(profiles || []);
      }
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
      setInvoices(data || []);
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
      const amount = Math.round(parseFloat(formData.amount) * 100);
      const taxAmount = Math.round(parseFloat(formData.tax_amount || '0') * 100);
      const totalAmount = amount + taxAmount;

      const { error } = await supabase.from('invoices').insert({
        invoice_number: generateInvoiceNumber(),
        client_id: formData.client_id,
        amount,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        due_date: formData.due_date,
        status: formData.status,
      });

      if (error) throw error;
      toast.success('Invoice created successfully');
      resetForm();
      loadInvoices();
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
    }
  };

  const handleUpdate = async () => {
    if (!supabase || !editingInvoice) return;

    try {
      const amount = Math.round(parseFloat(formData.amount) * 100);
      const taxAmount = Math.round(parseFloat(formData.tax_amount || '0') * 100);
      const totalAmount = amount + taxAmount;

      const updateData: Record<string, any> = {
        client_id: formData.client_id,
        amount,
        tax_amount: taxAmount,
        total_amount: totalAmount,
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
      loadInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Failed to delete invoice');
    }
  };

  const handleEdit = (invoice: InvoiceWithClient) => {
    setEditingInvoice(invoice);
    setFormData({
      client_id: invoice.client_id,
      amount: (Number(invoice.amount) / 100).toString(),
      tax_amount: (Number(invoice.tax_amount || 0) / 100).toString(),
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

Amount: ${formatINR(Number(invoice.amount))}
Tax: ${formatINR(Number(invoice.tax_amount || 0))}
Total: ${formatINR(Number(invoice.total_amount))}

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
    .reduce((sum, i) => sum + Number(i.total_amount), 0);

  const totalPaid = filteredInvoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + Number(i.total_amount), 0);

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
              onClick={() => {
                resetForm();
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
                            <p className="font-medium">{invoice.client?.full_name || 'N/A'}</p>
                            <p className="text-xs text-muted-foreground">{invoice.client?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatINR(Number(invoice.total_amount))}
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
                              onClick={() => handleDelete(invoice)}
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
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
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
                  {viewingInvoice.client?.full_name || viewingInvoice.client?.email}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-semibold">{formatINR(Number(viewingInvoice.amount))}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tax</p>
                  <p className="font-semibold">
                    {formatINR(Number(viewingInvoice.tax_amount || 0))}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-bold text-lg">
                    {formatINR(Number(viewingInvoice.total_amount))}
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
