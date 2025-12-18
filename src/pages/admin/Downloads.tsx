import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Plus, Trash2, Edit, Upload, Download, RefreshCw, FileText, Image, FileArchive, File } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type DownloadItem = Tables<"downloads">;

const getIconForType = (fileType: string | null) => {
  if (!fileType) return File;
  if (['pdf'].includes(fileType)) return FileText;
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileType)) return Image;
  if (['zip', 'rar', '7z'].includes(fileType)) return FileArchive;
  return File;
};

const formatFileSize = (bytes: number | null) => {
  if (!bytes) return 'N/A';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function AdminDownloads() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DownloadItem | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "General",
    requires_auth: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadDownloads();
  }, []);

  const loadDownloads = async () => {
    if (!supabase) return;
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('downloads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDownloads(data || []);
    } catch (error) {
      console.error('Error loading downloads:', error);
      toast.error('Failed to load downloads');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!supabase) return;
    
    if (!editingItem && !selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setUploading(true);

    try {
      let filePath = editingItem?.file_path || '';
      let fileSize = editingItem?.file_size || 0;
      let fileType = editingItem?.file_type || '';

      // Upload new file if selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop()?.toLowerCase() || '';
        const fileName = `${Date.now()}_${selectedFile.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('downloads')
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;

        filePath = fileName;
        fileSize = selectedFile.size;
        fileType = fileExt;
      }

      if (editingItem) {
        // Update existing
        const { error } = await supabase
          .from('downloads')
          .update({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            requires_auth: formData.requires_auth,
            file_path: filePath,
            file_size: fileSize,
            file_type: fileType,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingItem.id);

        if (error) throw error;
        toast.success('Download updated successfully');
      } else {
        // Create new
        const { error } = await supabase
          .from('downloads')
          .insert({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            requires_auth: formData.requires_auth,
            file_path: filePath,
            file_size: fileSize,
            file_type: fileType
          });

        if (error) throw error;
        toast.success('Download created successfully');
      }

      resetForm();
      loadDownloads();
    } catch (error) {
      console.error('Error saving download:', error);
      toast.error('Failed to save download');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: DownloadItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      category: item.category || "General",
      requires_auth: item.requires_auth || false
    });
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (item: DownloadItem) => {
    if (!supabase) return;
    if (!confirm('Are you sure you want to delete this download?')) return;

    try {
      // Delete file from storage
      const { error: storageError } = await supabase.storage
        .from('downloads')
        .remove([item.file_path]);

      if (storageError) console.warn('Storage delete warning:', storageError);

      // Delete record
      const { error } = await supabase
        .from('downloads')
        .delete()
        .eq('id', item.id);

      if (error) throw error;
      toast.success('Download deleted successfully');
      loadDownloads();
    } catch (error) {
      console.error('Error deleting download:', error);
      toast.error('Failed to delete download');
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "General",
      requires_auth: false
    });
    setSelectedFile(null);
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const categories = ["General", "Brochures", "Templates", "Documentation", "Resources"];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Downloads Management</h1>
                <p className="text-muted-foreground">Upload and manage downloadable files</p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsDialogOpen(open); }}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Download
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingItem ? 'Edit Download' : 'Add New Download'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Company Brochure 2024"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of the file"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file">{editingItem ? 'Replace File (optional)' : 'File *'}</Label>
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    {selectedFile && (
                      <p className="text-sm text-muted-foreground">
                        Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                      </p>
                    )}
                    {editingItem && !selectedFile && (
                      <p className="text-sm text-muted-foreground">
                        Current: {editingItem.file_path}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="requires_auth"
                      checked={formData.requires_auth}
                      onChange={(e) => setFormData({ ...formData, requires_auth: e.target.checked })}
                      className="rounded border-input"
                    />
                    <Label htmlFor="requires_auth" className="text-sm font-normal">
                      Requires login to download
                    </Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={resetForm}>Cancel</Button>
                  <Button onClick={handleSubmit} disabled={uploading}>
                    {uploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        {editingItem ? 'Updating...' : 'Uploading...'}
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        {editingItem ? 'Update' : 'Upload'}
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                All Downloads ({downloads.length})
              </CardTitle>
              <Button variant="outline" size="sm" onClick={loadDownloads} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : downloads.length === 0 ? (
              <div className="text-center py-8">
                <Download className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No downloads yet</p>
                <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Download
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Downloads</TableHead>
                      <TableHead>Access</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {downloads.map((item) => {
                      const Icon = getIconForType(item.file_type);
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Icon className="w-5 h-5 text-muted-foreground" />
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.title}</p>
                              {item.description && (
                                <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.category || 'General'}</Badge>
                          </TableCell>
                          <TableCell>{formatFileSize(item.file_size)}</TableCell>
                          <TableCell>{item.download_count || 0}</TableCell>
                          <TableCell>
                            <Badge variant={item.requires_auth ? "secondary" : "outline"}>
                              {item.requires_auth ? 'Auth Required' : 'Public'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(item)} className="text-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
