import { useEffect, useState, useCallback } from "react";
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
import { ArrowLeft, Plus, RefreshCw, FolderKanban, Eye, Edit, Trash2, Search, MessageSquare, Users, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type ProjectWithClient = Tables<"projects"> & {
  profiles?: { full_name: string | null; email: string; client_code: string | null } | null;
};

type Profile = { id: string; email: string; full_name: string | null; client_code: string | null; role?: string };

type ProjectComment = {
  id: string;
  project_id: string;
  user_id: string;
  comment: string;
  is_internal: boolean;
  created_at: string;
  updated_at: string;
  profiles?: { full_name: string | null; email: string };
};

type ProjectStaffAssignment = {
  id: string;
  project_id: string;
  staff_id: string;
  profiles?: { full_name: string | null; email: string };
};

const formatINR = (paise: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(paise / 100);
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<ProjectWithClient[]>([]);
  const [clients, setClients] = useState<Profile[]>([]);
  const [staff, setStaff] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [staffOnlyView, setStaffOnlyView] = useState(false);
  const [myClientIds, setMyClientIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectWithClient | null>(null);
  const [viewingProject, setViewingProject] = useState<ProjectWithClient | null>(null);
  const [assignedStaff, setAssignedStaff] = useState<Map<string, ProjectStaffAssignment[]>>(new Map());
  const [projectComments, setProjectComments] = useState<Map<string, ProjectComment[]>>(new Map());
  const [newComment, setNewComment] = useState("");
  const [selectedStaffIds, setSelectedStaffIds] = useState<Set<string>>(new Set());
  const [loadingStaff, setLoadingStaff] = useState(false);

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

  const initializeProjects = useCallback(async () => {
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

      const userIsAdmin = roles?.some((r) => r.role === 'admin');
      const isStaff = roles?.some((r) => r.role === 'staff');
      const staffOnly = !!isStaff && !userIsAdmin;
      setIsAdmin(!!userIsAdmin);
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
      // Still try to load projects even if initialization fails
      await loadProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    initializeProjects();
    loadClients();
    loadStaff();
  }, [initializeProjects]);

  const loadClients = async () => {
    if (!supabase) return;
    try {
      // Get all client roles
      const { data: clientRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'client');
      
      if (!clientRoles || clientRoles.length === 0) {
        setClients([]);
        return;
      }
      
      const clientIds = clientRoles.map(r => r.user_id);
      
      // Load only client profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, client_code')
        .in('id', clientIds)
        .order('email');
      
      if (error) {
        console.error('Error loading clients:', error);
        setClients([]);
        return;
      }
      
      setClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
      setClients([]);
    }
  };

  const loadStaff = async () => {
    if (!supabase) {
      console.error('Supabase client not available');
      return;
    }
    setLoadingStaff(true);
    try {
      // First, get all staff and admin roles
      const { data: allRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('role', ['staff', 'admin']);
      
      if (rolesError) {
        console.error('Error loading roles:', rolesError);
        setStaff([]);
        return;
      }
      
      if (!allRoles || allRoles.length === 0) {
        console.warn('No staff or admin roles found');
        setStaff([]);
        return;
      }
      
      console.log('Found roles:', allRoles.length);
      
      // Create a map of user_id to role
      const roleMap = new Map<string, string>();
      (allRoles || []).forEach(r => {
        roleMap.set(r.user_id, r.role);
      });
      
      // Get user IDs from roles
      const userIds = Array.from(roleMap.keys());
      
      if (userIds.length === 0) {
        console.warn('No user IDs found in roles');
        setStaff([]);
        return;
      }
      
      // Load profiles for those user IDs
      const { data: staffProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name, client_code, metadata')
        .in('id', userIds)
        .order('email');
      
      if (profilesError) {
        console.error('Error loading profiles:', profilesError);
        setStaff([]);
        return;
      }
      
      console.log('Found profiles:', staffProfiles?.length || 0);
      
      // Map profiles to staff list with descriptive roles
      const staffList = (staffProfiles || [])
        .map(p => {
          const baseRole = roleMap.get(p.id) || 'staff';
          // Get descriptive role from metadata (e.g., "backend developer", "ui/ux", "frontend developer")
          const metadata = p.metadata as any;
          const descriptiveRole = metadata?.role || metadata?.job_title || metadata?.position || baseRole;
          
          return {
            ...p,
            role: descriptiveRole,
            baseRole: baseRole // Keep base role for filtering
          };
        });
      
      console.log('Staff list created:', staffList.length);
      setStaff(staffList);
      if (staffList.length === 0) {
        console.warn('No staff members found. Check:', {
          rolesFound: allRoles?.length || 0,
          profilesFound: staffProfiles?.length || 0,
          userIds: userIds.length
        });
      }
    } catch (error) {
      console.error('Error loading staff:', error);
      setStaff([]);
    } finally {
      setLoadingStaff(false);
    }
  };

  const loadAssignedStaff = async (projectId: string) => {
    if (!supabase) return;
    try {
      const { data, error } = await (supabase as any)
        .from('project_staff_assignments')
        .select(`
          id,
          project_id,
          staff_id,
          profiles:staff_id(full_name, email)
        `)
        .eq('project_id', projectId);
      
      if (error) throw error;
      setAssignedStaff(prev => new Map(prev).set(projectId, data || []));
      return data || [];
    } catch (error) {
      console.error('Error loading assigned staff:', error);
      return [];
    }
  };

  const loadProjectComments = async (projectId: string) => {
    if (!supabase || !currentUserId) return;
    try {
      // Load comments based on user role
      const { data, error } = await (supabase as any)
        .from('project_comments')
        .select(`
          *,
          profiles:user_id(full_name, email)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProjectComments(prev => new Map(prev).set(projectId, data || []));
      return data || [];
    } catch (error) {
      console.error('Error loading comments:', error);
      return [];
    }
  };

  const handleAssignStaff = async (projectId: string, staffIds: string[]) => {
    if (!supabase || !isAdmin) return;
    
    try {
      // Get current assignments
      const currentAssignments = await loadAssignedStaff(projectId);
      const currentStaffIds = new Set(currentAssignments.map(a => a.staff_id));
      
      // Find staff to add and remove
      const toAdd = staffIds.filter(id => !currentStaffIds.has(id));
      const toRemove = currentAssignments.filter(a => !staffIds.includes(a.staff_id)).map(a => a.id);
      
      // Remove assignments
      if (toRemove.length > 0) {
        const { error: deleteError } = await (supabase as any)
          .from('project_staff_assignments')
          .delete()
          .in('id', toRemove);
        if (deleteError) throw deleteError;
      }
      
      // Add new assignments
      if (toAdd.length > 0) {
        const assignments = toAdd.map(staffId => ({
          project_id: projectId,
          staff_id: staffId,
          assigned_by: currentUserId
        }));
        
        const { error: insertError } = await (supabase as any)
          .from('project_staff_assignments')
          .insert(assignments);
        if (insertError) throw insertError;
      }
      
      toast.success('Staff assignments updated');
      await loadAssignedStaff(projectId);
    } catch (error) {
      console.error('Error assigning staff:', error);
      toast.error('Failed to update staff assignments');
    }
  };

  const handleAddComment = async (projectId: string, comment: string, isInternal: boolean) => {
    if (!supabase || !currentUserId || !comment.trim()) return;
    
    // Only staff can add internal comments
    if (isInternal && !isAdmin && !staffOnlyView) {
      toast.error('Only staff can add internal comments');
      return;
    }
    
    try {
      const { error } = await (supabase as any)
        .from('project_comments')
        .insert({
          project_id: projectId,
          user_id: currentUserId,
          comment: comment.trim(),
          is_internal: isInternal
        });
      
      if (error) throw error;
      toast.success(isInternal ? 'Internal comment added' : 'Comment added');
      setNewComment("");
      await loadProjectComments(projectId);
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
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
        } catch {
          // Ignore errors when fetching user roles
        }
        result = result.filter((p: any) => myClientIds.has(p.client_id) && clientRoleMap.has(p.client_id));
      }
      setProjects(result);
    } catch (error: any) {
      console.error('Error loading projects:', error);
      const errorMessage = error?.message || 'Unknown error';
      console.error('Full error details:', {
        message: errorMessage,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
      });
      
      // More specific error message
      if (error?.code === 'PGRST116' || errorMessage.includes('permission denied') || errorMessage.includes('row-level security')) {
        toast.error('Permission denied', {
          description: 'You may not have access to view projects. Please contact an administrator.',
        });
      } else if (errorMessage.includes('relation') && errorMessage.includes('does not exist')) {
        toast.error('Database error', {
          description: 'The projects table may not exist. Please check your database setup.',
        });
      } else {
        toast.error('Failed to load projects', {
          description: errorMessage,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeProjects();
    loadClients();
  }, [initializeProjects]);

  // Load staff when admin status is determined
  useEffect(() => {
    if (isAdmin) {
      loadStaff();
    }
  }, [isAdmin]);

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
      
      // Update staff assignments if admin
      if (isAdmin) {
        await handleAssignStaff(editingProject.id, Array.from(selectedStaffIds));
      }
      
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
      // First verify the project exists
      const { data: existingProject, error: checkError } = await supabase
        .from('projects')
        .select('id')
        .eq('id', project.id)
        .single();
      
      if (checkError || !existingProject) {
        toast.error('Project not found');
        return;
      }

      // Perform the deletion
      const { data, error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id)
        .select();
      
      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
      
      // Verify deletion succeeded by checking if data was returned
      if (!data || data.length === 0) {
        console.error('No rows deleted - possible permission issue');
        toast.error('Failed to delete project. You may not have permission.');
        // Still reload to refresh the list
        loadProjects();
        return;
      }
      
      toast.success('Project deleted successfully');
      loadProjects();
    } catch (error: any) {
      console.error('Error deleting project:', error);
      const errorMessage = error?.message || error?.details || 'Failed to delete project';
      toast.error(errorMessage);
      // Reload projects to ensure UI is in sync
      loadProjects();
    }
  };

  const handleEdit = async (project: ProjectWithClient) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || "",
      client_id: project.client_id,
      project_type: project.project_type,
      status: project.status,
      budget: project.budget ? (Number(project.budget) / 100).toString() : ""
    });
    // Ensure staff is loaded (especially important for admin users)
    if (isAdmin) {
      console.log('Loading staff for edit dialog...');
      await loadStaff();
    }
    // Load assigned staff for this project
    const assignments = await loadAssignedStaff(project.id);
    setSelectedStaffIds(new Set(assignments.map(a => a.staff_id)));
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", client_id: "", project_type: "website", status: "discovery", budget: "" });
    setIsCreateOpen(false);
    setEditingProject(null);
    setSelectedStaffIds(new Set());
    setNewComment("");
  };

  const handleViewProject = async (project: ProjectWithClient) => {
    setViewingProject(project);
    await loadAssignedStaff(project.id);
    await loadProjectComments(project.id);
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
                            <Button variant="ghost" size="sm" onClick={() => handleViewProject(project)}>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
            {isAdmin && editingProject && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Assign Staff</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      console.log('Reloading staff manually...');
                      loadStaff();
                    }}
                    className="h-7 text-xs"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Reload
                  </Button>
                </div>
                <div className="border rounded-md p-3 space-y-2 max-h-64 overflow-y-auto">
                  {loadingStaff ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                      <span className="ml-2 text-sm text-muted-foreground">Loading staff...</span>
                    </div>
                  ) : staff.length === 0 ? (
                    <div className="py-4">
                      <p className="text-sm text-muted-foreground text-center">No staff available</p>
                      <p className="text-xs text-muted-foreground text-center mt-1">
                        Make sure staff users have 'staff' or 'admin' role in user_roles table
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          console.log('Debug: Current state:', { isAdmin, staffCount: staff.length });
                          loadStaff();
                        }}
                        className="mt-2 w-full text-xs"
                      >
                        Try Loading Again
                      </Button>
                    </div>
                  ) : (
                    staff.map((s) => (
                      <div key={s.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`staff-${s.id}`}
                          checked={selectedStaffIds.has(s.id)}
                          onCheckedChange={(checked) => {
                            const newSet = new Set(selectedStaffIds);
                            if (checked) {
                              newSet.add(s.id);
                            } else {
                              newSet.delete(s.id);
                            }
                            setSelectedStaffIds(newSet);
                          }}
                        />
                        <label
                          htmlFor={`staff-${s.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                        >
                          <div className="flex items-center gap-2">
                            <span>{s.full_name || s.email}</span>
                            {s.role && s.role !== 'staff' && s.role !== 'admin' && (
                              <Badge variant="outline" className="text-xs">
                                {s.role}
                              </Badge>
                            )}
                          </div>
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
            <Button onClick={editingProject ? handleUpdate : handleCreate}>{editingProject ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewingProject} onOpenChange={() => { setViewingProject(null); setNewComment(""); }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
          </DialogHeader>
          {viewingProject && (
            <div className="space-y-6">
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
              
              {/* Assigned Staff Section */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4" />
                  <Label className="text-base font-semibold">Assigned Staff</Label>
                </div>
                {(() => {
                  const staff = assignedStaff.get(viewingProject.id) || [];
                  return staff.length > 0 ? (
                    <div className="space-y-2">
                      {staff.map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <span className="text-sm">
                            {assignment.profiles?.full_name || assignment.profiles?.email || 'Unknown'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No staff assigned</p>
                  );
                })()}
              </div>
              
              {/* Comments Section */}
              {(isAdmin || staffOnlyView) && (
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-4 h-4" />
                    <Label className="text-base font-semibold">Internal Comments</Label>
                  </div>
                  <div className="space-y-3 mb-4">
                    {(() => {
                      const comments = (projectComments.get(viewingProject.id) || []).filter(c => c.is_internal);
                      return comments.length > 0 ? (
                        comments.map((comment) => (
                          <div key={comment.id} className="p-3 bg-muted rounded-md">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">
                                {comment.profiles?.full_name || comment.profiles?.email || 'Unknown'}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.created_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm">{comment.comment}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No internal comments yet</p>
                      );
                    })()}
                  </div>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add an internal comment (only visible to staff)..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddComment(viewingProject.id, newComment, true)}
                      disabled={!newComment.trim()}
                    >
                      Add Internal Comment
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setViewingProject(null); setNewComment(""); }}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
