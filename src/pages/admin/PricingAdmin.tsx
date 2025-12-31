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
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Plus, RefreshCw, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type PricingPlan = {
  id: string;
  name: string;
  description?: string | null;
  price_cents: number | null;
  interval: 'monthly' | 'yearly' | string | null;
  currency?: string | null;
  features?: string[] | null;
  active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export default function PricingAdmin() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PricingPlan | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    interval: 'monthly',
    currency: 'INR',
    features: '',
    active: true,
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    if (!supabase) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setPlans((data || []) as PricingPlan[]);
    } catch (err) {
      console.error('Error loading pricing plans', err);
      toast.error('Failed to load pricing plans');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: '',
      description: '',
      price: '',
      interval: 'monthly',
      currency: 'INR',
      features: '',
      active: true,
    });
    setIsDialogOpen(true);
  };

  const openEdit = (p: PricingPlan) => {
    setEditing(p);
    const features = p.features || [];
    // Extract description from first feature if it looks like a description
    // (heuristic: if first feature is longer than 30 chars, treat as description)
    let description = '';
    let featureList = features;
    if (features.length > 0 && features[0].length > 30) {
      description = features[0];
      featureList = features.slice(1);
    }
    
    setForm({
      name: p.name || '',
      description: description,
      price: p.price_cents != null ? String((p.price_cents || 0) / 100) : '',
      interval: p.interval || 'monthly',
      currency: p.currency || 'INR',
      features: featureList.join(', '),
      active: !!p.active,
    });
    setIsDialogOpen(true);
  };

  const savePlan = async () => {
    if (!supabase) return;
    if (!form.name.trim()) {
      toast.error('Name required');
      return;
    }
    const priceCents = form.price ? Math.round(parseFloat(form.price) * 100) : null;
    const payload: any = {
      name: form.name.trim(),
      price_cents: priceCents,
      interval: form.interval || null,
      currency: form.currency || null,
      features: form.features
        ? form.features
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : null,
      active: form.active,
    };
    
    // Store description in features array as first item if provided
    // Since metadata column doesn't exist, we'll prepend description to features
    if (form.description.trim()) {
      const features = payload.features || [];
      payload.features = [form.description.trim(), ...features];
    }

    try {
      if (editing) {
        const { error } = await supabase.from('pricing_plans').update(payload).eq('id', editing.id);
        if (error) throw error;
        toast.success('Plan updated');
      } else {
        const { error } = await supabase.from('pricing_plans').insert(payload);
        if (error) throw error;
        toast.success('Plan created');
      }
      setIsDialogOpen(false);
      loadPlans();
    } catch (err: any) {
      console.error('Error saving plan', err);
      toast.error(err?.message || 'Failed to save');
    }
  };

  const handleDelete = async (p: PricingPlan) => {
    if (!supabase) return;
    if (!confirm('Delete this pricing plan?')) return;
    try {
      const { error } = await supabase.from('pricing_plans').delete().eq('id', p.id);
      if (error) throw error;
      toast.success('Deleted');
      loadPlans();
    } catch (err: any) {
      console.error('Error deleting plan', err);
      toast.error(err?.message || 'Failed to delete');
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
              <h1 className="text-2xl font-bold">Pricing Plans</h1>
              <p className="text-muted-foreground">Manage pricing tiers and features</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" onClick={loadPlans}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={openCreate}>
                <Plus className="w-4 h-4 mr-2" />
                New Plan
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>All Plans ({plans.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Interval</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>
                        {p.price_cents != null
                          ? `${(p.price_cents / 100).toFixed(2)} ${p.currency || 'INR'}`
                          : '-'}
                      </TableCell>
                      <TableCell>{p.interval || '-'}</TableCell>
                      <TableCell>{(p.features || []).join(', ')}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{p.active ? 'Active' : 'Inactive'}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(p)}
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
          </CardContent>
        </Card>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Plan' : 'New Plan'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Starter, Professional, New Year Special"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g., Perfect for small businesses, New Year offer, etc."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price (₹)</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g., 2499"
                />
              </div>
              <div className="space-y-2">
                <Label>Interval</Label>
                <Input
                  value={form.interval}
                  onChange={(e) => setForm({ ...form, interval: e.target.value })}
                  placeholder="e.g., monthly, yearly, one-time"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Input
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                placeholder="INR, USD, etc."
              />
            </div>
            <div className="space-y-2">
              <Label>Features (comma separated)</Label>
              <Textarea
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="active"
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              <Label htmlFor="active" className="text-sm font-normal">
                Active
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={savePlan}>{editing ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
