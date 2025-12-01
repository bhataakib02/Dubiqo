import { Layout } from "@/components/layout/Layout";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Image, Video, Archive } from "lucide-react";

const downloads = [
  {
    id: "1",
    title: "Brand Guidelines",
    description: "Complete brand guidelines including logo usage, colors, and typography.",
    category: "Branding",
    format: "PDF",
    size: "4.2 MB",
    icon: FileText,
  },
  {
    id: "2",
    title: "Logo Pack",
    description: "All logo variations in multiple formats (PNG, SVG, EPS).",
    category: "Branding",
    format: "ZIP",
    size: "12.8 MB",
    icon: Archive,
  },
  {
    id: "3",
    title: "Company Brochure",
    description: "Overview of our services, process, and case studies.",
    category: "Marketing",
    format: "PDF",
    size: "8.5 MB",
    icon: FileText,
  },
  {
    id: "4",
    title: "Service Catalog",
    description: "Detailed breakdown of all services with pricing.",
    category: "Marketing",
    format: "PDF",
    size: "3.1 MB",
    icon: FileText,
  },
  {
    id: "5",
    title: "Case Study: FinTech Dashboard",
    description: "In-depth look at our FinTech dashboard project.",
    category: "Case Studies",
    format: "PDF",
    size: "5.7 MB",
    icon: FileText,
  },
  {
    id: "6",
    title: "Press Kit",
    description: "Media resources including photos, bios, and fact sheets.",
    category: "Media",
    format: "ZIP",
    size: "25.3 MB",
    icon: Archive,
  },
];

const getIconColor = (format: string) => {
  switch (format) {
    case "PDF":
      return "text-destructive";
    case "ZIP":
      return "text-warning";
    default:
      return "text-primary";
  }
};

export default function Downloads() {
  const handleDownload = (id: string, title: string) => {
    // In a real app, this would trigger the actual download
    console.log(`Downloading: ${title}`);
  };

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloads.map((item) => (
              <Card
                key={item.id}
                className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center ${getIconColor(item.format)}`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline">{item.category}</Badge>
                  </div>
                  <CardTitle className="text-xl mt-4">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{item.format}</span>
                    <span>{item.size}</span>
                  </div>
                  
                  <Button
                    className="w-full"
                    onClick={() => handleDownload(item.id, item.title)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
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
