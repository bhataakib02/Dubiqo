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

type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  technologies: string[] | null;
  link: string | null;
  published: boolean | null;
  created_at?: string;
};

const emptyItem: Omit<PortfolioItem, 'id'> = {
  title: '',
  category: '',
  description: '',
  image: '',
  technologies: [],
  link: '',
  published: true,
};

export default function AdminPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyItem);

  const loadItems = async () => {
    if (!supabase) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('portfolio_items' as any)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setItems((data as any as PortfolioItem[]) || []);
    } catch (error) {
      console.error('Error loading portfolio items:', error);
      toast.error("Failed to load portfolio items. Make sure the table 'portfolio_items' exists.");
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
    setForm(emptyItem);
    setIsDialogOpen(true);
  };

  const openEdit = (item: PortfolioItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      category: item.category || '',
      description: item.description || '',
      image: item.image || '',
      technologies: item.technologies || [],
      link: item.link || '',
      published: item.published ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!supabase) return;
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        technologies: form.technologies || [],
        link: form.link?.trim() || null,
        published: form.published ?? true,
      };
      if (editingId) {
        const { error } = await supabase
          .from('portfolio_items' as any)
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
        toast.success('Portfolio item updated');
      } else {
        const { error } = await supabase.from('portfolio_items' as any).insert(payload);
        if (error) throw error;
        toast.success('Portfolio item created');
      }
      setIsDialogOpen(false);
      setEditingId(null);
      setForm(emptyItem);
      await loadItems();
    } catch (error) {
      console.error('Error saving portfolio item:', error);
      toast.error('Failed to save portfolio item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    if (!confirm('Delete this portfolio item?')) return;
    try {
      const { error } = await supabase
        .from('portfolio_items' as any)
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Deleted');
      await loadItems();
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      toast.error('Failed to delete');
    }
  };

  const togglePublish = async (item: PortfolioItem) => {
    if (!supabase) return;
    try {
      const currentPublished = item.published ?? false;
      const published = !currentPublished;
      
      const { error } = await supabase
        .from('portfolio_items' as any)
        .update({ published })
        .eq('id', item.id);
        
      if (error) throw error;
      
      toast.success(published ? '✅ Published - Portfolio item is now visible on website' : '❌ Unpublished - Portfolio item hidden from website');
      await loadItems();
    } catch (err: any) {
      console.error('Error toggling publish:', err);
      toast.error(err?.message || 'Failed to change publish state');
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
              <h1 className="text-2xl font-bold">Portfolio Items</h1>
              <p className="text-sm text-muted-foreground">
                Manage portfolio cards shown on the public Portfolio page.
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" onClick={loadItems}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={openCreate}>
                <Plus className="w-4 h-4 mr-2" />
                New Item
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
            <div className="text-center text-muted-foreground py-10">No items found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Tech</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(item.technologies || []).map((t) => (
                          <Badge key={t} variant="outline" className="text-xs">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.link ? (
                        <a
                          className="text-primary hover:underline"
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Link
                        </a>
                      ) : (
                        '-'
                      )}
                    </TableCell>
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
            <DialogTitle>{editingId ? 'Edit Portfolio Item' : 'New Portfolio Item'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="FinTech Dashboard"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Dashboards"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">External Link</Label>
                <Input
                  id="link"
                  value={form.link || ''}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://..."
                />
              </div>
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
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Short description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tech">Technologies (comma separated)</Label>
              <Input
                id="tech"
                value={form.technologies.join(', ')}
                onChange={(e) =>
                  setForm({
                    ...form,
                    technologies: e.target.value
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="React, TypeScript, Node.js"
              />
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
