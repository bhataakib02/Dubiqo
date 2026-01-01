import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Edit,
  Upload,
  Image as ImageIcon,
  RefreshCw,
  Trash2,
} from 'lucide-react';

type ServiceImage = {
  id: string;
  service_slug: string;
  service_title: string;
  image_url: string | null;
  image_path: string | null;
  alt_text: string | null;
  created_at: string;
  updated_at: string;
};

const SERVICE_SLUGS = [
  { slug: 'websites', title: 'Custom Websites' },
  { slug: 'web-apps', title: 'Web Applications' },
  { slug: 'dashboards', title: 'Dashboards' },
  { slug: 'ecommerce', title: 'E-Commerce' },
  { slug: 'portfolios', title: 'Portfolio Making' },
  { slug: 'repair', title: 'Site Repair' },
  { slug: 'maintenance', title: 'Maintenance' },
];

export default function ServiceImages() {
  const [images, setImages] = useState<ServiceImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    service_slug: '',
    service_title: '',
    image_url: '',
    alt_text: '',
  });

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    if (!supabase) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('service_images')
        .select('*')
        .order('service_title', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error: any) {
      console.error('Error loading service images:', error);
      toast.error('Failed to load service images');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData({
      service_slug: '',
      service_title: '',
      image_url: '',
      alt_text: '',
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsDialogOpen(true);
  };

  const openEdit = (item: ServiceImage) => {
    setEditingId(item.id);
    setFormData({
      service_slug: item.service_slug,
      service_title: item.service_title,
      image_url: item.image_url || '',
      alt_text: item.alt_text || '',
    });
    setSelectedFile(null);
    setPreviewUrl(item.image_url || null);
    setIsDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!supabase) return;

    if (!formData.service_slug.trim() || !formData.service_title.trim()) {
      toast.error('Service slug and title are required');
      return;
    }

    setUploading(true);

    try {
      let imageUrl = formData.image_url;
      let imagePath = null;

      // Upload file if selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop()?.toLowerCase() || '';
        const fileName = `service-${formData.service_slug}-${Date.now()}.${fileExt}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('service-images')
          .upload(fileName, selectedFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('service-images')
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
        imagePath = fileName;
      }

      const payload: any = {
        service_slug: formData.service_slug.trim(),
        service_title: formData.service_title.trim(),
        alt_text: formData.alt_text.trim() || null,
        updated_at: new Date().toISOString(),
      };

      if (imageUrl) {
        payload.image_url = imageUrl;
      }
      if (imagePath) {
        payload.image_path = imagePath;
      }

      if (editingId) {
        const { error } = await supabase
          .from('service_images')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
        toast.success('Service image updated');
      } else {
        const { error } = await supabase.from('service_images').insert(payload);
        if (error) throw error;
        toast.success('Service image created');
      }

      setIsDialogOpen(false);
      setEditingId(null);
      setFormData({
        service_slug: '',
        service_title: '',
        image_url: '',
        alt_text: '',
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      await loadImages();
    } catch (error: any) {
      console.error('Error saving service image:', error);
      toast.error(error?.message || 'Failed to save service image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    if (!confirm('Delete this service image? This cannot be undone.')) return;

    try {
      const image = images.find((img) => img.id === id);
      
      // Delete from storage if path exists
      if (image?.image_path) {
        await supabase.storage
          .from('service-images')
          .remove([image.image_path]);
      }

      const { error } = await supabase
        .from('service_images')
        .delete()
        .eq('id', id);
      if (error) throw error;

      toast.success('Service image deleted');
      await loadImages();
    } catch (error: any) {
      console.error('Error deleting service image:', error);
      toast.error(error?.message || 'Failed to delete service image');
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
              <h1 className="text-2xl font-bold">Service Images</h1>
              <p className="text-sm text-muted-foreground">
                Manage images displayed on the Services page and service detail pages.
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" onClick={loadImages}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={openCreate}>
                <Upload className="w-4 h-4 mr-2" />
                Add Image
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Service Images</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : images.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">
                No service images found. Click "Add Image" to upload one.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image) => (
                  <Card key={image.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted relative">
                      {image.image_url ? (
                        <img
                          src={image.image_url}
                          alt={image.alt_text || image.service_title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{image.service_title}</h3>
                          <p className="text-sm text-muted-foreground">{image.service_slug}</p>
                        </div>
                      </div>
                      {image.alt_text && (
                        <p className="text-xs text-muted-foreground mb-3">{image.alt_text}</p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => openEdit(image)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDelete(image.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Service Image' : 'Add Service Image'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service_slug">Service Slug *</Label>
                <select
                  id="service_slug"
                  value={formData.service_slug}
                  onChange={(e) => {
                    const selected = SERVICE_SLUGS.find((s) => s.slug === e.target.value);
                    setFormData({
                      ...formData,
                      service_slug: e.target.value,
                      service_title: selected?.title || formData.service_title,
                    });
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select service...</option>
                  {SERVICE_SLUGS.map((service) => (
                    <option key={service.slug} value={service.slug}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="service_title">Service Title *</Label>
                <Input
                  id="service_title"
                  value={formData.service_title}
                  onChange={(e) =>
                    setFormData({ ...formData, service_title: e.target.value })
                  }
                  placeholder="Custom Websites"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Upload Image</Label>
              <Input
                id="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Upload a new image file (JPG, PNG, SVG, etc.)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Or Image URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                placeholder="https://..."
                disabled={!!selectedFile}
              />
              <p className="text-xs text-muted-foreground">
                Enter a direct image URL (disabled when file is selected)
              </p>
            </div>

            {previewUrl && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="aspect-video border rounded-md overflow-hidden bg-muted">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="alt_text">Alt Text</Label>
              <Input
                id="alt_text"
                value={formData.alt_text}
                onChange={(e) =>
                  setFormData({ ...formData, alt_text: e.target.value })
                }
                placeholder="Description for accessibility"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={uploading}>
                {uploading ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

