import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Globe,
  Code2,
  BarChart3,
  ShoppingCart,
  Wrench,
  Shield,
  CheckCircle2,
  Star,
  Zap,
  Users,
  Clock
} from "lucide-react";

const services = [
  { icon: Globe, title: "Custom Websites", description: "Beautiful, responsive websites that convert", href: "/services/websites" },
  { icon: Code2, title: "Web Applications", description: "Full-stack apps with modern architecture", href: "/services/web-apps" },
  { icon: BarChart3, title: "Dashboards", description: "Data visualization & admin panels", href: "/services/dashboards" },
  { icon: ShoppingCart, title: "E-Commerce", description: "Online stores that drive sales", href: "/services/ecommerce" },
  { icon: Wrench, title: "Site Repair", description: "Fix broken sites & performance issues", href: "/services/repair" },
  { icon: Shield, title: "Maintenance", description: "Ongoing support & updates", href: "/services/maintenance" },
];

const stats = [
  { value: "150+", label: "Projects Delivered" },
  { value: "50+", label: "Happy Clients" },
  { value: "99%", label: "Client Satisfaction" },
  { value: "24/7", label: "Support Available" },
];

const testimonials = [
  {
    quote: "Dubiqo transformed our online presence. Our conversions increased by 45% within the first month.",
    author: "Sarah Chen",
    role: "CEO, TechStart Inc.",
    rating: 5
  },
  {
    quote: "Professional, responsive, and incredibly talented. They delivered our project ahead of schedule.",
    author: "Michael Roberts",
    role: "Founder, StyleHub",
    rating: 5
  },
  {
    quote: "The best investment we've made for our business. Our new dashboard saves us hours every week.",
    author: "Emily Watson",
    role: "Operations Director",
    rating: 5
  },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/20 rounded-full blur-[120px]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 px-4 py-2 text-sm border-primary/30 bg-primary/5">
              <Zap className="w-4 h-4 mr-2 text-primary" />
              We build websites that build your business
            </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in">
              Digital Solutions for{" "}
              <span className="gradient-text">Modern Business</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in animation-delay-200">
              From stunning websites to powerful applications, we create digital experiences that drive growth and delight users.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animation-delay-300">
              <Button size="lg" asChild className="glow-primary text-lg px-8 py-6">
                <Link to="/quote">
                  Get Free Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
                <Link to="/portfolio">View Our Work</Link>
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground animate-fade-in animation-delay-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Free Consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>No Hidden Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Money-Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <Section className="py-16 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Services Section */}
      <Section>
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="Services"
            title="What We Build"
            subtitle="End-to-end digital solutions tailored to your business needs."
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Link key={index} to={service.href}>
                <Card className="h-full bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all duration-300 group card-hover">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <service.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" asChild>
              <Link to="/services">
                View All Services
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* Why Choose Us */}
      <Section variant="muted">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader
                badge="Why Dubiqo"
                title="Built for Growth"
                subtitle="We don't just build websites—we create digital assets that drive real business results."
                align="left"
              />
              
              <div className="space-y-6">
                {[
                  { icon: Zap, title: "Lightning Fast", description: "Optimized for speed and performance from day one." },
                  { icon: Shield, title: "Secure & Reliable", description: "Enterprise-grade security for your peace of mind." },
                  { icon: Users, title: "Dedicated Support", description: "Real humans ready to help when you need it." },
                  { icon: Clock, title: "On-Time Delivery", description: "We respect deadlines and keep our promises." },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 p-8 border border-border/50">
                <div className="h-full rounded-xl bg-card/80 backdrop-blur border border-border/50 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-6xl font-bold gradient-text mb-4">4.9</div>
                    <div className="flex justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground">Average Client Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section>
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="Testimonials"
            title="What Our Clients Say"
            subtitle="Don't just take our word for it—hear from the businesses we've helped grow."
          />
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur border-border/50">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <blockquote className="text-lg mb-4">"{testimonial.quote}"</blockquote>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section variant="muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Build Something{" "}
              <span className="gradient-text">Amazing?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Let's discuss your project and see how we can help you achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="glow-primary text-lg px-8 py-6">
                <Link to="/quote">
                  Start Your Project
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
                <Link to="/booking">Schedule a Call</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default Index;
