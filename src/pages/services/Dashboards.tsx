import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, BarChart3, Users, Settings, Lock, Zap, CheckCircle2, Database } from "lucide-react";

const Dashboards = () => {
  const features = [
    { icon: BarChart3, title: "Data Visualization", description: "Charts, graphs, and metrics" },
    { icon: Users, title: "User Management", description: "Roles and permissions" },
    { icon: Database, title: "Real-time Data", description: "Live updates and sync" },
    { icon: Lock, title: "Secure Access", description: "Authentication & authorization" },
  ];

  const dashboardTypes = [
    {
      title: "Admin Panels",
      description: "Manage your website, users, and content from one central dashboard",
      includes: [
        "User management (create, edit, delete)",
        "Content management system",
        "Settings and configuration",
        "Activity logs and history",
      ],
    },
    {
      title: "Analytics Dashboards",
      description: "Visualize your business data with charts and real-time metrics",
      includes: [
        "Custom KPI widgets",
        "Interactive charts and graphs",
        "Date range filtering",
        "Export to PDF/Excel",
      ],
    },
    {
      title: "Internal Tools",
      description: "Custom tools for your team's specific workflow needs",
      includes: [
        "Task and project management",
        "Inventory tracking",
        "Team collaboration features",
        "Custom workflows and automation",
      ],
    },
  ];

  const capabilities = [
    "Beautiful, intuitive user interface",
    "Mobile-responsive design",
    "Real-time data updates",
    "Advanced filtering and search",
    "Role-based access control",
    "Data export functionality",
    "Custom notifications and alerts",
    "Third-party API integrations",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4">
              <LayoutDashboard className="h-16 w-16 text-primary mx-auto mb-4" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Dashboards & Admin Panels
            </h1>
            <p className="text-xl text-foreground/70 mb-8">
              Custom dashboards that put your data at your fingertips. From admin panels to analytics dashboards, we build internal tools that make your team more efficient.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gradient-primary">
                <Link to="/quote">Start Your Project</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/50">
                <Link to="/analytics-demo">View Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Every dashboard we build is packed with essential functionality
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="glass border-border/40 text-center">
                  <CardHeader>
                    <div className="mx-auto h-14 w-14 rounded-xl gradient-primary flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dashboard Types */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Types of Dashboards We Build</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              From simple admin panels to complex analytics platforms
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {dashboardTypes.map((type, index) => (
              <Card key={index} className="glass border-border/40 hover:border-primary/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">{type.title}</CardTitle>
                  <CardDescription className="pt-2">{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {type.includes.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground/70">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Built For Performance</h2>
              <p className="text-foreground/70">
                Every dashboard includes these capabilities
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {capabilities.map((capability, index) => (
                <div key={index} className="flex items-start gap-3 p-4 glass rounded-xl border-border/40">
                  <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{capability}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Modern Technology Stack</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              We use cutting-edge technologies for fast, scalable dashboards
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="glass border-border/40">
                <CardHeader>
                  <CardTitle className="text-xl">Frontend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {["React", "TypeScript", "Tailwind CSS", "Chart.js", "Recharts", "Shadcn/ui"].map(
                      (tech, index) => (
                        <div key={index} className="px-4 py-2 glass rounded-lg border-border/40 text-sm">
                          {tech}
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass border-border/40">
                <CardHeader>
                  <CardTitle className="text-xl">Backend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {["Node.js", "PostgreSQL", "MongoDB", "Redis", "REST APIs", "WebSocket"].map(
                      (tech, index) => (
                        <div key={index} className="px-4 py-2 glass rounded-lg border-border/40 text-sm">
                          {tech}
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Who Needs Dashboards?</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="glass border-border/40 text-center">
              <CardHeader>
                <Settings className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Startups</CardTitle>
                <CardDescription className="pt-2">
                  Internal tools to manage operations without expensive software subscriptions
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="glass border-border/40 text-center">
              <CardHeader>
                <Settings className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">SaaS Companies</CardTitle>
                <CardDescription className="pt-2">
                  Admin panels to manage users, subscriptions, and platform settings
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="glass border-border/40 text-center">
              <CardHeader>
                <Settings className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">E-commerce</CardTitle>
                <CardDescription className="pt-2">
                  Order management, inventory tracking, and sales analytics
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="glass border-border/40 text-center">
              <CardHeader>
                <Settings className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Agencies</CardTitle>
                <CardDescription className="pt-2">
                  Client portals, project tracking, and team collaboration tools
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Flexible Pricing</h2>
              <p className="text-foreground/70">
                Pricing depends on complexity and features required
              </p>
            </div>
            
            <Card className="glass border-border/40">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-border/40">
                    <span className="font-medium">Basic Admin Panel</span>
                    <span className="text-xl font-bold text-gradient">From ₹19,999</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-border/40">
                    <span className="font-medium">Analytics Dashboard</span>
                    <span className="text-xl font-bold text-gradient">From ₹29,999</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Complex Multi-User System</span>
                    <span className="text-xl font-bold text-gradient">Custom Quote</span>
                  </div>
                </div>
                <p className="text-sm text-foreground/60 mt-6 text-center">
                  All packages include design, development, testing, and 60 days support
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Build Your Dashboard?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Let's create a powerful dashboard that transforms how you work with data
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/quote">Get a Quote</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/contact">Discuss Your Needs</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboards;
