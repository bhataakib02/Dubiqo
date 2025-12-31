import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

type Stat = { label: string; value: string };

type CaseStudy = {
  id: string;
  slug: string;
  title: string;
  client: string;
  category: string;
  image: string;
  excerpt: string;
  stats: Stat[] | null;
  published: boolean | null;
  created_at?: string;
};

const emptyStudy: Omit<CaseStudy, 'id'> = {
  slug: '',
  title: '',
  client: '',
  category: '',
  image: '',
  excerpt: '',
  published: true,
  stats: [
    { label: 'Metric 1', value: '' },
    { label: 'Metric 2', value: '' },
    { label: 'Metric 3', value: '' },
  ],
};

export default function CaseStudiesAdmin() {
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<CaseStudy, 'id'>>(emptyStudy);

  const loadItems = async () => {
    if (!supabase) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('case_studies' as any)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setItems((data as CaseStudy[]) || []);
    } catch (error) {
      console.error('Error loading case studies:', error);
      toast.error("Failed to load case studies. Make sure the table 'case_studies' exists.");
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyStudy);
    setIsDialogOpen(true);
  };

  const openEdit = (item: CaseStudy) => {
    setEditingId(item.id);
    setForm({
      slug: item.slug || '',
      title: item.title || '',
      client: item.client || '',
      category: item.category || '',
      image: item.image || '',
      excerpt: item.excerpt || '',
      stats: item.stats || emptyStudy.stats,
      published: item.published ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!supabase) return;
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error('Slug and Title are required');
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        slug: form.slug.trim(),
        title: form.title.trim(),
        client: form.client.trim(),
        category: form.category.trim(),
        image: form.image.trim(),
        excerpt: form.excerpt.trim(),
        stats: form.stats || [],
        published: form.published ?? true,
      };

      if (editingId) {
        const { error } = await supabase
          .from('case_studies' as any)
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
        toast.success('Case study updated');
      } else {
        const { error } = await supabase.from('case_studies' as any).insert(payload);
        if (error) throw error;
        toast.success('Case study created');
      }
      setIsDialogOpen(false);
      setEditingId(null);
      setForm(emptyStudy);
      await loadItems();
    } catch (error) {
      console.error('Error saving case study:', error);
      toast.error('Failed to save case study');
    } finally {
      setIsSaving(false);
    }
  };

  const togglePublish = async (item: CaseStudy) => {
    if (!supabase) return;
    try {
      // Handle null published field (treat null as false)
      const currentPublished = item.published ?? false;
      const published = !currentPublished;
      
      const { data, error } = await supabase
        .from('case_studies' as any)
        .update({ published: published })
        .eq('id', item.id)
        .select()
        .single();
        
      if (error) {
        console.error('Update error:', error);
        throw error;
      }
      
      console.log('Publish toggle result:', data);
      toast.success(published ? '✅ Published - Case study is now visible on website' : '❌ Unpublished - Case study hidden from website');
      await loadItems();
    } catch (err: any) {
      console.error('Error toggling publish:', err);
      toast.error(err?.message || 'Failed to change publish state. Check console for details.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    if (!confirm('Delete this case study?')) return;
    try {
      const { error } = await supabase
        .from('case_studies' as any)
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Deleted');
      await loadItems();
    } catch (error) {
      console.error('Error deleting case study:', error);
      toast.error('Failed to delete');
    }
  };

  const updateStat = (index: number, field: 'label' | 'value', value: string) => {
    const stats = [...(form.stats || [])];
    stats[index] = { ...stats[index], [field]: value };
    setForm({ ...form, stats });
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
              <h1 className="text-2xl font-bold">Case Studies</h1>
              <p className="text-sm text-muted-foreground">
                Manage case studies shown on the public page.
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" onClick={loadItems}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={openCreate}>
                <Plus className="w-4 h-4 mr-2" />
                New Case Study
              </Button>
            </div>
          </div>
        </div>
      </header>

      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">No case studies found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.slug}</TableCell>
                    <TableCell>{item.client}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <Badge variant={item.published ? "default" : "secondary"}>
                        {item.published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant={item.published ? "outline" : "default"} 
                        size="sm" 
                        onClick={() => togglePublish(item)}
                      >
                        {item.published ? "Unpublish" : "Publish"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openEdit(item)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Case Study' : 'New Case Study'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="FinTech Dashboard Redesign"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="fintech-dashboard-redesign"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  value={form.client}
                  onChange={(e) => setForm({ ...form, client: e.target.value })}
                  placeholder="PayFlow Inc."
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Web Application"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                rows={3}
                placeholder="Short summary"
              />
            </div>
            <div className="space-y-2">
              <Label>Stats (label & value)</Label>
              <div className="space-y-3">
                {(form.stats || []).map((stat, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-3">
                    <Input
                      value={stat.label}
                      onChange={(e) => updateStat(idx, 'label', e.target.value)}
                      placeholder="Metric label"
                    />
                    <Input
                      value={stat.value}
                      onChange={(e) => updateStat(idx, 'value', e.target.value)}
                      placeholder="Value (e.g., +150%)"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="published"
                checked={form.published ?? true}
                onCheckedChange={(checked) => setForm({ ...form, published: checked as boolean })}
              />
              <Label htmlFor="published" className="cursor-pointer font-normal">
                Published (visible on website)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
