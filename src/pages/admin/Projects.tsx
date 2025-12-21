import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Plus, RefreshCw, FolderKanban, Eye, Edit, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type ProjectWithClient = Tables<"projects"> & {
  profiles?: { full_name: string | null; email: string; client_code: string | null } | null;
};

type Profile = { id: string; email: string; full_name: string | null; client_code: string | null };

const formatINR = (paise: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(paise / 100);
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<ProjectWithClient[]>([]);
  const [clients, setClients] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [staffOnlyView, setStaffOnlyView] = useState(false);
  const [myClientIds, setMyClientIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectWithClient | null>(null);
  const [viewingProject, setViewingProject] = useState<ProjectWithClient | null>(null);

  const location = useLocation();
  const cameFromStaff = (location.state as any)?.from === 'staff';
  const backHref = cameFromStaff ? '/staff' : '/admin/dashboard';
  const backLabel = cameFromStaff ? 'Back to Staff Workspace' : 'Back to Dashboard';

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    client_id: "",
    project_type: "website",
    status: "discovery",
    budget: ""
  });

  useEffect(() => {
    initializeProjects();
    loadClients();
  }, []);

  const initializeProjects = async () => {
    if (!supabase) {
      await loadProjects();
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        await loadProjects();
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
          console.error('Error loading staff project tickets:', error);
        } else {
          const ids = new Set<string>();
          (myTickets || []).forEach((t: any) => {
            if (t.client_id) ids.add(t.client_id);
          });
          setMyClientIds(ids);
        }
      }

      await loadProjects();
    } catch (error) {
      console.error('Error initializing projects view:', error);
      await loadProjects();
    }
  };

  const loadClients = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('profiles').select('id, email, full_name, client_code').order('email');
    setClients(data || []);
  };

  const loadProjects = async () => {
    if (!supabase) return;
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*, profiles(full_name, email, client_code)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      let result = data || [];
      if (staffOnlyView && myClientIds.size > 0) {
        // Only projects whose client is both in myClientIds and the client has the role 'client'
        const clientRoleMap = new Map<string, string>();
        try {
          const { data: roles } = await supabase.from('user_roles').select('user_id, role');
          (roles || []).forEach((r: any) => {
            if (r.role === 'client') clientRoleMap.set(r.user_id, 'client');
          });
        } catch {}
        result = result.filter((p: any) => myClientIds.has(p.client_id) && clientRoleMap.has(p.client_id));
      }
      setProjects(result);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!supabase) return;
    if (!formData.title || !formData.client_id || !formData.project_type) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const { error } = await supabase.from('projects').insert({
        title: formData.title,
        description: formData.description,
        client_id: formData.client_id,
        project_type: formData.project_type,
        status: formData.status,
        budget: formData.budget ? Math.round(parseFloat(formData.budget) * 100) : null
      });

      if (error) throw error;
      toast.success('Project created successfully');
      resetForm();
      loadProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    }
  };

  const handleUpdate = async () => {
    if (!supabase || !editingProject) return;

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title: formData.title,
          description: formData.description,
          client_id: formData.client_id,
          project_type: formData.project_type,
          status: formData.status,
          budget: formData.budget ? Math.round(parseFloat(formData.budget) * 100) : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingProject.id);

      if (error) throw error;
      toast.success('Project updated successfully');
      resetForm();
      loadProjects();
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    }
  };

  const handleDelete = async (project: ProjectWithClient) => {
    if (!supabase) return;
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase.from('projects').delete().eq('id', project.id);
      if (error) throw error;
      toast.success('Project deleted successfully');
      loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleEdit = (project: ProjectWithClient) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || "",
      client_id: project.client_id,
      project_type: project.project_type,
      status: project.status,
      budget: project.budget ? (Number(project.budget) / 100).toString() : ""
    });
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", client_id: "", project_type: "website", status: "discovery", budget: "" });
    setIsCreateOpen(false);
    setEditingProject(null);
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.profiles?.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'discovery': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'planning': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'development': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'review': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const projectTypes = ["website", "portfolio", "billing-system", "dashboard", "maintenance", "troubleshooting"];
  const projectStatuses = ["discovery", "planning", "development", "review", "completed", "cancelled"];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={backHref}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {backLabel}
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Project Management</h1>
                <p className="text-muted-foreground">View and manage all projects</p>
              </div>
            </div>
            <Button onClick={() => { resetForm(); setIsCreateOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5" />
                All Projects ({filteredProjects.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-48" />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {projectStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={loadProjects} disabled={isLoading}>
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
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-8">
                <FolderKanban className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No projects found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.title}</TableCell>
                        <TableCell>
                          <div>
                            <p>{project.profiles?.full_name || 'N/A'}</p>
                            <p className="text-xs text-muted-foreground">{project.profiles?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline">{project.project_type}</Badge></TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(project.status)}>{project.status}</Badge>
                        </TableCell>
                        <TableCell>{project.budget ? formatINR(Number(project.budget)) : '-'}</TableCell>
                        <TableCell>{new Date(project.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setViewingProject(project)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(project)} className="text-destructive hover:text-destructive">
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
      <Dialog open={isCreateOpen || !!editingProject} onOpenChange={() => resetForm()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Project' : 'Create Project'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Project title" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Client *</Label>
              <Select value={formData.client_id} onValueChange={(value) => setFormData({ ...formData, client_id: value })}>
                <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.full_name || c.email} {c.client_code && `(${c.client_code})`}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select value={formData.project_type} onValueChange={(value) => setFormData({ ...formData, project_type: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {projectTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {projectStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Budget (₹)</Label>
              <Input type="number" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} placeholder="0.00" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
            <Button onClick={editingProject ? handleUpdate : handleCreate}>{editingProject ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewingProject} onOpenChange={() => setViewingProject(null)}>
        <DialogContent>
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
                  <p>{viewingProject.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{viewingProject.profiles?.full_name || viewingProject.profiles?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <Badge variant="outline">{viewingProject.project_type}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="outline" className={getStatusColor(viewingProject.status)}>{viewingProject.status}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-semibold">{viewingProject.budget ? formatINR(Number(viewingProject.budget)) : '-'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p>{new Date(viewingProject.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingProject(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
