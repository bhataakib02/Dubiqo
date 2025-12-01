import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = ["All", "Websites", "Web Apps", "Dashboards", "E-Commerce"];

const projects = [
  {
    id: "1",
    title: "FinTech Dashboard",
    category: "Dashboards",
    description: "Real-time financial analytics platform with advanced charting and reporting.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    technologies: ["React", "TypeScript", "D3.js", "Node.js"],
    link: "#",
  },
  {
    id: "2",
    title: "E-Commerce Platform",
    category: "E-Commerce",
    description: "Multi-vendor marketplace with integrated payments and inventory management.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    technologies: ["Next.js", "Stripe", "PostgreSQL", "Tailwind"],
    link: "#",
  },
  {
    id: "3",
    title: "SaaS Analytics Tool",
    category: "Web Apps",
    description: "User behavior analytics platform with AI-powered insights.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    technologies: ["React", "Python", "TensorFlow", "AWS"],
    link: "#",
  },
  {
    id: "4",
    title: "Healthcare Portal",
    category: "Web Apps",
    description: "Patient management system with telemedicine capabilities.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
    technologies: ["React", "Node.js", "MongoDB", "WebRTC"],
    link: "#",
  },
  {
    id: "5",
    title: "Corporate Website",
    category: "Websites",
    description: "Modern corporate website with CMS and lead generation features.",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop",
    technologies: ["Next.js", "Sanity CMS", "Tailwind"],
    link: "#",
  },
  {
    id: "6",
    title: "Inventory Dashboard",
    category: "Dashboards",
    description: "Real-time inventory tracking with predictive analytics.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop",
    technologies: ["React", "GraphQL", "PostgreSQL"],
    link: "#",
  },
  {
    id: "7",
    title: "Fashion E-Shop",
    category: "E-Commerce",
    description: "Luxury fashion brand online store with AR try-on features.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
    technologies: ["Next.js", "Shopify", "Three.js"],
    link: "#",
  },
  {
    id: "8",
    title: "Restaurant Website",
    category: "Websites",
    description: "Restaurant website with online ordering and reservation system.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
    technologies: ["React", "Firebase", "Stripe"],
    link: "#",
  },
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Our <span className="gradient-text">Portfolio</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore our latest projects and see how we've helped businesses
              transform their digital presence.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <Section>
        <div className="container mx-auto px-4">
          {/* Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={cn(
                  activeCategory === category && "glow-primary"
                )}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="overflow-hidden group bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all duration-300"
              >
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                    <Button size="sm" variant="secondary" asChild>
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        View Project <ExternalLink className="ml-2 w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{project.category}</Badge>
                  </div>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Want to see your project here?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Let's create something amazing together. Start with a free quote today.
          </p>
          <Button size="lg" className="glow-primary" asChild>
            <Link to="/quote">Get Your Free Quote</Link>
          </Button>
        </div>
      </Section>
    </Layout>
  );
}
