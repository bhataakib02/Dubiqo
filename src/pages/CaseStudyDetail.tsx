import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, ExternalLink, Quote } from "lucide-react";

const caseStudiesData: Record<string, {
  title: string;
  client: string;
  industry: string;
  duration: string;
  services: string[];
  challenge: string;
  solution: string;
  results: { metric: string; value: string }[];
  testimonial?: { quote: string; author: string; role: string };
  technologies: string[];
}> = {
  "fintech-dashboard": {
    title: "FinTech Analytics Dashboard",
    client: "PayFlow Inc.",
    industry: "Financial Technology",
    duration: "12 weeks",
    services: ["Web Application", "Dashboard", "API Integration"],
    challenge: "PayFlow needed a real-time analytics dashboard to help their clients track transactions, detect fraud, and generate compliance reports. Their existing system was slow and couldn't handle their growing data volume.",
    solution: "We built a custom dashboard with real-time data streaming, interactive visualizations, and automated reporting. The system integrates with multiple payment processors and uses machine learning for fraud detection.",
    results: [
      { metric: "Load Time", value: "3s → 0.5s" },
      { metric: "Data Processing", value: "10x faster" },
      { metric: "Fraud Detection", value: "95% accuracy" },
      { metric: "User Satisfaction", value: "4.8/5 rating" }
    ],
    testimonial: {
      quote: "Dubiqo transformed our analytics capabilities. Our clients love the new dashboard and we've seen a significant reduction in fraud-related losses.",
      author: "Sarah Chen",
      role: "CTO, PayFlow Inc."
    },
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Redis", "WebSockets"]
  },
  "ecommerce-platform": {
    title: "E-Commerce Platform Rebuild",
    client: "StyleHub Fashion",
    industry: "Retail / E-Commerce",
    duration: "16 weeks",
    services: ["E-Commerce", "Custom Website", "Payment Integration"],
    challenge: "StyleHub's legacy e-commerce platform was slow, difficult to manage, and couldn't support their expansion into new markets. They needed a modern solution that could handle multi-currency and international shipping.",
    solution: "We rebuilt their entire e-commerce platform from scratch with a headless architecture, supporting multiple currencies, languages, and fulfillment centers. The admin panel makes inventory and order management effortless.",
    results: [
      { metric: "Conversion Rate", value: "+45%" },
      { metric: "Page Speed", value: "90+ Lighthouse" },
      { metric: "Cart Abandonment", value: "-30%" },
      { metric: "International Sales", value: "+200%" }
    ],
    testimonial: {
      quote: "The new platform has been a game-changer for our business. We've expanded into 5 new countries and our conversion rates have never been better.",
      author: "Michael Roberts",
      role: "CEO, StyleHub Fashion"
    },
    technologies: ["Next.js", "Stripe", "Shopify API", "Tailwind CSS", "Vercel"]
  },
  "healthcare-portal": {
    title: "Healthcare Patient Portal",
    client: "MediCare Plus",
    industry: "Healthcare",
    duration: "20 weeks",
    services: ["Web Application", "Security", "API Integration"],
    challenge: "MediCare Plus needed a HIPAA-compliant patient portal that would allow patients to book appointments, view medical records, and communicate with their healthcare providers securely.",
    solution: "We developed a secure patient portal with end-to-end encryption, two-factor authentication, and integration with their existing EHR system. The portal includes telemedicine capabilities and automated appointment reminders.",
    results: [
      { metric: "Patient Engagement", value: "+60%" },
      { metric: "No-show Rate", value: "-40%" },
      { metric: "Admin Time Saved", value: "15 hrs/week" },
      { metric: "Patient Satisfaction", value: "4.9/5 rating" }
    ],
    testimonial: {
      quote: "Our patients love the new portal. It's made healthcare more accessible and has significantly reduced our administrative burden.",
      author: "Dr. Emily Watson",
      role: "Medical Director, MediCare Plus"
    },
    technologies: ["React", "Node.js", "PostgreSQL", "AWS", "HIPAA Compliance"]
  }
};

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const study = caseStudiesData[slug || ""];

  if (!study) {
    return (
      <Layout>
        <Section className="pt-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Case Study Not Found</h1>
            <p className="text-muted-foreground mb-8">The case study you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/case-studies">View All Case Studies</Link>
            </Button>
          </div>
        </Section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative">
          <Link
            to="/case-studies"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Case Studies
          </Link>
          
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2 mb-6">
              {study.services.map((service) => (
                <Badge key={service} variant="outline">{service}</Badge>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {study.title}
            </h1>
            
            <div className="flex flex-wrap gap-6 text-muted-foreground">
              <div>
                <span className="text-foreground font-medium">Client:</span> {study.client}
              </div>
              <div>
                <span className="text-foreground font-medium">Industry:</span> {study.industry}
              </div>
              <div>
                <span className="text-foreground font-medium">Duration:</span> {study.duration}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge & Solution */}
      <Section>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-destructive">The Challenge</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {study.challenge}
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4 text-primary">Our Solution</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {study.solution}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Results */}
      <Section variant="muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Results</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {study.results.map((result) => (
              <Card key={result.metric} className="bg-card/50 backdrop-blur border-border/50 text-center">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold gradient-text mb-2">{result.value}</div>
                  <div className="text-muted-foreground">{result.metric}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Testimonial */}
      {study.testimonial && (
        <Section>
          <div className="container mx-auto px-4">
            <Card className="bg-card/50 backdrop-blur border-border/50 max-w-4xl mx-auto">
              <CardContent className="p-8 md:p-12">
                <Quote className="w-12 h-12 text-primary/20 mb-6" />
                <blockquote className="text-xl md:text-2xl font-medium mb-6 leading-relaxed">
                  "{study.testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold">{study.testimonial.author}</div>
                  <div className="text-muted-foreground">{study.testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>
      )}

      {/* Technologies */}
      <Section variant="muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-8">Technologies Used</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {study.technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-base py-2 px-4">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Want Similar Results?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Let's discuss how we can help transform your business with a custom solution.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild className="glow-primary">
              <Link to="/quote">Start Your Project</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/case-studies">View More Case Studies</Link>
            </Button>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
