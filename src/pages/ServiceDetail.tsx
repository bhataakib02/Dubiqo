import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Check, Globe, Code2, BarChart3, ShoppingCart, Wrench, Shield } from "lucide-react";

const servicesData: Record<string, {
  title: string;
  description: string;
  icon: any;
  features: string[];
  benefits: string[];
  process: { step: string; title: string; description: string }[];
  pricing: { from: string; note: string };
}> = {
  websites: {
    title: "Custom Websites",
    description: "Beautiful, responsive websites that convert visitors into customers. Built with modern technologies for speed, security, and SEO.",
    icon: Globe,
    features: [
      "Responsive Design",
      "SEO Optimization",
      "Fast Loading Speed",
      "SSL Security",
      "Content Management",
      "Analytics Integration",
      "Mobile-First Approach",
      "Accessibility Compliance"
    ],
    benefits: [
      "Increase brand credibility",
      "Generate more leads",
      "Improve user experience",
      "Rank higher on Google"
    ],
    process: [
      { step: "01", title: "Discovery", description: "We learn about your business, goals, and target audience." },
      { step: "02", title: "Design", description: "Create wireframes and visual designs for your approval." },
      { step: "03", title: "Development", description: "Build your website with clean, maintainable code." },
      { step: "04", title: "Launch", description: "Deploy, test, and optimize for performance." }
    ],
    pricing: { from: "₹1,99,900", note: "Starting price for a 5-page website" }
  },
  "web-apps": {
    title: "Web Applications",
    description: "Full-stack applications with modern architecture. From MVPs to enterprise solutions, we build scalable apps that grow with your business.",
    icon: Code2,
    features: [
      "Custom Development",
      "API Integration",
      "User Authentication",
      "Real-time Features",
      "Database Design",
      "Cloud Deployment",
      "Automated Testing",
      "CI/CD Pipeline"
    ],
    benefits: [
      "Automate business processes",
      "Scale with your growth",
      "Reduce operational costs",
      "Improve team productivity"
    ],
    process: [
      { step: "01", title: "Requirements", description: "Define features, user flows, and technical requirements." },
      { step: "02", title: "Architecture", description: "Design system architecture and database schema." },
      { step: "03", title: "Development", description: "Agile development with regular demos and feedback." },
      { step: "04", title: "Deployment", description: "Launch, monitor, and iterate based on usage." }
    ],
    pricing: { from: "₹7,99,900", note: "Starting price for MVP development" }
  },
  dashboards: {
    title: "Dashboards & Analytics",
    description: "Data visualization and admin panels that turn complex data into actionable insights. Make better decisions with real-time analytics.",
    icon: BarChart3,
    features: [
      "Interactive Charts",
      "Real-time Data",
      "Custom Reports",
      "Data Export",
      "Role-based Access",
      "Mobile Responsive",
      "API Connections",
      "Automated Alerts"
    ],
    benefits: [
      "Visualize key metrics",
      "Make data-driven decisions",
      "Monitor performance",
      "Share insights easily"
    ],
    process: [
      { step: "01", title: "Data Audit", description: "Understand your data sources and KPIs." },
      { step: "02", title: "Design", description: "Create dashboard layouts and visualization types." },
      { step: "03", title: "Integration", description: "Connect data sources and build the dashboard." },
      { step: "04", title: "Training", description: "Train your team and provide documentation." }
    ],
    pricing: { from: "₹3,99,900", note: "Starting price for custom dashboard" }
  },
  ecommerce: {
    title: "E-Commerce Solutions",
    description: "Online stores that drive sales. From product catalogs to checkout, we build e-commerce experiences that convert browsers into buyers.",
    icon: ShoppingCart,
    features: [
      "Product Management",
      "Secure Checkout",
      "Payment Integration",
      "Inventory Tracking",
      "Order Management",
      "Customer Accounts",
      "Marketing Tools",
      "Analytics & Reports"
    ],
    benefits: [
      "Sell 24/7 online",
      "Reach global customers",
      "Automate operations",
      "Increase revenue"
    ],
    process: [
      { step: "01", title: "Strategy", description: "Define products, pricing, and target market." },
      { step: "02", title: "Design", description: "Create a conversion-optimized shopping experience." },
      { step: "03", title: "Build", description: "Develop store with payment and shipping integration." },
      { step: "04", title: "Launch", description: "Go live with marketing and SEO optimization." }
    ],
    pricing: { from: "₹6,49,900", note: "Starting price for custom store" }
  },
  repair: {
    title: "Site Repair & Recovery",
    description: "Fix broken sites and performance issues. Whether it's bugs, security vulnerabilities, or slow loading times, we'll get your site back on track.",
    icon: Wrench,
    features: [
      "Bug Fixes",
      "Performance Optimization",
      "Security Patches",
      "Malware Removal",
      "Database Repair",
      "Backup Recovery",
      "Code Cleanup",
      "Emergency Support"
    ],
    benefits: [
      "Restore site functionality",
      "Improve site speed",
      "Protect from threats",
      "Peace of mind"
    ],
    process: [
      { step: "01", title: "Diagnosis", description: "Identify issues and create a repair plan." },
      { step: "02", title: "Backup", description: "Secure backup before making any changes." },
      { step: "03", title: "Repair", description: "Fix issues and test thoroughly." },
      { step: "04", title: "Prevention", description: "Implement measures to prevent future issues." }
    ],
    pricing: { from: "₹39,900", note: "Starting price for basic repairs" }
  },
  maintenance: {
    title: "Ongoing Maintenance",
    description: "Keep your site secure, fast, and up-to-date. Our maintenance plans ensure your website runs smoothly while you focus on your business.",
    icon: Shield,
    features: [
      "Regular Updates",
      "Security Monitoring",
      "Performance Checks",
      "Backup Management",
      "Uptime Monitoring",
      "Content Updates",
      "Monthly Reports",
      "Priority Support"
    ],
    benefits: [
      "Worry-free operations",
      "Reduced downtime",
      "Better security",
      "Expert support"
    ],
    process: [
      { step: "01", title: "Audit", description: "Review current site state and needs." },
      { step: "02", title: "Plan", description: "Create a customized maintenance plan." },
      { step: "03", title: "Execute", description: "Regular maintenance and updates." },
      { step: "04", title: "Report", description: "Monthly reports on site health and work done." }
    ],
    pricing: { from: "₹24,900/mo", note: "Starting price for monthly maintenance" }
  }
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = servicesData[slug || ""];

  if (!service) {
    return (
      <Layout>
        <Section className="pt-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
            <p className="text-muted-foreground mb-8">The service you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </Section>
      </Layout>
    );
  }

  const Icon = service.icon;

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Icon className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Service</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {service.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              {service.description}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="glow-primary">
                <Link to="/quote">Get a Quote</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/booking">Book a Call</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <Section>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <SectionHeader
                badge="Features"
                title="What's Included"
                subtitle="Everything you need to succeed with your digital presence."
                align="left"
              />
              
              <div className="grid sm:grid-cols-2 gap-4">
                {service.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Benefits</h3>
                <ul className="space-y-4">
                  {service.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <ArrowRight className="w-5 h-5 text-primary mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8 pt-6 border-t border-border">
                  <div className="text-sm text-muted-foreground mb-2">{service.pricing.note}</div>
                  <div className="text-4xl font-bold gradient-text">{service.pricing.from}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Process */}
      <Section variant="muted">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="Process"
            title="How We Work"
            subtitle="A proven process that delivers results, on time and on budget."
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.process.map((step, index) => (
              <Card
                key={step.step}
                className="bg-card/50 backdrop-blur border-border/50 relative overflow-hidden group hover:border-primary/50 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="text-6xl font-bold text-primary/10 absolute -top-4 -right-2 group-hover:text-primary/20 transition-colors">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 relative">{step.title}</h3>
                  <p className="text-muted-foreground text-sm relative">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Let's discuss your project and see how we can help you achieve your goals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild className="glow-primary">
              <Link to="/quote">Get a Free Quote</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
