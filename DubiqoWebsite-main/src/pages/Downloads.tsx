import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Download,
  BookOpen,
  Presentation,
  FileSpreadsheet,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Downloads = () => {
  const { toast } = useToast();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const resources = [
    {
      id: 1,
      icon: FileText,
      title: "Company Brochure",
      description: "Learn about Dubiqo's services, process, and what makes us different. A comprehensive overview for potential clients.",
      fileType: "PDF",
      fileSize: "2.4 MB",
      category: "Company",
    },
    {
      id: 2,
      icon: FileSpreadsheet,
      title: "Pricing Sheet 2025",
      description: "Detailed breakdown of our pricing plans, add-ons, and what's included in each package.",
      fileType: "PDF",
      fileSize: "856 KB",
      category: "Pricing",
    },
    {
      id: 3,
      icon: Presentation,
      title: "Portfolio Showcase",
      description: "A visual showcase of our best work including websites, dashboards, and billing systems.",
      fileType: "PDF",
      fileSize: "8.2 MB",
      category: "Portfolio",
    },
    {
      id: 4,
      icon: BookOpen,
      title: "Website Checklist",
      description: "A helpful checklist of everything you need to prepare before starting your website project with us.",
      fileType: "PDF",
      fileSize: "324 KB",
      category: "Resources",
    },
    {
      id: 5,
      icon: FileText,
      title: "Project Requirements Template",
      description: "A template to help you document your project requirements, features, and preferences.",
      fileType: "DOCX",
      fileSize: "128 KB",
      category: "Resources",
    },
    {
      id: 6,
      icon: BookOpen,
      title: "Web Development Guide",
      description: "A beginner-friendly guide explaining web development terms, processes, and what to expect.",
      fileType: "PDF",
      fileSize: "1.2 MB",
      category: "Resources",
    },
  ];

  const categories = ["All", "Company", "Pricing", "Portfolio", "Resources"];

  const filteredResources = selectedCategory === "All" 
    ? resources 
    : resources.filter(r => r.category === selectedCategory);

  const handleDownload = async (resource: typeof resources[0]) => {
    setDownloadingId(resource.id);

    // Simulate download
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Download Started! ✓",
      description: `${resource.title} is downloading. Check your downloads folder.`,
    });

    setDownloadingId(null);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4 text-center">
          <Download className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Downloads & Resources
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Download our brochures, pricing sheets, and helpful resources to learn more about what we do.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-card/30 border-b border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={selectedCategory === category ? "gradient-primary" : "border-border/40"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
                <span className="ml-1 text-xs opacity-70">
                  ({category === "All" ? resources.length : resources.filter(r => r.category === category).length})
                </span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Downloads Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredResources.map((resource) => {
              const Icon = resource.icon;
              const isDownloading = downloadingId === resource.id;
              return (
                <Card
                  key={resource.id}
                  className="glass border-border/40 hover:border-primary/50 transition-all duration-300 group"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {resource.category}
                      </span>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {resource.title}
                    </CardTitle>
                    <CardDescription className="pt-2">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-foreground/60">
                        <span className="font-medium text-primary">{resource.fileType}</span>
                        <span className="mx-2">•</span>
                        <span>{resource.fileSize}</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="gradient-primary"
                        onClick={() => handleDownload(resource)}
                        disabled={isDownloading}
                      >
                        {isDownloading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Need More Information?</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Explore our other resources or get in touch with us directly
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="glass border-border/40 hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <CardTitle>Read Our Blog</CardTitle>
                <CardDescription className="pt-2">
                  Tips, guides, and insights about web development and digital solutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="p-0 text-primary">
                  <Link to="/blog">
                    Visit Blog <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="glass border-border/40 hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <CardTitle>FAQ Section</CardTitle>
                <CardDescription className="pt-2">
                  Find answers to commonly asked questions about our services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="p-0 text-primary">
                  <Link to="/faq">
                    Read FAQs <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="glass border-border/40 hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription className="pt-2">
                  Have specific questions? Our team is happy to help
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="p-0 text-primary">
                  <Link to="/contact">
                    Contact Us <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="glass border-primary glow max-w-3xl mx-auto">
            <CardContent className="p-8 md:p-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Your Project?
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto mb-8">
                Now that you know what we do, let's discuss how we can help you achieve your goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gradient-primary">
                  <Link to="/quote">Get a Quote</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary/50">
                  <Link to="/booking">Book a Call</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Downloads;
