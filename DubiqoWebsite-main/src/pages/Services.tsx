import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Briefcase, CreditCard, BarChart3, Wrench, Shield, ArrowRight } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Globe,
      title: "Website Development",
      description: "Professional, responsive websites for businesses, startups, and personal brands",
      features: [
        "Business websites",
        "Landing pages",
        "Multi-page sites",
        "E-commerce ready",
        "SEO optimized",
        "Mobile responsive",
      ],
      link: "/services/websites",
    },
    {
      icon: Briefcase,
      title: "Portfolio Websites",
      description: "Stand out with a stunning portfolio that showcases your work professionally",
      features: [
        "Developer portfolios",
        "Designer showcases",
        "Project galleries",
        "Resume integration",
        "Contact forms",
        "Fast loading",
      ],
      link: "/services/portfolios",
    },
    {
      icon: CreditCard,
      title: "Billing & Payment Systems",
      description: "Complete invoicing and payment management solutions for your business",
      features: [
        "Invoice generation",
        "Payment tracking",
        "Client management",
        "Payment links",
        "Razorpay/Stripe integration",
        "Automated reminders",
      ],
      link: "/services/billing-systems",
    },
    {
      icon: BarChart3,
      title: "Dashboards & Admin Panels",
      description: "Powerful analytics dashboards and admin interfaces for data-driven decisions",
      features: [
        "Analytics dashboards",
        "Admin panels",
        "Real-time data",
        "Charts & graphs",
        "User management",
        "Custom reports",
      ],
      link: "/services/dashboards",
    },
    {
      icon: Wrench,
      title: "Bug Fixing & Troubleshooting",
      description: "Fast fixes for broken websites, performance issues, and technical problems",
      features: [
        "Error debugging",
        "Performance optimization",
        "Layout fixes",
        "Form issues",
        "Hosting problems",
        "Emergency support",
      ],
      link: "/services/troubleshooting",
    },
    {
      icon: Shield,
      title: "Ongoing Maintenance",
      description: "Keep your website running smoothly with regular updates and monitoring",
      features: [
        "Regular updates",
        "Security monitoring",
        "Performance checks",
        "Content updates",
        "Backup management",
        "Technical support",
      ],
      link: "/services/maintenance",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Complete Digital Solutions
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
            From building new websites to fixing broken ones, we provide everything you need to succeed online
          </p>
          <Button asChild size="lg" className="gradient-primary">
            <Link to="/quote">Get Started Today</Link>
          </Button>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="glass border-border/40 hover:border-primary/50 transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="h-7 w-7 text-primary-foreground" />
                      </div>
                      <Button asChild variant="ghost" className="text-primary">
                        <Link to={service.link}>
                          Learn More <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-base pt-2">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-foreground/70">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Dubiqo?</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              We don't just build websites—we solve problems and create value
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="glass border-border/40 text-center">
              <CardHeader>
                <CardTitle>Fast Delivery</CardTitle>
                <CardDescription className="pt-2">
                  Most projects delivered within 1-3 weeks. Emergency fixes often same-day.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="glass border-border/40 text-center">
              <CardHeader>
                <CardTitle>Problem Solvers</CardTitle>
                <CardDescription className="pt-2">
                  We specialize in fixing broken sites and solving complex technical challenges.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="glass border-border/40 text-center">
              <CardHeader>
                <CardTitle>Full Ownership</CardTitle>
                <CardDescription className="pt-2">
                  You own all code, designs, and content. Complete documentation included.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="glass border-primary glow">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto mb-8">
                Tell us about your project and we'll provide a detailed quote within 24 hours
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

export default Services;
