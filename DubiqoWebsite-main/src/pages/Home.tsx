import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Globe,
  Briefcase,
  BarChart3,
  CreditCard,
  Wrench,
  Settings,
  ArrowRight,
  CheckCircle2,
  Star,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const { toast } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Subscribed Successfully! ✓",
      description: "You'll receive our latest tips and updates.",
    });
    setNewsletterEmail("");
    setIsSubmitting(false);
  };

  const services = [
    { icon: Globe, title: "Websites", description: "Business websites, landing pages, and web applications", link: "/services/websites" },
    { icon: Briefcase, title: "Portfolios", description: "Professional portfolios for students and creators", link: "/services/portfolios" },
    { icon: BarChart3, title: "Dashboards", description: "Admin panels and analytics dashboards", link: "/services/dashboards" },
    { icon: CreditCard, title: "Billing Systems", description: "Invoicing, payments, and subscription management", link: "/services/billing-systems" },
    { icon: Wrench, title: "Troubleshooting", description: "Bug fixes, performance, and emergency support", link: "/services/troubleshooting" },
    { icon: Settings, title: "Maintenance", description: "Ongoing updates, security, and optimization", link: "/services/maintenance" },
  ];

  const personas = [
    { title: "Students", description: "Build a portfolio that impresses recruiters" },
    { title: "Freelancers", description: "Professional presence to win more clients" },
    { title: "Startups", description: "Launch fast with a solid digital foundation" },
    { title: "Small Businesses", description: "Grow with a website that works for you" },
    { title: "Creators", description: "Showcase your work beautifully" },
    { title: "Agencies", description: "White-label development partnership" },
  ];

  const processSteps = [
    { step: "01", title: "Tell Us What You Need", description: "Share your vision, goals, and requirements" },
    { step: "02", title: "We Plan & Design", description: "Strategy, wireframes, and visual design" },
    { step: "03", title: "We Build", description: "Development with regular progress updates" },
    { step: "04", title: "Launch & Support", description: "Go live with ongoing maintenance" },
  ];

  const projects = [
    { title: "Fashion E-Commerce", type: "Website", tech: ["React", "Stripe", "Tailwind"] },
    { title: "SaaS Dashboard", type: "Dashboard", tech: ["React", "D3.js", "PostgreSQL"] },
    { title: "Developer Portfolio", type: "Portfolio", tech: ["Next.js", "Framer Motion"] },
    { title: "Billing Platform", type: "Billing", tech: ["React", "Razorpay", "MongoDB"] },
  ];

  const testimonials = [
    { name: "Arjun K.", role: "Startup Founder", quote: "Dubiqo delivered our MVP in just 3 weeks. Clean code, beautiful design, and great communication." },
    { name: "Priya M.", role: "Freelance Designer", quote: "My portfolio has never looked better. I've received more inquiries in one month than the entire past year." },
    { name: "Rahul S.", role: "Small Business Owner", quote: "They fixed performance issues that had plagued our site for months. Fast, professional, and affordable." },
  ];

  const faqs = [
    { q: "How long does it take to build a website?", a: "Simple sites take 5-7 days. Professional sites take 2-3 weeks. Complex projects like dashboards take 4-6 weeks. Rush delivery available." },
    { q: "How much does it cost?", a: "Starter packages from ₹4,999. Professional from ₹9,999. Custom solutions from ₹14,999+. Use our quote calculator for a personalized estimate." },
    { q: "Do you work with international clients?", a: "Yes! We work with clients worldwide. Pricing for international clients starts at ~$60 USD. We're experienced with remote collaboration." },
    { q: "What if I need changes after delivery?", a: "All plans include revision rounds and post-launch support. Additional changes are billed at fair hourly rates or covered by maintenance plans." },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
              We Build Websites That{" "}
              <span className="text-gradient">Build Your Business</span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/70 mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
              Modern websites, portfolios, dashboards, and digital solutions.
              From new builds to fixing broken sites — we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "200ms" }}>
              <Button asChild size="lg" className="gradient-primary glow">
                <Link to="/quote">Get a Free Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/50">
                <Link to="/portfolio">See Our Work</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Do</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Complete digital solutions for individuals and businesses
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Link key={index} to={service.link}>
                  <Card className="glass border-border/40 hover:border-primary/50 transition-all duration-300 group h-full">
                    <CardHeader>
                      <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">{service.title}</CardTitle>
                      <CardDescription className="pt-2">{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="text-primary text-sm font-medium flex items-center">
                        Learn more <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who We Help */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Who We Help</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              From individual creators to growing businesses
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {personas.map((persona, index) => (
              <Card key={index} className="glass border-border/40 hover:border-primary/50 transition-all duration-300 text-center">
                <CardHeader className="p-4">
                  <CardTitle className="text-base">{persona.title}</CardTitle>
                  <CardDescription className="text-xs">{persona.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Our simple 4-step process from idea to launch
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {processSteps.map((step, index) => (
              <Card key={index} className="glass border-border/40 text-center relative">
                <CardHeader>
                  <div className="text-5xl font-bold text-gradient mb-4">{step.step}</div>
                  <CardTitle>{step.title}</CardTitle>
                  <CardDescription className="pt-2">{step.description}</CardDescription>
                </CardHeader>
                {index < processSteps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-6 w-6 text-primary z-10" />
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Work</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              A glimpse of what we've built for our clients
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {projects.map((project, index) => (
              <Card key={index} className="glass border-border/40 hover:border-primary/50 transition-all duration-300 group overflow-hidden">
                <div className="h-40 bg-gradient-primary relative">
                  <div className="absolute inset-0 bg-background/20 group-hover:bg-background/0 transition-all duration-300" />
                </div>
                <CardHeader>
                  <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary w-fit mb-2">
                    {project.type}
                  </div>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {project.tech.map((tech, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded bg-muted text-foreground/70">{tech}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="border-primary/50">
              <Link to="/portfolio">View All Projects <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass border-border/40">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-foreground/80 mb-4">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-foreground/60">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Transparent pricing with no hidden fees
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Starter", price: "₹4,999", desc: "Perfect for portfolios and landing pages" },
              { name: "Professional", price: "₹9,999", desc: "Multi-page business websites", featured: true },
              { name: "Business", price: "₹14,999+", desc: "Dashboards, billing systems, custom solutions" },
            ].map((plan, index) => (
              <Card key={index} className={`glass ${plan.featured ? "border-primary glow" : "border-border/40"}`}>
                <CardHeader className="text-center">
                  {plan.featured && <span className="text-xs text-primary font-medium mb-2">MOST POPULAR</span>}
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-gradient my-4">{plan.price}</div>
                  <CardDescription>{plan.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className={`w-full ${plan.featured ? "gradient-primary" : ""}`} variant={plan.featured ? "default" : "outline"}>
                    <Link to="/pricing">View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Common Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card 
                key={index} 
                className={`glass border-border/40 cursor-pointer transition-all duration-300 ${openFaq === index ? "border-primary/50" : "hover:border-primary/30"}`}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{faq.q}</CardTitle>
                    <ChevronDown className={`h-5 w-5 text-primary transition-transform ${openFaq === index ? "rotate-180" : ""}`} />
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? "max-h-40 pt-4" : "max-h-0"}`}>
                    <CardDescription className="text-foreground/80">{faq.a}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="link" className="text-primary">
              <Link to="/faq">View All FAQs <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="glass border-primary glow max-w-3xl mx-auto">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Get Web Tips & Updates</h2>
              <p className="text-foreground/70 mb-6">
                Subscribe for practical tips on web development, design, and growing your online presence.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="bg-muted/50 border-border/40"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
                <Button type="submit" className="gradient-primary" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
                </Button>
              </form>
              <p className="text-xs text-foreground/50 mt-4">No spam. Unsubscribe anytime.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Build Something Great?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Whether it's a new website or fixing an old one, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="font-semibold">
              <Link to="/quote">Get Your Free Quote</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/booking">Book a Call</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
