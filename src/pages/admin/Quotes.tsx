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
import { supabase } from '@/integrations/supabase/client';
import {
  ArrowLeft,
  Search,
  FileText,
  RefreshCw,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  FolderPlus,
  Mail,
  Download,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type QuoteWithClient = Tables<'quotes'> & {
  client?: { email: string; full_name: string | null; client_code: string | null } | null;
};

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<QuoteWithClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [staffOnlyView, setStaffOnlyView] = useState(false);
  const [myClientIds, setMyClientIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedQuote, setSelectedQuote] = useState<QuoteWithClient | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const location = useLocation();
  const cameFromStaff = (location.state as any)?.from === 'staff';
  const backHref = cameFromStaff ? '/staff' : '/admin/dashboard';
  const backLabel = cameFromStaff ? 'Back to Staff Workspace' : 'Back to Dashboard';

  const initializeQuotes = useCallback(async () => {
    if (!supabase) {
      await loadQuotes();
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        await loadQuotes();
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
          console.error('Error loading staff quote tickets:', error);
        } else {
          const ids = new Set<string>();
          (myTickets || []).forEach((t: any) => {
            if (t.client_id) ids.add(t.client_id);
          });
          setMyClientIds(ids);
        }
      }

      await loadQuotes();
    } catch (error) {
      console.error('Error initializing quotes view:', error);
      await loadQuotes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    initializeQuotes();
  }, [initializeQuotes]);

  const loadQuotes = async () => {
    if (!supabase) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(
          `
          *,
          client:profiles!quotes_client_id_fkey(email, full_name, client_code)
        `
        )
        .order('created_at', { ascending: false });

      if (error) throw error;

      let result = data || [];
      if (staffOnlyView && myClientIds.size > 0) {
        // Only quotes whose client is both in myClientIds and the client has the role 'client'
        const clientRoleMap = new Map<string, string>();
        try {
          const { data: roles } = await supabase.from('user_roles').select('user_id, role');
          (roles || []).forEach((r: any) => {
            if (r.role === 'client') clientRoleMap.set(r.user_id, 'client');
          });
        } catch {
          // Ignore errors when fetching user roles
        }
        result = result.filter((q: any) => q.client_id && myClientIds.has(q.client_id) && clientRoleMap.has(q.client_id));
      }
      setQuotes(result);
    } catch (error) {
      console.error('Error loading quotes:', error);
      toast.error('Failed to load quotes');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuoteStatus = async (quoteId: string, newStatus: string) => {
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', quoteId);

      if (error) throw error;
      toast.success('Quote status updated');
      loadQuotes();
    } catch (error) {
      console.error('Error updating quote:', error);
      toast.error('Failed to update quote');
    }
  };

  const handleViewQuote = (quote: QuoteWithClient) => {
    setSelectedQuote(quote);
    setIsDetailOpen(true);
  };

  const handleApproveQuote = async (quote: QuoteWithClient) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({
          status: 'approved',
          updated_at: new Date().toISOString(),
        })
        .eq('id', quote.id);

      if (error) throw error;
      toast.success('Quote approved successfully');
      loadQuotes();
    } catch (error) {
      console.error('Error approving quote:', error);
      toast.error('Failed to approve quote');
    }
  };

  const handleRejectQuote = async (quote: QuoteWithClient) => {
    if (!confirm(`Are you sure you want to reject this quote?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('quotes')
        .update({
          status: 'rejected',
          updated_at: new Date().toISOString(),
        })
        .eq('id', quote.id);

      if (error) throw error;
      toast.success('Quote rejected');
      loadQuotes();
    } catch (error) {
      console.error('Error rejecting quote:', error);
      toast.error('Failed to reject quote');
    }
  };

  const handleConvertToProject = async (quote: QuoteWithClient) => {
    if (!quote.client_id) {
      toast.error('Cannot convert quote without a client');
      return;
    }

    try {
      const projectDetails = quote.project_details as Record<string, unknown> | null;
      const projectName = (projectDetails?.name as string) || quote.client?.full_name || 'Client';

      // Create a new project from the quote
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          client_id: quote.client_id,
          title: `${quote.service_type.charAt(0).toUpperCase() + quote.service_type.slice(1)} Project - ${projectName}`,
          description: `Project created from quote ${quote.id}. Service type: ${quote.service_type}`,
          project_type: quote.service_type,
          status: 'discovery',
          budget: quote.estimated_cost / 100, // Convert from paise to rupees
          metadata: {
            quote_id: quote.id,
            converted_from_quote: true,
            original_quote_date: quote.created_at,
          },
        })
        .select()
        .single();

      if (projectError) {
        console.error('Project creation error:', projectError);
        throw projectError;
      }

      // Update quote status to approved
      const { error: quoteError } = await supabase
        .from('quotes')
        .update({
          status: 'approved',
          updated_at: new Date().toISOString(),
          metadata: {
            ...((quote.metadata as Record<string, unknown>) || {}),
            converted_to_project: true,
            project_id: project.id,
            converted_at: new Date().toISOString(),
          },
        })
        .eq('id', quote.id);

      if (quoteError) {
        console.error('Quote update error:', quoteError);
        // Don't throw - project was created successfully
      }

      toast.success(`Project created successfully! Project ID: ${project.id.substring(0, 8)}...`);
      loadQuotes();
    } catch (error) {
      console.error('Error converting quote to project:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to convert quote to project: ${errorMessage}`);
    }
  };

  const handleEmailClient = (quote: QuoteWithClient) => {
    const email =
      quote.client?.email || ((quote.project_details as Record<string, unknown>)?.email as string);

    if (!email) {
      toast.error('Client email not available');
      return;
    }

    const subject = `Quote ${quote.status === 'approved' ? 'Approved' : 'Update'}`;
    const body = `Dear ${quote.client?.full_name || 'Client'},\n\nYour quote for ${quote.service_type} (${formatCurrency(quote.estimated_cost)}) has been ${quote.status}.\n\nBest regards,\nDubiqo Team`;

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast.success('Opening email client...');
  };

  const handleExportQuote = (quote: QuoteWithClient) => {
    // Create a downloadable quote document
    const quoteData = {
      id: quote.id,
      client: quote.client?.full_name || 'N/A',
      email: quote.client?.email || 'N/A',
      serviceType: quote.service_type,
      estimatedCost: formatCurrency(quote.estimated_cost),
      validUntil: new Date(quote.valid_until).toLocaleDateString(),
      status: quote.status,
      created: new Date(quote.created_at).toLocaleDateString(),
      projectDetails: quote.project_details,
    };

    const blob = new Blob([JSON.stringify(quoteData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quote-${quote.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Quote exported successfully');
  };

  const handleDeleteQuote = async (quote: QuoteWithClient) => {
    if (!confirm(`Are you sure you want to delete this quote?`)) {
      return;
    }

    try {
      const { error } = await supabase.from('quotes').delete().eq('id', quote.id);

      if (error) throw error;
      toast.success('Quote deleted successfully');
      await loadQuotes();
    } catch (error) {
      console.error('Error deleting quote:', error);
      toast.error('Failed to delete quote');
    }
  };

  const filteredQuotes = quotes.filter((quote) => {
    const projectDetails = quote.project_details as Record<string, unknown> | null;
    const name = (projectDetails?.name as string) || '';
    const email = (projectDetails?.email as string) || '';

    const matchesSearch =
      quote.service_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.client?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.client?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.client?.client_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'approved':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'expired':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatCurrency = (amount: number) => {
    // Amount is stored in paise (smallest currency unit), convert to rupees
    const rupees = amount / 100;
    return `₹${rupees.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  const now = new Date();
  const stalePendingCount = quotes.filter(
    (quote) => quote.status === 'pending' && new Date(quote.valid_until) < now
  ).length;

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
              <h1 className="text-2xl font-bold">Quote Requests</h1>
              <p className="text-muted-foreground">Manage project quotes</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {stalePendingCount > 0 && (
          <div className="mb-6">
            <Card className="border-amber-500/40 bg-amber-500/5">
              <CardContent className="pt-4 pb-4">
                <p className="text-sm font-medium text-amber-500">
                  {stalePendingCount} pending quote
                  {stalePendingCount > 1 ? 's are' : ' is'} past the valid-until date. Consider
                  marking them as expired or following up with the client.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <CardTitle>All Quotes ({filteredQuotes.length})</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search quotes..."
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
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={loadQuotes} disabled={isLoading}>
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
            ) : filteredQuotes.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No quotes found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Service Type</TableHead>
                      <TableHead>Estimated Cost</TableHead>
                      <TableHead>Valid Until</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuotes.map((quote) => {
                      const projectDetails = quote.project_details as Record<
                        string,
                        unknown
                      > | null;
                      const clientName =
                        quote.client?.full_name || (projectDetails?.name as string) || 'N/A';
                      const clientEmail =
                        quote.client?.email || (projectDetails?.email as string) || 'N/A';

                      return (
                        <TableRow key={quote.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{clientName}</p>
                              <p className="text-xs text-muted-foreground">{clientEmail}</p>
                              {quote.client?.client_code && (
                                <p className="text-xs font-mono text-primary">
                                  {quote.client.client_code}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">{quote.service_type}</TableCell>
                          <TableCell className="font-semibold">
                            {formatCurrency(quote.estimated_cost)}
                          </TableCell>
                          <TableCell>
                            {new Date(quote.valid_until).toLocaleDateString('en-US', {
                              month: 'numeric',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={quote.status}
                              onValueChange={(value) => updateQuoteStatus(quote.id, value)}
                            >
                              <SelectTrigger className="w-32 h-8 border-0 p-0">
                                <Badge variant="outline" className={getStatusColor(quote.status)}>
                                  {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            {new Date(quote.created_at).toLocaleDateString('en-US', {
                              month: 'numeric',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleViewQuote(quote)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                {quote.status === 'pending' && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleApproveQuote(quote)}>
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleRejectQuote(quote)}>
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Reject
                                    </DropdownMenuItem>
                                  </>
                                )}
                                <DropdownMenuItem onClick={() => handleConvertToProject(quote)}>
                                  <FolderPlus className="w-4 h-4 mr-2" />
                                  Convert to Project
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEmailClient(quote)}>
                                  <Mail className="w-4 h-4 mr-2" />
                                  Email Client
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleExportQuote(quote)}>
                                  <Download className="w-4 h-4 mr-2" />
                                  Export Quote
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteQuote(quote)}
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

      {/* Quote Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quote Details</DialogTitle>
            <DialogDescription>View complete quote information</DialogDescription>
          </DialogHeader>
          {selectedQuote && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Client</p>
                  <p className="font-medium">
                    {selectedQuote.client?.full_name ||
                      ((selectedQuote.project_details as Record<string, unknown>)
                        ?.name as string) ||
                      'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedQuote.client?.email ||
                      ((selectedQuote.project_details as Record<string, unknown>)
                        ?.email as string) ||
                      'N/A'}
                  </p>
                  {selectedQuote.client?.client_code && (
                    <p className="text-xs font-mono text-primary">
                      {selectedQuote.client.client_code}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant="outline" className={getStatusColor(selectedQuote.status)}>
                    {selectedQuote.status.charAt(0).toUpperCase() + selectedQuote.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Service Type</p>
                  <p className="capitalize">{selectedQuote.service_type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estimated Cost</p>
                  <p className="font-semibold text-lg">
                    {formatCurrency(selectedQuote.estimated_cost)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Valid Until</p>
                  <p>
                    {new Date(selectedQuote.valid_until).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p>
                    {new Date(selectedQuote.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              {selectedQuote.project_details && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Project Details</p>
                  <div className="p-4 bg-muted rounded-md">
                    <pre className="text-sm whitespace-pre-wrap">
                      {JSON.stringify(selectedQuote.project_details, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
