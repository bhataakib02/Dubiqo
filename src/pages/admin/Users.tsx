import { useEffect, useState } from 'react';
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
  Users,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  FileText,
  FolderKanban,
  Ticket,
} from 'lucide-react';
import { toast } from 'sonner';

interface UserWithRole {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  client_code: string | null;
  created_at: string;
  role: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [staffOnlyView, setStaffOnlyView] = useState(false);
  const [myClientIds, setMyClientIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<UserWithRole | null>(null);
  const [viewingUser, setViewingUser] = useState<UserWithRole | null>(null);
  const [editForm, setEditForm] = useState({
    full_name: '',
    company_name: '',
    phone: '',
    role: 'client',
  });
  const [userStats, setUserStats] = useState<{
    invoices: number;
    projects: number;
    tickets: number;
  }>({ invoices: 0, projects: 0, tickets: 0 });

  const location = useLocation();
  const cameFromStaff = (location.state as any)?.from === 'staff';
  const backHref = cameFromStaff ? '/staff' : '/admin/dashboard';
  const backLabel = cameFromStaff ? 'Back to Staff Workspace' : 'Back to Dashboard';

  useEffect(() => {
    initializeUsers();
  }, []);

  const initializeUsers = async () => {
    if (!supabase) {
      await loadUsers();
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        await loadUsers();
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
          console.error('Error loading staff client tickets:', error);
        } else {
          const ids = new Set<string>();
          (myTickets || []).forEach((t: any) => {
            if (t.client_id) ids.add(t.client_id);
          });
          setMyClientIds(ids);
        }
      }

      await loadUsers(staffOnly);
    } catch (error) {
      console.error('Error initializing users view:', error);
      await loadUsers();
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        (user) =>
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.client_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const loadUsers = async (staffOnlyParam?: boolean) => {
    if (!supabase) return;
    setIsLoading(true);

    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name, company_name, phone, client_code, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        console.warn('Warning: failed to load user_roles (RLS or permission issue)', rolesError);
      }

      const roleMap = new Map<string, string>();
      (roles || []).forEach((r: any) => {
        try {
          roleMap.set(r.user_id, r.role);
        } catch (e) {
          console.warn('Malformed role row', r, e);
        }
      });

      let usersWithRoles: UserWithRole[] = (profiles || []).map((profile) => ({
        ...profile,
        role: roleMap.get(profile.id) || 'client',
      }));

      const staffOnly = staffOnlyParam ?? staffOnlyView;
      if (staffOnly && myClientIds.size > 0) {
        usersWithRoles = usersWithRoles.filter((u) => myClientIds.has(u.id));
      }

      setUsers(usersWithRoles);
      setFilteredUsers(usersWithRoles);
    } catch (error: any) {
      console.error('Error loading users:', error);
      if (error?.status)
        console.error('Status:', error.status, 'Details:', error?.details || error?.message);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserStats = async (userId: string) => {
    if (!supabase) return;

    try {
      const [invoicesRes, projectsRes, ticketsRes] = await Promise.all([
        supabase
          .from('invoices')
          .select('*', { count: 'exact', head: true })
          .eq('client_id', userId),
        supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('client_id', userId),
        supabase
          .from('tickets')
          .select('*', { count: 'exact', head: true })
          .eq('client_id', userId),
      ]);

      setUserStats({
        invoices: invoicesRes.count || 0,
        projects: projectsRes.count || 0,
        tickets: ticketsRes.count || 0,
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleView = async (user: UserWithRole) => {
    setViewingUser(user);
    await loadUserStats(user.id);
  };

  const handleEdit = (user: UserWithRole) => {
    setEditingUser(user);
    setEditForm({
      full_name: user.full_name || '',
      company_name: user.company_name || '',
      phone: user.phone || '',
      role: user.role,
    });
  };

  const handleSaveEdit = async () => {
    if (!supabase || !editingUser) return;

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          company_name: editForm.company_name,
          phone: editForm.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingUser.id);

      if (profileError) throw profileError;

      // Update role if changed
      if (editForm.role !== editingUser.role) {
        const { error: deleteRoleError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', editingUser.id);

        if (deleteRoleError) throw deleteRoleError;

        const { error: insertRoleError } = await supabase
          .from('user_roles')
          .insert({ user_id: editingUser.id, role: editForm.role as 'admin' | 'staff' | 'client' });

        if (insertRoleError) throw insertRoleError;
      }

      toast.success('User updated successfully');
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleDelete = async (user: UserWithRole) => {
    if (!supabase) return;
    if (
      !confirm(`Are you sure you want to delete user ${user.email}? This action cannot be undone.`)
    )
      return;

    try {
      // Delete user role first
      await supabase.from('user_roles').delete().eq('user_id', user.id);

      // Delete profile (this won't delete from auth.users, but removes from app)
      const { error } = await supabase.from('profiles').delete().eq('id', user.id);

      if (error) throw error;
      toast.success('User deleted successfully');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'staff':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
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
              <h1 className="text-2xl font-bold">User Management</h1>
              <p className="text-muted-foreground">Manage all system users</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <CardTitle>All Users ({filteredUsers.length})</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={loadUsers} disabled={isLoading}>
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
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {searchTerm ? 'No users match your search' : 'No users found'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client Code</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-mono font-semibold">
                          {user.client_code || '-'}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.full_name || '-'}</TableCell>
                        <TableCell>{user.company_name || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleView(user)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(user)}
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

      {/* View User Dialog */}
      <Dialog open={!!viewingUser} onOpenChange={() => setViewingUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {viewingUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Client Code</p>
                  <p className="font-mono font-semibold">{viewingUser.client_code || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <Badge variant="outline" className={getRoleColor(viewingUser.role)}>
                    {viewingUser.role}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{viewingUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{viewingUser.full_name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="font-medium">{viewingUser.company_name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{viewingUser.phone || '-'}</p>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Activity Summary</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-muted rounded">
                    <FileText className="w-4 h-4 mx-auto mb-1" />
                    <p className="text-lg font-bold">{userStats.invoices}</p>
                    <p className="text-xs text-muted-foreground">Invoices</p>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <FolderKanban className="w-4 h-4 mx-auto mb-1" />
                    <p className="text-lg font-bold">{userStats.projects}</p>
                    <p className="text-xs text-muted-foreground">Projects</p>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <Ticket className="w-4 h-4 mx-auto mb-1" />
                    <p className="text-lg font-bold">{userStats.tickets}</p>
                    <p className="text-xs text-muted-foreground">Tickets</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingUser(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={editForm.full_name}
                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                value={editForm.company_name}
                onChange={(e) => setEditForm({ ...editForm, company_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={editForm.role}
                onValueChange={(value) => setEditForm({ ...editForm, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
