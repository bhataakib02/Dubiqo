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
    const projectDetails = quote.project_details as Record<string, unknown> | null;
    const clientName = quote.client?.full_name || (projectDetails?.name as string) || 'N/A';
    const clientEmail = quote.client?.email || (projectDetails?.email as string) || 'N/A';
    const clientCode = quote.client?.client_code || 'N/A';
    
    // Generate professional HTML quote document
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quote ${quote.id.substring(0, 8)} - Dubiqo Digital Solutions</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background: #ffffff;
      padding: 40px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
    }
    .header {
      border-bottom: 3px solid #0066cc;
      padding-bottom: 30px;
      margin-bottom: 40px;
    }
    .logo-section {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }
    .logo {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 24px;
    }
    .company-name {
      font-size: 28px;
      font-weight: bold;
      color: #0066cc;
    }
    .tagline {
      color: #666;
      font-size: 14px;
      margin-top: 5px;
    }
    .quote-title {
      font-size: 32px;
      font-weight: bold;
      margin: 30px 0 10px 0;
      color: #1a1a1a;
    }
    .quote-subtitle {
      color: #666;
      font-size: 16px;
      margin-bottom: 30px;
    }
    .info-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }
    .info-block h3 {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #666;
      margin-bottom: 10px;
      font-weight: 600;
    }
    .info-block p {
      font-size: 16px;
      color: #1a1a1a;
      margin: 5px 0;
    }
    .details-section {
      margin-top: 40px;
      padding-top: 30px;
      border-top: 2px solid #e5e5e5;
    }
    .details-section h2 {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #1a1a1a;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 15px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .detail-label {
      font-weight: 600;
      color: #666;
      text-transform: capitalize;
    }
    .detail-value {
      color: #1a1a1a;
      text-align: right;
    }
    .amount-large {
      font-size: 24px;
      font-weight: bold;
      color: #0066cc;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      text-transform: capitalize;
    }
    .status-pending {
      background: #fff3cd;
      color: #856404;
    }
    .status-approved {
      background: #d4edda;
      color: #155724;
    }
    .status-rejected {
      background: #f8d7da;
      color: #721c24;
    }
    .status-expired {
      background: #e2e3e5;
      color: #383d41;
    }
    .project-details {
      margin-top: 30px;
      padding: 25px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .project-details h3 {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #1a1a1a;
    }
    .project-field {
      margin-bottom: 20px;
    }
    .project-field label {
      display: block;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #666;
      margin-bottom: 5px;
      font-weight: 600;
    }
    .project-field p {
      font-size: 16px;
      color: #1a1a1a;
      line-height: 1.6;
    }
    .features-list {
      list-style: none;
      padding-left: 0;
    }
    .features-list li {
      padding: 8px 0;
      padding-left: 25px;
      position: relative;
      font-size: 16px;
      color: #1a1a1a;
    }
    .features-list li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #0066cc;
      font-weight: bold;
      font-size: 18px;
    }
    .footer {
      margin-top: 60px;
      padding-top: 30px;
      border-top: 2px solid #e5e5e5;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
    @media print {
      body {
        padding: 20px;
      }
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-section">
        <div class="logo">D</div>
        <div>
          <div class="company-name">Dubiqo</div>
          <div class="tagline">Digital Solutions</div>
        </div>
      </div>
      <div class="quote-title">Quote</div>
      <div class="quote-subtitle">Professional Service Quote</div>
    </div>

    <div class="info-section">
      <div class="info-block">
        <h3>Client Information</h3>
        <p><strong>${clientName}</strong></p>
        <p>${clientEmail}</p>
        ${clientCode !== 'N/A' ? `<p style="font-family: monospace; color: #0066cc; margin-top: 5px;">${clientCode}</p>` : ''}
      </div>
      <div class="info-block">
        <h3>Quote Information</h3>
        <p><strong>Quote ID:</strong> ${quote.id.substring(0, 8)}...</p>
        <p><strong>Date:</strong> ${new Date(quote.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        <p><strong>Valid Until:</strong> ${new Date(quote.valid_until).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>
    </div>

    <div class="details-section">
      <h2>Quote Details</h2>
      <div class="detail-row">
        <span class="detail-label">Service Type</span>
        <span class="detail-value" style="text-transform: capitalize;">${quote.service_type}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Status</span>
        <span class="detail-value">
          <span class="status-badge status-${quote.status}">${quote.status}</span>
        </span>
      </div>
      <div class="detail-row" style="border-bottom: 2px solid #0066cc; padding-bottom: 20px; margin-bottom: 20px;">
        <span class="detail-label" style="font-size: 18px;">Estimated Cost</span>
        <span class="detail-value amount-large">${formatCurrency(quote.estimated_cost)}</span>
      </div>
    </div>

    ${projectDetails ? `
    <div class="project-details">
      <h3>Project Details</h3>
      ${projectDetails.pages !== undefined && projectDetails.pages !== null ? `
      <div class="project-field">
        <label>Pages</label>
        <p>${projectDetails.pages}</p>
      </div>
      ` : ''}
      ${projectDetails.details ? `
      <div class="project-field">
        <label>Description</label>
        <p>${String(projectDetails.details)}</p>
      </div>
      ` : ''}
      ${projectDetails.features && Array.isArray(projectDetails.features) && projectDetails.features.length > 0 ? `
      <div class="project-field">
        <label>Features</label>
        <ul class="features-list">
          ${projectDetails.features.map((feature: unknown) => `<li>${String(feature)}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
      ${projectDetails.timeline ? `
      <div class="project-field">
        <label>Timeline</label>
        <p>${String(projectDetails.timeline)}</p>
      </div>
      ` : ''}
      ${Object.entries(projectDetails).filter(([key]) => !['name', 'email', 'pages', 'details', 'features', 'timeline'].includes(key)).map(([key, value]) => {
        if (value === null || value === undefined) return '';
        return `
      <div class="project-field">
        <label>${key.replace(/_/g, ' ')}</label>
        <p>${Array.isArray(value) ? value.join(', ') : typeof value === 'object' ? JSON.stringify(value) : String(value)}</p>
      </div>
        `;
      }).join('')}
    </div>
    ` : ''}

    <div class="footer">
      <p><strong>Dubiqo Digital Solutions</strong></p>
      <p>We build websites that build your business</p>
      <p style="margin-top: 10px;">hello@dubiqo.com | +1 (234) 567-890</p>
      <p style="margin-top: 5px; font-size: 12px; color: #999;">Quote ID: ${quote.id}</p>
    </div>
  </div>
</body>
</html>
    `;

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quote-${quote.id.substring(0, 8)}.html`;
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
                <div className="space-y-4 pt-4 border-t">
                  <p className="text-sm font-medium text-muted-foreground mb-3">Project Details</p>
                  <div className="grid gap-4">
                    {(() => {
                      const details = selectedQuote.project_details as Record<string, unknown>;
                      const excludeFields = ['name', 'email']; // Already shown in client section
                      
                      return (
                        <>
                          {details.pages !== undefined && details.pages !== null && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Pages</p>
                              <p className="text-base">{String(details.pages)}</p>
                            </div>
                          )}
                          {details.details && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Description</p>
                              <p className="text-base">{String(details.details)}</p>
                            </div>
                          )}
                          {details.features && Array.isArray(details.features) && details.features.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-2">Features</p>
                              <ul className="list-disc list-inside space-y-1">
                                {details.features.map((feature: unknown, index: number) => (
                                  <li key={index} className="text-base">{String(feature)}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {details.timeline && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Timeline</p>
                              <p className="text-base">{String(details.timeline)}</p>
                            </div>
                          )}
                          {/* Display any other fields that aren't already shown */}
                          {Object.entries(details).map(([key, value]) => {
                            if (excludeFields.includes(key) || 
                                ['pages', 'details', 'features', 'timeline'].includes(key) ||
                                value === null || value === undefined) {
                              return null;
                            }
                            return (
                              <div key={key}>
                                <p className="text-sm font-medium text-muted-foreground capitalize">
                                  {key.replace(/_/g, ' ')}
                                </p>
                                <p className="text-base">
                                  {Array.isArray(value)
                                    ? value.join(', ')
                                    : typeof value === 'object'
                                    ? JSON.stringify(value)
                                    : String(value)}
                                </p>
                              </div>
                            );
                          })}
                        </>
                      );
                    })()}
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
