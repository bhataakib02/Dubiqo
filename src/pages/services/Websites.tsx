import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Zap, Smartphone, Search, Lock, TrendingUp, CheckCircle2 } from "lucide-react";

const Websites = () => {
  const features = [
    { icon: Smartphone, title: "Mobile Responsive", description: "Perfect on all devices" },
    { icon: Zap, title: "Lightning Fast", description: "Optimized performance" },
    { icon: Search, title: "SEO Ready", description: "Built for search engines" },
    { icon: Lock, title: "Secure & Safe", description: "SSL and security best practices" },
  ];

  const types = [
    {
      title: "Business Websites",
      description: "Professional sites for established businesses and brands",
      includes: ["5-10 pages", "Contact forms", "Google Maps integration", "Social media links"],
    },
    {
      title: "Landing Pages",
      description: "High-converting single pages for campaigns and products",
      includes: ["Single focused page", "CTA optimization", "Fast loading", "Lead capture forms"],
    },
    {
      title: "Multi-Page Sites",
      description: "Complex websites with multiple sections and features",
      includes: ["10+ pages", "Blog integration", "Newsletter signup", "Custom functionality"],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4">
              <Globe className="h-16 w-16 text-primary mx-auto mb-4" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Website Development
            </h1>
            <p className="text-xl text-foreground/70 mb-8">
              Modern, responsive websites that convert visitors into customers. Built with the latest technologies for performance and reliability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gradient-primary">
                <Link to="/quote">Get a Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/50">
                <Link to="/portfolio">View Examples</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Every website we build comes with these essential features
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

      {/* Types of Websites */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Types of Websites We Build</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              From simple landing pages to complex business sites
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {types.map((type, index) => (
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

      {/* Technologies */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built with Modern Tech</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              We use industry-standard technologies for reliability and performance
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            {["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "MongoDB", "PostgreSQL", "AWS"].map(
              (tech, index) => (
                <div
                  key={index}
                  className="px-6 py-3 glass rounded-xl border-border/40 font-medium hover:border-primary/50 transition-all duration-300"
                >
                  {tech}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Process & Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Development Process</h2>
              <p className="text-foreground/70">
                From kickoff to launch in 2-3 weeks
              </p>
            </div>
            
            <div className="space-y-6">
              <Card className="glass border-border/40">
                <CardHeader>
                  <CardTitle>Week 1: Planning & Design</CardTitle>
                  <CardDescription className="pt-2">
                    We gather requirements, create wireframes, and get your approval on the design direction.
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="glass border-border/40">
                <CardHeader>
                  <CardTitle>Week 2: Development</CardTitle>
                  <CardDescription className="pt-2">
                    Our team builds your website with clean code, following best practices and keeping you updated.
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="glass border-border/40">
                <CardHeader>
                  <CardTitle>Week 3: Testing & Launch</CardTitle>
                  <CardDescription className="pt-2">
                    Thorough testing across devices, final revisions, and smooth deployment to your domain.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Launch Your Website?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Get a detailed quote for your project in less than 24 hours
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/quote">Get a Quote</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Websites;
