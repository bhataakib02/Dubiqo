import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Filter } from "lucide-react";

const Portfolio = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const projects = [
    {
      title: "E-Commerce Fashion Store",
      type: "Website",
      category: "E-commerce",
      description: "Modern online fashion store with 200+ products, shopping cart, wishlist, and integrated payment system",
      tech: ["React", "Stripe", "Tailwind CSS", "Node.js"],
    },
    {
      title: "SaaS Analytics Dashboard",
      type: "Dashboard",
      category: "Dashboard",
      description: "Real-time analytics platform with interactive charts, user management, and comprehensive reporting",
      tech: ["React", "D3.js", "PostgreSQL", "Express"],
    },
    {
      title: "Developer Portfolio - Arjun",
      type: "Portfolio",
      category: "Portfolio",
      description: "Clean, minimal portfolio showcasing 15+ projects with live demos, GitHub integration, and blog",
      tech: ["Next.js", "Framer Motion", "MDX"],
    },
    {
      title: "Restaurant Management System",
      type: "Dashboard",
      category: "Dashboard",
      description: "Complete restaurant management with order tracking, table management, and kitchen display system",
      tech: ["React", "Firebase", "Tailwind CSS"],
    },
    {
      title: "Freelance Billing Platform",
      type: "Billing System",
      category: "Billing",
      description: "Invoice generation, payment tracking, client management, and automated payment reminders",
      tech: ["React", "Razorpay", "MongoDB", "Node.js"],
    },
    {
      title: "Designer Portfolio - Priya",
      type: "Portfolio",
      category: "Portfolio",
      description: "Visual showcase of creative work with detailed case studies, client testimonials, and contact form",
      tech: ["React", "Framer Motion", "Tailwind CSS"],
    },
    {
      title: "Real Estate Listings Website",
      type: "Website",
      category: "Website",
      description: "Property listing platform with advanced search, filters, interactive maps, and inquiry forms",
      tech: ["Next.js", "Google Maps API", "Tailwind CSS"],
    },
    {
      title: "Fitness Coaching Platform",
      type: "Website",
      category: "Website",
      description: "Multi-page site for fitness coach with class schedules, trainer profiles, and booking system",
      tech: ["React", "Calendly API", "Stripe"],
    },
    {
      title: "Startup Landing Page",
      type: "Website",
      category: "Website",
      description: "High-converting landing page for SaaS startup with animations, testimonials, and lead capture",
      tech: ["React", "Framer Motion", "Tailwind CSS"],
    },
    {
      title: "Agency Expense Tracker",
      type: "Dashboard",
      category: "Dashboard",
      description: "Financial dashboard for tracking expenses, generating reports, and managing budgets",
      tech: ["React", "Chart.js", "PostgreSQL"],
    },
    {
      title: "Photography Portfolio - Ravi",
      type: "Portfolio",
      category: "Portfolio",
      description: "Stunning image galleries with lightbox, filtering by category, and client booking system",
      tech: ["Next.js", "Cloudinary", "Tailwind CSS"],
    },
    {
      title: "Subscription Billing Dashboard",
      type: "Billing System",
      category: "Billing",
      description: "Recurring billing management with subscription plans, payment history, and customer portal",
      tech: ["React", "Stripe", "Node.js", "MongoDB"],
    },
  ];

  const filters = ["All", "Website", "Portfolio", "Dashboard", "Billing"];

  const filteredProjects = useMemo(() => {
    if (selectedFilter === "All") return projects;
    return projects.filter(project => project.category === selectedFilter);
  }, [selectedFilter]);

  const projectCount = useMemo(() => {
    return filters.reduce((acc, filter) => {
      acc[filter] = filter === "All" 
        ? projects.length 
        : projects.filter(p => p.category === filter).length;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Our Work
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
            A showcase of websites, dashboards, portfolios, and billing systems we've built for clients across industries
          </p>
          <Button asChild size="lg" className="gradient-primary">
            <Link to="/quote">Start Your Project</Link>
          </Button>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-card/30 border-b border-border/40 sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-foreground/60 mr-2" />
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                className={selectedFilter === filter ? "gradient-primary" : "border-border/40"}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
              >
                {filter}
                <span className="ml-1 text-xs opacity-70">({projectCount[filter]})</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-6 text-center">
            <p className="text-foreground/60">
              Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
              {selectedFilter !== "All" && ` in ${selectedFilter}`}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <Card
                key={index}
                className="glass border-border/40 hover:border-primary/50 transition-all duration-300 group overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Project Image Placeholder */}
                <div className="h-48 bg-gradient-primary relative overflow-hidden">
                  <div className="absolute inset-0 bg-background/20 group-hover:bg-background/0 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ExternalLink className="h-12 w-12 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
                      {project.category}
                    </span>
                    <span className="text-xs text-foreground/60">{project.type}</span>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="pt-2">{project.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded bg-muted text-foreground/70"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <Button
                    asChild
                    variant="link"
                    className="p-0 text-primary mt-4"
                  >
                    <Link to="/case-studies">
                      View Case Study →
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <Card className="glass border-primary glow">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Want Your Project Featured Here?
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto mb-8">
                Let's create something amazing together. Start your project today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gradient-primary">
                  <Link to="/quote">Get a Quote</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary/50">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
