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
  published?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type DiscountBanner = {
  id?: string;
  key: string;
  title: string;
  description: string;
  discount_percent: number;
  active: boolean;
  enabled?: boolean;
};

export default function PricingAdmin() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PricingPlan | null>(null);
  const [editingDiscount, setEditingDiscount] = useState<DiscountBanner | null>(null);
  const [discountBanners, setDiscountBanners] = useState<DiscountBanner[]>([]);
  const [activeDiscountKey, setActiveDiscountKey] = useState<string | null>(null);
  const [discountBanner, setDiscountBanner] = useState<DiscountBanner>({
    key: '',
    title: '',
    description: '',
    discount_percent: 0,
    active: false,
  });
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    interval: 'monthly',
    currency: 'INR',
    features: '',
    active: true,
    published: true,
  });

  useEffect(() => {
    loadPlans();
    loadDiscountBanners();
  }, []);

  const loadDiscountBanners = async () => {
    if (!supabase) return;
    try {
      // Load all discount banners (keys starting with 'pricing_discount_')
      const { data, error } = await supabase
        .from('feature_flags' as any)
        .select('key, description, enabled')
        .like('key', 'pricing_discount_%')
        .order('created_at', { ascending: false });
      
      if (error) {
        if (error.code === 'PGRST116') {
          return;
        }
        console.error('Error loading discount banners:', error);
        return;
      }
      
      if (data && Array.isArray(data)) {
        const banners: DiscountBanner[] = [];
        let activeKey: string | null = null;
        
        data.forEach((item: any) => {
          try {
            if (item.key === 'pricing_discount_active') {
              // This is the active discount key
              activeKey = item.description;
            } else if (item.description) {
              const bannerData = JSON.parse(item.description);
              banners.push({
                id: item.key,
                key: item.key,
                ...bannerData,
                enabled: item.enabled,
              });
            }
          } catch (parseError) {
            console.warn('Failed to parse discount banner:', parseError);
          }
        });
        
        setDiscountBanners(banners);
        setActiveDiscountKey(activeKey);
        
        // Set current discount banner if editing
        if (activeKey) {
          const activeBanner = banners.find(b => b.key === activeKey);
          if (activeBanner) {
            setDiscountBanner(activeBanner);
          }
        }
      }
    } catch (err) {
      console.error('Error loading discount banners:', err);
    }
  };

  const saveDiscountBanner = async () => {
    if (!supabase) return;
    if (!discountBanner.title.trim()) {
      toast.error('Discount title is required');
      return;
    }
    
    try {
      // Generate key if new
      const bannerKey = discountBanner.key || `pricing_discount_${Date.now()}`;
      
      // Save the discount banner
      const { error: saveError } = await supabase
        .from('feature_flags' as any)
        .upsert({
          key: bannerKey,
          description: JSON.stringify({
            title: discountBanner.title,
            description: discountBanner.description,
            discount_percent: discountBanner.discount_percent,
            active: discountBanner.active,
          }),
          enabled: discountBanner.active,
        } as any, {
          onConflict: 'key'
        });
      
      if (saveError) throw saveError;
      
      // If this banner is active, update the active key
      if (discountBanner.active) {
        const { error: activeError } = await supabase
          .from('feature_flags' as any)
          .upsert({
            key: 'pricing_discount_active',
            description: bannerKey,
            enabled: true,
          } as any, {
            onConflict: 'key'
          });
        
        if (activeError) throw activeError;
      }
      
      toast.success('Discount banner saved');
      setIsDiscountDialogOpen(false);
      setEditingDiscount(null);
      setDiscountBanner({
        key: '',
        title: '',
        description: '',
        discount_percent: 0,
        active: false,
      });
      loadDiscountBanners();
    } catch (err: any) {
      console.error('Error saving discount banner:', err);
      toast.error(err?.message || 'Failed to save discount banner');
    }
  };

  const openCreateDiscount = () => {
    setEditingDiscount(null);
    setDiscountBanner({
      key: '',
      title: '',
      description: '',
      discount_percent: 0,
      active: false,
    });
    setIsDiscountDialogOpen(true);
  };

  const openEditDiscount = (banner: DiscountBanner) => {
    setEditingDiscount(banner);
    setDiscountBanner(banner);
    setIsDiscountDialogOpen(true);
  };

  const deleteDiscount = async (banner: DiscountBanner) => {
    if (!supabase) return;
    if (!confirm(`Delete discount "${banner.title}"?`)) return;
    
    try {
      const { error } = await supabase
        .from('feature_flags' as any)
        .delete()
        .eq('key', banner.key);
      
      if (error) throw error;
      
      // If this was the active discount, clear the active key
      if (activeDiscountKey === banner.key) {
        await supabase
        .from('feature_flags' as any)
        .delete()
        .eq('key', 'pricing_discount_active');
        setActiveDiscountKey(null);
      }
      
      toast.success('Discount deleted');
      loadDiscountBanners();
    } catch (err: any) {
      console.error('Error deleting discount:', err);
      toast.error(err?.message || 'Failed to delete discount');
    }
  };

  const setActiveDiscount = async (banner: DiscountBanner) => {
    if (!supabase) return;
    try {
      // Deactivate all other banners
      const updates = discountBanners.map(b => ({
        key: b.key,
        description: JSON.stringify({
          ...b,
          active: b.key === banner.key,
        }),
        enabled: b.key === banner.key,
      }));
      
      for (const update of updates) {
        await supabase
          .from('feature_flags' as any)
          .upsert(update as any, { onConflict: 'key' });
      }
      
      // Set active discount key
      await supabase
        .from('feature_flags' as any)
        .upsert({
          key: 'pricing_discount_active',
          description: banner.key,
          enabled: true,
        } as any, { onConflict: 'key' });
      
      toast.success(`"${banner.title}" is now active on the website`);
      loadDiscountBanners();
    } catch (err: any) {
      console.error('Error setting active discount:', err);
      toast.error(err?.message || 'Failed to set active discount');
    }
  };

  const loadPlans = async () => {
    if (!supabase) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pricing_plans' as any)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setPlans((data || []) as unknown as PricingPlan[]);
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
      published: true,
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
      published: p.published ?? true,
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
      published: form.published,
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

  const togglePublish = async (p: PricingPlan) => {
    if (!supabase) return;
    try {
      const currentPublished = p.published ?? false;
      const published = !currentPublished;
      
      const { error } = await supabase
        .from('pricing_plans')
        .update({ published })
        .eq('id', p.id);
        
      if (error) throw error;
      
      toast.success(published ? '✅ Published - Plan is now visible on website' : '❌ Unpublished - Plan hidden from website');
      loadPlans();
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
              <h1 className="text-2xl font-bold">Pricing Plans</h1>
              <p className="text-muted-foreground">Manage pricing tiers and features</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" onClick={loadPlans}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                onClick={openCreateDiscount}
              >
                ➕ Add Discount
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
                    <TableHead>Published</TableHead>
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
                      <TableCell>
                        <Badge variant={p.published ? "default" : "secondary"}>
                          {p.published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant={p.published ? "outline" : "default"} 
                            size="sm" 
                            onClick={() => togglePublish(p)}
                          >
                            {p.published ? "Unpublish" : "Publish"}
                          </Button>
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

        {/* Discount Banners Section */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Discount Banners ({discountBanners.length})</CardTitle>
              <Button variant="outline" onClick={loadDiscountBanners}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Manage discount banners shown on the website. Only one can be active at a time.
            </p>
          </CardHeader>
          <CardContent>
            {discountBanners.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">
                No discount banners created yet. Click "Add Discount" to create one.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Active on Site</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {discountBanners.map((banner) => (
                      <TableRow key={banner.key}>
                        <TableCell className="font-medium">{banner.title}</TableCell>
                        <TableCell className="max-w-xs truncate">{banner.description || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="destructive" className="font-bold">
                            {banner.discount_percent}% OFF
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={banner.enabled ? "default" : "secondary"}>
                            {banner.enabled ? "Enabled" : "Disabled"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {activeDiscountKey === banner.key ? (
                            <Badge className="bg-green-600">✓ Active</Badge>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setActiveDiscount(banner)}
                            >
                              Set Active
                            </Button>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDiscount(banner)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteDiscount(banner)}
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
            <Button onClick={savePlan}>{editing ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Discount Banner Dialog */}
      <Dialog open={isDiscountDialogOpen} onOpenChange={setIsDiscountDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDiscount ? 'Edit Discount Banner' : 'Create Discount Banner'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Discount Title *</Label>
              <Input
                value={discountBanner.title}
                onChange={(e) => setDiscountBanner({ ...discountBanner, title: e.target.value })}
                placeholder="e.g., New Year Discount, Summer Sale, Limited Time Offer"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={discountBanner.description}
                onChange={(e) => setDiscountBanner({ ...discountBanner, description: e.target.value })}
                rows={3}
                placeholder="e.g., Get 30% off on all plans this New Year!"
              />
            </div>
            <div className="space-y-2">
              <Label>Discount Percentage (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={discountBanner.discount_percent}
                onChange={(e) => setDiscountBanner({ ...discountBanner, discount_percent: parseInt(e.target.value) || 0 })}
                placeholder="e.g., 30"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="discount-active"
                checked={discountBanner.active}
                onCheckedChange={(checked) => setDiscountBanner({ ...discountBanner, active: checked as boolean })}
              />
              <Label htmlFor="discount-active" className="cursor-pointer font-normal">
                Enable this discount (you can set it as active later)
              </Label>
            </div>
            {activeDiscountKey && activeDiscountKey !== discountBanner.key && (
              <div className="text-sm text-muted-foreground bg-yellow-500/10 border border-yellow-500/20 rounded p-2">
                Note: Another discount is currently active on the website. You can set this one as active after saving.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDiscountDialogOpen(false);
              setEditingDiscount(null);
              setDiscountBanner({
                key: '',
                title: '',
                description: '',
                discount_percent: 0,
                active: false,
              });
            }}>
              Cancel
            </Button>
            <Button onClick={saveDiscountBanner}>
              {editingDiscount ? 'Update' : 'Create'} Discount Banner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
