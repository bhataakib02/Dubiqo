import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import {
  Search,
  Book,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  Video,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const categories = [
  {
    icon: Book,
    title: "Getting Started",
    description: "Learn the basics and get up to speed quickly",
    articles: 12,
  },
  {
    icon: FileText,
    title: "Account & Billing",
    description: "Manage your account, payments, and invoices",
    articles: 8,
  },
  {
    icon: MessageCircle,
    title: "Technical Support",
    description: "Troubleshooting guides and technical help",
    articles: 15,
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Step-by-step video guides",
    articles: 6,
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

// Validation schema
const supportFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  category: z.string().min(1, "Please select a category"),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200),
  message: z.string().min(20, "Message must be at least 20 characters").max(2000),
});

type SupportFormData = z.infer<typeof supportFormSchema>;

export default function Support() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof SupportFormData, string>>>({});
  const [formData, setFormData] = useState<SupportFormData>({
    name: "",
    email: "",
    website: "",
    category: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (field: keyof SupportFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate form
    const result = supportFormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SupportFormData, string>> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof SupportFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (!supabase) {
        throw new Error("Supabase client not available");
      }

      // Try to invoke the Edge Function first, but fallback to direct DB insert
      let data, error;
      let useDirectInsert = false;
      
      try {
        const result = await supabase.functions.invoke('ticket-create', {
          body: {
            name: formData.name,
            email: formData.email,
            website_url: formData.website || null,
            category: formData.category,
            title: formData.subject,
            description: formData.message,
            priority: 'medium',
          }
        });
        
        // If Edge Function returns an error, fallback to direct insert
        if (result.error) {
          console.warn("Edge Function returned error, using direct database insert:", result.error);
          useDirectInsert = true;
        } else {
          data = result.data;
          error = null;
        }
      } catch (invokeError: any) {
        // If Edge Function invocation fails, use direct database insert
        console.warn("Edge Function not available, using direct database insert:", invokeError);
        useDirectInsert = true;
      }

      // Fallback to direct database insert if Edge Function failed
      // Note: This will only work for authenticated users due to RLS policies
      // For unauthenticated users, the Edge Function must be used
      if (useDirectInsert) {
        if (!supabase) {
          throw new Error("Supabase client not available");
        }

        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // For unauthenticated users, we must use the Edge Function
          // If Edge Function failed, we can't proceed without authentication
          throw new Error("Please sign in to submit a support request, or the support service is temporarily unavailable. Please try again later or contact us directly at thefreelancer2076@gmail.com");
        }

        // For authenticated users, use their ID as client_id
        const clientId = user.id;

        // Insert ticket directly
        const ticketData: Record<string, unknown> = {
          client_id: clientId,
          title: formData.subject.trim(),
          description: formData.message.trim(),
          category: formData.category || 'general',
          priority: 'medium',
          status: 'open',
          metadata: {
            name: formData.name,
            email: formData.email,
            website_url: formData.website || null,
            source: 'support_form',
          },
        };

        const { data: ticket, error: insertError } = await supabase
          .from('tickets')
          .insert(ticketData)
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        // Create initial ticket message
        if (ticket) {
          await supabase.from('ticket_messages').insert({
            ticket_id: ticket.id,
            user_id: clientId,
            message: formData.message.trim(),
            is_internal: false,
          });
        }

        data = { ticket, ticket_id: ticket.id };
      }

      if (error) throw error;

      const ticketId = data?.ticket?.id || data?.ticket_id || 'TKT-' + Date.now();
      setTicketId(ticketId);
      setIsSubmitted(true);
      toast.success("Support request submitted!", {
        description: "We'll get back to you within 24 hours."
      });
    } catch (error: any) {
      console.error('Error submitting support request:', error);
      let errorMessage = 'Please try again or contact us directly.';
      
      if (error?.message) {
        if (error.message.includes('not available') || error.message.includes('temporarily unavailable')) {
          errorMessage = 'Service temporarily unavailable. Please try again later or contact us directly at thefreelancer2076@gmail.com';
        } else if (error.message.includes('sign in') || error.message.includes('authentication')) {
          errorMessage = error.message;
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error("Failed to submit request", {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      website: "",
      category: "",
      subject: "",
      message: "",
    });
    setIsSubmitted(false);
    setTicketId(null);
  };

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
              <Card 
                key={category.title}
                className="h-full bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all group cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  // Scroll to support form when category is clicked
                  setTimeout(() => {
                    const formSection = document.getElementById('support-form');
                    if (formSection) {
                      const yOffset = -80; // Offset for fixed header
                      const y = formSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }, 100);
                }}
              >
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
                  <div
                    key={article}
                    onClick={(e) => {
                      e.preventDefault();
                      // Scroll to support form when article is clicked
                      setTimeout(() => {
                        const formSection = document.getElementById('support-form');
                        if (formSection) {
                          const yOffset = -80; // Offset for fixed header
                          const y = formSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                          window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                      }, 100);
                    }}
                    className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0 group cursor-pointer"
                  >
                    <span className="group-hover:text-primary transition-colors">
                      {article}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Support Form */}
      <Section id="support-form">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Submit a Support Request"
            subtitle="Can't find what you're looking for? Send us a message."
          />
          
          <div className="max-w-2xl mx-auto">
            {isSubmitted ? (
              <Card className="bg-success/5 border-success/20">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Request Submitted!</h3>
                  <p className="text-muted-foreground mb-2">
                    Your support request has been received.
                  </p>
                  {ticketId && (
                    <p className="text-sm font-mono text-primary mb-4">
                      Ticket ID: {ticketId}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mb-6">
                    We typically respond within 24 hours during business days.
                  </p>
                  <Button onClick={resetForm} variant="outline">
                    Submit Another Request
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className={errors.name ? "border-destructive" : ""}
                        />
                        {errors.name && (
                          <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className={errors.email ? "border-destructive" : ""}
                        />
                        {errors.email && (
                          <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="website">Website URL (optional)</Label>
                        <Input
                          id="website"
                          type="url"
                          placeholder="https://yoursite.com"
                          value={formData.website}
                          onChange={(e) => handleInputChange("website", e.target.value)}
                          className={errors.website ? "border-destructive" : ""}
                        />
                        {errors.website && (
                          <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.website}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleInputChange("category", value)}
                        >
                          <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="getting_started">Getting Started</SelectItem>
                            <SelectItem value="website_questions">Website Questions</SelectItem>
                            <SelectItem value="troubleshooting">Troubleshooting Issues</SelectItem>
                            <SelectItem value="billing">Billing & Payments</SelectItem>
                            <SelectItem value="maintenance">Maintenance & Support</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.category && (
                          <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.category}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        placeholder="Brief description of your issue"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        className={errors.subject ? "border-destructive" : ""}
                      />
                      {errors.subject && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Please describe your issue in detail..."
                        rows={6}
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        className={errors.message ? "border-destructive" : ""}
                      />
                      {errors.message && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.message}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formData.message.length}/2000 characters
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Request
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Section>

      {/* Contact Options */}
      <Section variant="muted">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Other Ways to Reach Us"
            subtitle="Our support team is here to assist you."
          />
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
                  <a href="mailto:thefreelancer2076@gmail.com">Send Email</a>
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
                  Mon-Fri, 9AM-6PM IST
                </p>
                <Button variant="outline" asChild>
                  <Link to="/contact">Call Us</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
