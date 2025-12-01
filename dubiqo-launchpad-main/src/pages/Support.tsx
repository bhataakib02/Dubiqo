import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Book,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  Video,
  ArrowRight,
} from "lucide-react";

const categories = [
  {
    icon: Book,
    title: "Getting Started",
    description: "Learn the basics and get up to speed quickly",
    articles: 12,
    href: "/support/getting-started",
  },
  {
    icon: FileText,
    title: "Account & Billing",
    description: "Manage your account, payments, and invoices",
    articles: 8,
    href: "/support/account-billing",
  },
  {
    icon: MessageCircle,
    title: "Technical Support",
    description: "Troubleshooting guides and technical help",
    articles: 15,
    href: "/support/technical",
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Step-by-step video guides",
    articles: 6,
    href: "/support/videos",
  },
];

const popularArticles = [
  "How to access the client portal",
  "Understanding your invoice",
  "Requesting website changes",
  "Setting up your domain",
  "SSL certificate installation",
  "Content update guidelines",
];

export default function Support() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              How can we <span className="gradient-text">help</span>?
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Search our knowledge base or browse categories below.
            </p>
            
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for answers..."
                className="pl-12 py-6 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <Section>
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.title} to={category.href} className="group">
                <Card className="h-full bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <category.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-3">
                      {category.description}
                    </p>
                    <span className="text-sm text-primary">
                      {category.articles} articles
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* Popular Articles */}
      <Section variant="muted">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Popular Articles"
            subtitle="Most viewed help articles from our knowledge base."
          />
          
          <div className="max-w-2xl mx-auto">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-0">
                {popularArticles.map((article, index) => (
                  <Link
                    key={article}
                    to="#"
                    className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0 group"
                  >
                    <span className="group-hover:text-primary transition-colors">
                      {article}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Contact Options */}
      <Section>
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Still need help?"
            subtitle="Our support team is here to assist you."
          />
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-card/50 backdrop-blur border-border/50 text-center">
              <CardContent className="pt-8">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Chat with our support team in real-time
                </p>
                <Button>Start Chat</Button>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur border-border/50 text-center">
              <CardContent className="pt-8">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Email Support</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  We'll respond within 24 hours
                </p>
                <Button variant="outline" asChild>
                  <a href="mailto:support@dubiqo.com">Send Email</a>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur border-border/50 text-center">
              <CardContent className="pt-8">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Phone Support</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Mon-Fri, 9AM-6PM EST
                </p>
                <Button variant="outline" asChild>
                  <a href="tel:+1234567890">Call Us</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
