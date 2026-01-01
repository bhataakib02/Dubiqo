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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Plus, RefreshCw, Edit, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';

type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  rating: number;
  active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({
    quote: '',
    author: '',
    role: '',
    rating: 5,
    active: true,
    display_order: 0,
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    if (!supabase) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('testimonials' as any)
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });
      if (error) throw error;
      setTestimonials((data || []) as Testimonial[]);
    } catch (err: any) {
      console.error('Error loading testimonials', err);
      toast.error('Failed to load testimonials');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      quote: '',
      author: '',
      role: '',
      rating: 5,
      active: true,
      display_order: testimonials.length,
    });
    setIsDialogOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({
      quote: t.quote || '',
      author: t.author || '',
      role: t.role || '',
      rating: t.rating || 5,
      active: t.active ?? true,
      display_order: t.display_order || 0,
    });
    setIsDialogOpen(true);
  };

  const saveTestimonial = async () => {
    if (!supabase) return;
    if (!form.quote.trim() || !form.author.trim() || !form.role.trim()) {
      toast.error('Quote, author, and role are required');
      return;
    }
    try {
      const payload: any = {
        quote: form.quote.trim(),
        author: form.author.trim(),
        role: form.role.trim(),
        rating: form.rating,
        active: form.active,
        display_order: form.display_order || 0,
      };

      if (editing) {
        const { error } = await supabase
          .from('testimonials' as any)
          .update(payload)
          .eq('id', editing.id);
        if (error) throw error;
        toast.success('Testimonial updated');
      } else {
        const { error } = await supabase
          .from('testimonials' as any)
          .insert(payload);
        if (error) throw error;
        toast.success('Testimonial created');
      }
      setIsDialogOpen(false);
      loadTestimonials();
    } catch (err: any) {
      console.error('Error saving testimonial', err);
      toast.error(err?.message || 'Failed to save testimonial');
    }
  };

  const handleDelete = async (t: Testimonial) => {
    if (!supabase) return;
    if (!confirm('Delete this testimonial?')) return;
    try {
      const { error } = await supabase
        .from('testimonials' as any)
        .delete()
        .eq('id', t.id);
      if (error) throw error;
      toast.success('Deleted');
      loadTestimonials();
    } catch (err: any) {
      console.error('Error deleting testimonial', err);
      toast.error(err?.message || 'Failed to delete');
    }
  };

  const toggleActive = async (t: Testimonial) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('testimonials' as any)
        .update({ active: !t.active })
        .eq('id', t.id);
      if (error) throw error;
      toast.success(t.active ? 'Testimonial hidden' : 'Testimonial shown');
      loadTestimonials();
    } catch (err: any) {
      console.error('Error toggling active', err);
      toast.error(err?.message || 'Failed to update');
    }
  };

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
              <h1 className="text-2xl font-bold">Testimonials</h1>
              <p className="text-muted-foreground">Manage client testimonials</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" onClick={loadTestimonials} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={openCreate}>
                <Plus className="w-4 h-4 mr-2" />
                New Testimonial
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>All Testimonials ({testimonials.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No testimonials found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Author</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Quote</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testimonials.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-medium">{t.author}</TableCell>
                        <TableCell>{t.role}</TableCell>
                        <TableCell className="max-w-md truncate">{t.quote}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < t.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{t.display_order}</TableCell>
                        <TableCell>
                          <Badge
                            variant={t.active ? 'default' : 'secondary'}
                            className="cursor-pointer"
                            onClick={() => toggleActive(t)}
                          >
                            {t.active ? 'Active' : 'Hidden'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEdit(t)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(t)}
                              className="text-destructive"
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Edit Testimonial' : 'Create Testimonial'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Quote *</Label>
              <Textarea
                value={form.quote}
                onChange={(e) => setForm({ ...form, quote: e.target.value })}
                placeholder="Enter the testimonial quote..."
                className="min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Author Name *</Label>
                <Input
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  placeholder="e.g., Sahil Singh"
                />
              </div>
              <div className="space-y-2">
                <Label>Role/Company *</Label>
                <Input
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="e.g., CEO, Digital Solutions India"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rating</Label>
                <Select
                  value={String(form.rating)}
                  onValueChange={(value) =>
                    setForm({ ...form, rating: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={form.display_order}
                  onChange={(e) =>
                    setForm({ ...form, display_order: parseInt(e.target.value) || 0 })
                  }
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                checked={form.active}
                onCheckedChange={(checked) =>
                  setForm({ ...form, active: checked as boolean })
                }
              />
              <Label htmlFor="active" className="cursor-pointer">
                Active (visible on website)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveTestimonial}>
              {editing ? 'Update' : 'Create'} Testimonial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

