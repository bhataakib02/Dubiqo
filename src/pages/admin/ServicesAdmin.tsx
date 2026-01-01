import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Edit,
  Upload,
  Image as ImageIcon,
  RefreshCw,
  Trash2,
  Plus,
  CheckCircle,
  FolderKanban,
  Eye,
  EyeOff,
  ArrowRight,
  Save,
  X,
} from 'lucide-react';

type ProcessStep = {
  step: string;
  title: string;
  description: string;
};

type Service = {
  id: string;
  slug: string;
  title: string;
  description: string;
  short_description: string | null;
  pricing_text: string | null;
  pricing_amount: number | null;
  icon_name: string | null;
  features: string[] | null;
  benefits: string[] | null;
  process_steps: ProcessStep[] | null;
  image_url: string | null;
  image_path: string | null;
  alt_text: string | null;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

const ICON_OPTIONS = [
  { value: 'Globe', label: 'Globe' },
  { value: 'Layers', label: 'Layers' },
  { value: 'LineChart', label: 'Line Chart' },
  { value: 'ShoppingCart', label: 'Shopping Cart' },
  { value: 'Briefcase', label: 'Briefcase' },
  { value: 'Wrench', label: 'Wrench' },
  { value: 'Headphones', label: 'Headphones' },
  { value: 'Code2', label: 'Code' },
  { value: 'BarChart3', label: 'Bar Chart' },
];

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

export default function ServicesAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => {
    // Check if coming from /admin/service-images route
    return location.pathname.includes('service-images') ? 'images' : 'services';
  });

  // Update URL when tab changes (without navigation)
  useEffect(() => {
    if (activeTab === 'images' && !location.pathname.includes('service-images')) {
      window.history.replaceState(null, '', '/admin/service-images');
    } else if (activeTab === 'services' && location.pathname.includes('service-images')) {
      window.history.replaceState(null, '', '/admin/services');
    }
  }, [activeTab, location.pathname]);
  
  // Services state
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Service Images state
  const [serviceImages, setServiceImages] = useState<ServiceImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  
  const [imageFormData, setImageFormData] = useState({
    service_slug: '',
    service_title: '',
    image_url: '',
    alt_text: '',
  });

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    short_description: '',
    pricing_text: '',
    pricing_amount: '',
    icon_name: 'Globe',
    features: '',
    benefits: '',
    process_steps: '',
    alt_text: '',
    display_order: 0,
    published: true,
  });
  
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);

  useEffect(() => {
    loadServices();
    loadServiceImages();
  }, []);

  const loadServices = async () => {
    if (!supabase) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      console.error('Error loading services:', error);
      toast.error('Failed to load services');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData({
      slug: '',
      title: '',
      description: '',
      short_description: '',
      pricing_text: '',
      pricing_amount: '',
      icon_name: 'Globe',
      features: '',
      benefits: '',
      process_steps: '',
      alt_text: '',
      display_order: services.length,
      published: true,
    });
    setProcessSteps([]);
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsDialogOpen(true);
  };

  const openEdit = async (service: Service) => {
    setEditingId(service.id);
    setFormData({
      slug: service.slug,
      title: service.title,
      description: service.description,
      short_description: service.short_description || '',
      pricing_text: service.pricing_text || '',
      pricing_amount: service.pricing_amount?.toString() || '',
      icon_name: service.icon_name || 'Globe',
      features: service.features?.join('\n') || '',
      benefits: service.benefits?.join('\n') || '',
      process_steps: '',
      alt_text: service.alt_text || '',
      display_order: service.display_order,
      published: service.published ?? true,
    });
    setProcessSteps(service.process_steps || []);
    setSelectedFile(null);
    setPreviewUrl(service.image_url || null);
    
    // Load existing service image if available
    if (supabase && service.slug) {
      const { data } = await supabase
        .from('service_images')
        .select('image_url, alt_text')
        .eq('service_slug', service.slug)
        .single();
      
      if (data?.image_url && !service.image_url) {
        setPreviewUrl(data.image_url);
      }
      if (data?.alt_text && !service.alt_text) {
        setFormData(prev => ({ ...prev, alt_text: data.alt_text || '' }));
      }
    }
    
    setIsDialogOpen(true);
  };
  
  const addProcessStep = () => {
    const stepNumber = String(processSteps.length + 1).padStart(2, '0');
    setProcessSteps([...processSteps, { step: stepNumber, title: '', description: '' }]);
  };
  
  const removeProcessStep = (index: number) => {
    const newSteps = processSteps.filter((_, i) => i !== index);
    // Renumber steps
    const renumbered = newSteps.map((step, i) => ({
      ...step,
      step: String(i + 1).padStart(2, '0'),
    }));
    setProcessSteps(renumbered);
  };
  
  const updateProcessStep = (index: number, field: keyof ProcessStep, value: string) => {
    const newSteps = [...processSteps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setProcessSteps(newSteps);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!supabase) return;

    if (!formData.slug.trim() || !formData.title.trim() || !formData.description.trim()) {
      toast.error('Slug, title, and description are required');
      return;
    }

    setUploading(true);

    try {
      let imageUrl = null;
      let imagePath = null;

      // Upload file if selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop()?.toLowerCase() || '';
        const fileName = `service-${formData.slug}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('service-images')
          .upload(fileName, selectedFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('service-images')
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
        imagePath = fileName;
      }

      // Parse features and benefits
      const features = formData.features
        .split('\n')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);
      const benefits = formData.benefits
        .split('\n')
        .map((b) => b.trim())
        .filter((b) => b.length > 0);

      // Use process steps from state (already in correct format)
      const processStepsData = processSteps.length > 0 ? processSteps : null;

      const payload: any = {
        slug: formData.slug.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        short_description: formData.short_description.trim() || null,
        pricing_text: formData.pricing_text.trim() || null,
        pricing_amount: formData.pricing_amount ? parseFloat(formData.pricing_amount) : null,
        icon_name: formData.icon_name || null,
        features: features.length > 0 ? features : null,
        benefits: benefits.length > 0 ? benefits : null,
        process_steps: processStepsData,
        alt_text: formData.alt_text.trim() || null,
        display_order: parseInt(formData.display_order.toString()) || 0,
        published: formData.published,
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
          .from('services')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
        toast.success('Service updated');
      } else {
        const { error } = await supabase.from('services').insert(payload);
        if (error) throw error;
        toast.success('Service created');
      }

      // Also update/create service_images entry if image is provided
      if (imageUrl) {
        const imagePayload: any = {
          service_slug: formData.slug.trim(),
          service_title: formData.title.trim(),
          image_url: imageUrl,
          alt_text: formData.alt_text.trim() || null,
          updated_at: new Date().toISOString(),
        };
        if (imagePath) {
          imagePayload.image_path = imagePath;
        }

        // Upsert (insert or update) the service image
        const { error: imageError } = await supabase
          .from('service_images')
          .upsert(imagePayload, {
            onConflict: 'service_slug',
          });

        if (imageError) {
          console.error('Error saving service image:', imageError);
          // Don't fail the whole operation if image save fails
          toast.error('Service saved but image update failed');
        }
      }

      setIsDialogOpen(false);
      setEditingId(null);
      setProcessSteps([]);
      await loadServices();
      await loadServiceImages(); // Refresh images list
    } catch (error: any) {
      console.error('Error saving service:', error);
      toast.error(error?.message || 'Failed to save service');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    if (!confirm('Delete this service? This cannot be undone.')) return;

    try {
      const service = services.find((s) => s.id === id);
      
      if (service?.image_path) {
        await supabase.storage
          .from('service-images')
          .remove([service.image_path]);
      }

      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      if (error) throw error;

      toast.success('Service deleted');
      await loadServices();
    } catch (error: any) {
      console.error('Error deleting service:', error);
      toast.error(error?.message || 'Failed to delete service');
    }
  };

  const togglePublish = async (service: Service) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('services')
        .update({ published: !service.published })
        .eq('id', service.id);
      if (error) throw error;
      toast.success(service.published ? 'Service unpublished' : 'Service published');
      await loadServices();
    } catch (error: any) {
      console.error('Error toggling publish:', error);
      toast.error('Failed to update service');
    }
  };

  // Service Images functions
  const loadServiceImages = async () => {
    if (!supabase) return;
    setIsLoadingImages(true);
    try {
      const { data, error } = await supabase
        .from('service_images')
        .select('*')
        .order('service_title', { ascending: true });

      if (error) throw error;
      setServiceImages(data || []);
    } catch (error: any) {
      console.error('Error loading service images:', error);
      toast.error('Failed to load service images');
    } finally {
      setIsLoadingImages(false);
    }
  };

  const openCreateImage = () => {
    setEditingImageId(null);
    setImageFormData({
      service_slug: '',
      service_title: '',
      image_url: '',
      alt_text: '',
    });
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    setIsImageDialogOpen(true);
  };

  const openEditImage = (image: ServiceImage) => {
    setEditingImageId(image.id);
    setImageFormData({
      service_slug: image.service_slug,
      service_title: image.service_title,
      image_url: image.image_url || '',
      alt_text: image.alt_text || '',
    });
    setSelectedImageFile(null);
    setImagePreviewUrl(image.image_url || null);
    setIsImageDialogOpen(true);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSubmit = async () => {
    if (!supabase) return;

    if (!imageFormData.service_slug.trim() || !imageFormData.service_title.trim()) {
      toast.error('Service slug and title are required');
      return;
    }

    setUploadingImage(true);

    try {
      let imageUrl = imageFormData.image_url;
      let imagePath = null;

      if (selectedImageFile) {
        const fileExt = selectedImageFile.name.split('.').pop()?.toLowerCase() || '';
        const fileName = `service-${imageFormData.service_slug}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('service-images')
          .upload(fileName, selectedImageFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('service-images')
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
        imagePath = fileName;
      }

      const payload: any = {
        service_slug: imageFormData.service_slug.trim(),
        service_title: imageFormData.service_title.trim(),
        alt_text: imageFormData.alt_text.trim() || null,
        updated_at: new Date().toISOString(),
      };

      if (imageUrl) {
        payload.image_url = imageUrl;
      }
      if (imagePath) {
        payload.image_path = imagePath;
      }

      if (editingImageId) {
        const { error } = await supabase
          .from('service_images')
          .update(payload)
          .eq('id', editingImageId);
        if (error) throw error;
        toast.success('Service image updated');
      } else {
        const { error } = await supabase.from('service_images').insert(payload);
        if (error) throw error;
        toast.success('Service image created');
      }

      setIsImageDialogOpen(false);
      setEditingImageId(null);
      await loadServiceImages();
    } catch (error: any) {
      console.error('Error saving service image:', error);
      toast.error(error?.message || 'Failed to save service image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!supabase) return;
    if (!confirm('Delete this service image? This cannot be undone.')) return;

    try {
      const image = serviceImages.find((img) => img.id === id);
      
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
      await loadServiceImages();
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
              <h1 className="text-2xl font-bold">Manage Services</h1>
              <p className="text-sm text-muted-foreground">
                Manage all service details, features, pricing, and images.
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" onClick={loadServices}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={openCreate}>
                <Plus className="w-4 h-4 mr-2" />
                New Service
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <FolderKanban className="w-8 h-8 text-primary" />
                Services Management
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Manage services, images, and content
              </p>
            </div>
            <TabsList>
              <TabsTrigger value="services" className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4" />
                Services
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Images
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="services" className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader className="border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                      <FolderKanban className="w-6 h-6 text-primary" />
                      Services
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {services.length} {services.length === 1 ? 'service' : 'services'} total
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={loadServices}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                    <Button onClick={openCreate}>
                      <Plus className="w-4 h-4 mr-2" />
                      New Service
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground">Loading services...</p>
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <FolderKanban className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No services yet</h3>
                <p className="text-muted-foreground mb-6">Get started by creating your first service.</p>
                <Button onClick={openCreate}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Service
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {services.map((service) => (
                  <Card
                    key={service.id}
                    className="border-border/50 hover:border-primary/50 transition-all duration-200 hover:shadow-md"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold text-sm">
                              {service.display_order}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold flex items-center gap-2">
                                {service.title}
                                {service.published ? (
                                  <Badge variant="default" className="text-xs">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Published
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="text-xs">
                                    Draft
                                  </Badge>
                                )}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                  {service.slug}
                                </code>
                                {service.pricing_text && (
                                  <span className="text-sm font-medium text-primary">
                                    {service.pricing_text}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {service.short_description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {service.short_description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {service.features && service.features.length > 0 && (
                              <span className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                {service.features.length} {service.features.length === 1 ? 'feature' : 'features'}
                              </span>
                            )}
                            {service.benefits && service.benefits.length > 0 && (
                              <span className="flex items-center gap-1">
                                <ArrowRight className="w-3 h-3" />
                                {service.benefits.length} {service.benefits.length === 1 ? 'benefit' : 'benefits'}
                              </span>
                            )}
                            {service.image_url && (
                              <span className="flex items-center gap-1">
                                <ImageIcon className="w-3 h-3" />
                                Has image
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant={service.published ? 'outline' : 'default'}
                            size="sm"
                            onClick={() => togglePublish(service)}
                          >
                            {service.published ? (
                              <>
                                <EyeOff className="w-4 h-4 mr-1" />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4 mr-1" />
                                Publish
                              </>
                            )}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => openEdit(service)}>
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(service.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <ImageIcon className="w-6 h-6 text-primary" />
                    Service Images
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {serviceImages.length} {serviceImages.length === 1 ? 'image' : 'images'} configured
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={loadServiceImages}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                  <Button onClick={openCreateImage}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {isLoadingImages ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                  <p className="text-muted-foreground">Loading images...</p>
                </div>
              ) : serviceImages.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No service images yet</h3>
                  <p className="text-muted-foreground mb-6">Upload images for your services.</p>
                  <Button onClick={openCreateImage}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload First Image
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {serviceImages.map((image) => (
                    <Card key={image.id} className="overflow-hidden hover:border-primary/50 transition-all">
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
                        <div className="space-y-2 mb-3">
                          <h3 className="font-semibold">{image.service_title}</h3>
                          <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                            {image.service_slug}
                          </code>
                          {image.alt_text && (
                            <p className="text-xs text-muted-foreground">{image.alt_text}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => openEditImage(image)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteImage(image.id)}
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
        </TabsContent>
        </Tabs>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            // Reset form when dialog closes
            setProcessSteps([]);
            setEditingId(null);
          }
        }}
      >
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader className="border-b border-border/50 pb-4">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <FolderKanban className="w-6 h-6 text-primary" />
              {editingId ? 'Edit Service' : 'Create New Service'}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {editingId ? 'Update service details and settings' : 'Add a new service to your website'}
            </p>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-1">
            <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <CheckCircle className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slug" className="flex items-center gap-2">
                    Slug <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="websites"
                    disabled={!!editingId}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">URL-friendly identifier (cannot be changed)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                    }
                  />
                  <p className="text-xs text-muted-foreground">Order in which services appear (lower = first)</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Custom Websites"
                  className="text-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="short_description">Short Description</Label>
                  <Textarea
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    rows={2}
                    placeholder="Brief description for service cards"
                    className="resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Full Description <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    placeholder="Full description for service detail page"
                    className="resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Icon */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <ArrowRight className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Pricing & Icon</h3>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pricing_text">Pricing Text</Label>
                  <Input
                    id="pricing_text"
                    value={formData.pricing_text}
                    onChange={(e) => setFormData({ ...formData, pricing_text: e.target.value })}
                    placeholder="From ₹1,99,900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pricing_amount">Pricing Amount</Label>
                  <Input
                    id="pricing_amount"
                    type="number"
                    value={formData.pricing_amount}
                    onChange={(e) => setFormData({ ...formData, pricing_amount: e.target.value })}
                    placeholder="199900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon_name">Icon</Label>
                  <select
                    id="icon_name"
                    value={formData.icon_name}
                    onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {ICON_OPTIONS.map((icon) => (
                      <option key={icon.value} value={icon.value}>
                        {icon.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Features & Benefits */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="features">Features (one per line)</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  rows={5}
                  placeholder="Responsive design for all devices&#10;SEO optimization included&#10;Fast loading speeds"
                  className="resize-none font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Each line becomes a feature bullet point
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits (one per line)</Label>
                <Textarea
                  id="benefits"
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  rows={5}
                  placeholder="Increase brand credibility&#10;Generate more leads"
                  className="resize-none font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Each line becomes a benefit bullet point
                </p>
              </div>
            </div>

            {/* Process Steps */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50 flex-1">
                  <ArrowRight className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Process Steps</h3>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addProcessStep}
                  className="ml-4"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Step
                </Button>
              </div>

              {processSteps.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-border/50 rounded-lg bg-muted/20">
                  <p className="text-sm text-muted-foreground mb-3">No process steps added yet</p>
                  <Button type="button" variant="outline" size="sm" onClick={addProcessStep}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add First Step
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {processSteps.map((step, index) => (
                    <Card key={index} className="border-border/50 bg-card/30">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold text-sm shrink-0">
                            {step.step}
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="space-y-2">
                              <Label htmlFor={`step-title-${index}`}>Step Title</Label>
                              <Input
                                id={`step-title-${index}`}
                                value={step.title}
                                onChange={(e) =>
                                  updateProcessStep(index, 'title', e.target.value)
                                }
                                placeholder="Discovery"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`step-desc-${index}`}>Description</Label>
                              <Textarea
                                id={`step-desc-${index}`}
                                value={step.description}
                                onChange={(e) =>
                                  updateProcessStep(index, 'description', e.target.value)
                                }
                                placeholder="We learn about your business, goals, and target audience."
                                rows={2}
                                className="resize-none"
                              />
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                            onClick={() => removeProcessStep(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <ImageIcon className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Service Image</h3>
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
                  Recommended: 1200x800px or similar aspect ratio
                </p>
              </div>

              {previewUrl && (
                <div className="space-y-2">
                  <Label>Image Preview</Label>
                  <div className="aspect-video border-2 border-border rounded-lg overflow-hidden bg-muted/50">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="alt_text">Image Alt Text</Label>
                <Input
                  id="alt_text"
                  value={formData.alt_text}
                  onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                  placeholder="Description for accessibility"
                />
              </div>
            </div>

            {/* Publishing */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <Eye className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Visibility</h3>
              </div>
              
              <div className="flex items-center space-x-3 p-4 rounded-lg border border-border/50 bg-muted/30">
                <Checkbox
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, published: checked as boolean })
                  }
                />
                <div className="flex-1">
                  <Label htmlFor="published" className="cursor-pointer font-medium">
                    Published (visible on website)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Unpublished services are only visible to admins
                  </p>
                </div>
              </div>
            </div>
            </div>
          </div>
          
          <div className="border-t border-border/50 pt-4 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={uploading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={uploading} size="lg">
              {uploading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? 'Update Service' : 'Create Service'}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Service Images Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-primary" />
              {editingImageId ? 'Edit Service Image' : 'Upload Service Image'}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {editingImageId ? 'Update service image' : 'Add an image for a service'}
            </p>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="image_service_slug">Service Slug *</Label>
                <select
                  id="image_service_slug"
                  value={imageFormData.service_slug}
                  onChange={(e) => {
                    const selected = SERVICE_SLUGS.find((s) => s.slug === e.target.value);
                    setImageFormData({
                      ...imageFormData,
                      service_slug: e.target.value,
                      service_title: selected?.title || imageFormData.service_title,
                    });
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                <Label htmlFor="image_service_title">Service Title *</Label>
                <Input
                  id="image_service_title"
                  value={imageFormData.service_title}
                  onChange={(e) =>
                    setImageFormData({ ...imageFormData, service_title: e.target.value })
                  }
                  placeholder="Custom Websites"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_file">Upload Image</Label>
              <Input
                id="image_file"
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
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
                value={imageFormData.image_url}
                onChange={(e) =>
                  setImageFormData({ ...imageFormData, image_url: e.target.value })
                }
                placeholder="https://..."
                disabled={!!selectedImageFile}
              />
              <p className="text-xs text-muted-foreground">
                Enter a direct image URL (disabled when file is selected)
              </p>
            </div>

            {imagePreviewUrl && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="aspect-video border-2 border-border rounded-lg overflow-hidden bg-muted/50">
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="image_alt_text">Alt Text</Label>
              <Input
                id="image_alt_text"
                value={imageFormData.alt_text}
                onChange={(e) =>
                  setImageFormData({ ...imageFormData, alt_text: e.target.value })
                }
                placeholder="Description for accessibility"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsImageDialogOpen(false)}
                disabled={uploadingImage}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleImageSubmit} disabled={uploadingImage}>
                {uploadingImage ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {editingImageId ? 'Update' : 'Upload'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

