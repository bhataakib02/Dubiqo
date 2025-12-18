import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Download, FileText, Archive, Image, Loader2, AlertCircle } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type DownloadItem = Tables<"downloads">;

const getIconForType = (fileType: string | null) => {
  switch (fileType?.toLowerCase()) {
    case "pdf":
      return FileText;
    case "zip":
    case "rar":
      return Archive;
    case "png":
    case "jpg":
    case "jpeg":
    case "svg":
      return Image;
    default:
      return FileText;
  }
};

const getIconColor = (fileType: string | null) => {
  switch (fileType?.toLowerCase()) {
    case "pdf":
      return "text-destructive";
    case "zip":
    case "rar":
      return "text-warning";
    default:
      return "text-primary";
  }
};

const formatFileSize = (bytes: number | null) => {
  if (!bytes) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function Downloads() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    loadDownloads();
  }, []);

  const loadDownloads = async () => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('downloads')
        .select('*')
        .order('category', { ascending: true })
        .order('title', { ascending: true });

      if (error) throw error;
      setDownloads(data || []);
    } catch (error) {
      console.error('Error loading downloads:', error);
      toast.error('Failed to load downloads');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (item: DownloadItem) => {
    if (!supabase) return;
    
    setDownloadingId(item.id);
    
    try {
      // Get the file URL from storage
      const { data: urlData, error: urlError } = await supabase
        .storage
        .from('downloads')
        .createSignedUrl(item.file_path, 60); // 60 seconds expiry

      if (urlError) {
        // If file doesn't exist in storage, check if it's an external URL
        if (item.file_path.startsWith('http')) {
          window.open(item.file_path, '_blank');
        } else {
          throw urlError;
        }
      } else if (urlData?.signedUrl) {
        // Trigger download
        const link = document.createElement('a');
        link.href = urlData.signedUrl;
        link.download = item.title;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Update download count
      const { error: updateError } = await supabase
        .from('downloads')
        .update({ download_count: (item.download_count || 0) + 1 })
        .eq('id', item.id);

      if (!updateError) {
        // Update local state
        setDownloads(prev => 
          prev.map(d => 
            d.id === item.id 
              ? { ...d, download_count: (d.download_count || 0) + 1 }
              : d
          )
        );
      }

      toast.success(`Downloading ${item.title}`);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file. Please try again later.');
    } finally {
      setDownloadingId(null);
    }
  };

  // Group downloads by category
  const groupedDownloads = downloads.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, DownloadItem[]>);

  if (isLoading) {
    return (
      <Layout>
        <section className="pt-32 pb-16 min-h-screen">
          <div className="container mx-auto px-4 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="gradient-text">Downloads</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Access our brochures, brand assets, case studies, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Downloads Grid */}
      <Section>
        <div className="container mx-auto px-4">
          {downloads.length === 0 ? (
            <Card className="bg-card/50 backdrop-blur border-border/50 max-w-lg mx-auto">
              <CardContent className="p-8 text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No downloads available at the moment.</p>
                <p className="text-sm text-muted-foreground mt-2">Check back later or contact us for specific materials.</p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(groupedDownloads).map(([category, items]) => (
              <div key={category} className="mb-12 last:mb-0">
                <h2 className="text-2xl font-bold mb-6">{category}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item) => {
                    const Icon = getIconForType(item.file_type);
                    const isDownloading = downloadingId === item.id;
                    
                    return (
                      <Card
                        key={item.id}
                        className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all group"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className={`w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center ${getIconColor(item.file_type)}`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <Badge variant="outline">{item.category}</Badge>
                          </div>
                          <CardTitle className="text-xl mt-4">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-muted-foreground text-sm">{item.description}</p>
                          
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{item.file_type?.toUpperCase() || 'File'}</span>
                            <span>{formatFileSize(item.file_size)}</span>
                          </div>
                          
                          {item.download_count !== null && item.download_count > 0 && (
                            <p className="text-xs text-muted-foreground">
                              {item.download_count} downloads
                            </p>
                          )}
                          
                          <Button
                            className="w-full"
                            onClick={() => handleDownload(item)}
                            disabled={isDownloading}
                          >
                            {isDownloading ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Downloading...
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </Section>

      {/* Request Custom */}
      <Section variant="muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Need something specific?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            If you need custom assets or specific documents, let us know and
            we'll prepare them for you.
          </p>
          <Button size="lg" asChild>
            <a href="/contact">Request Materials</a>
          </Button>
        </div>
      </Section>
    </Layout>
  );
}