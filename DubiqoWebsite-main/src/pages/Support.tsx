import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Book, MessageCircle, Mail, Phone, Search, Loader2, CheckCircle2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { sendSupportRequest } from "@/utils/emailService";

const Support = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    issueType: "",
    description: "",
  });

  const categories = [
    {
      icon: Book,
      title: "Getting Started",
      description: "New to Dubiqo? Learn how to start your project",
      articles: [
        { title: "How to request a quote", link: "/quote" },
        { title: "Understanding our pricing", link: "/pricing" },
        { title: "What to prepare before starting", link: "/faq" },
        { title: "Timeline expectations", link: "/faq" },
      ],
    },
    {
      icon: MessageCircle,
      title: "Website Build Questions",
      description: "Common questions about website development",
      articles: [
        { title: "How to provide content and images", link: "/faq" },
        { title: "Understanding revisions", link: "/legal/refund" },
        { title: "Approving designs and mockups", link: "/faq" },
        { title: "Domain and hosting setup", link: "/faq" },
      ],
    },
    {
      icon: Book,
      title: "Troubleshooting Questions",
      description: "Help with fixing broken websites",
      articles: [
        { title: "How to report a bug", link: "/contact" },
        { title: "What information we need", link: "/faq" },
        { title: "Emergency support process", link: "/services/troubleshooting" },
        { title: "Performance issue diagnosis", link: "/services/troubleshooting" },
      ],
    },
    {
      icon: MessageCircle,
      title: "Billing & Payments",
      description: "Payment process and billing questions",
      articles: [
        { title: "Payment schedule explained", link: "/faq" },
        { title: "Accepted payment methods", link: "/pricing" },
        { title: "Getting an invoice", link: "/faq" },
        { title: "Refund policy", link: "/legal/refund" },
      ],
    },
    {
      icon: Book,
      title: "Maintenance & Support",
      description: "Ongoing website maintenance",
      articles: [
        { title: "What's included in support", link: "/services/maintenance" },
        { title: "Maintenance plan benefits", link: "/services/maintenance" },
        { title: "How to request updates", link: "/contact" },
        { title: "Priority support access", link: "/legal/sla" },
      ],
    },
  ];

  const filteredCategories = searchQuery
    ? categories.filter(
        (cat) =>
          cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.articles.some((article) =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : categories;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, issueType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.issueType) {
      toast({
        title: "Missing Information",
        description: "Please select an issue type.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Send support request email to admin
      const success = await sendSupportRequest({
        name: formData.name,
        email: formData.email,
        website: formData.website,
        issueType: formData.issueType,
        description: formData.description,
      });

      if (success) {
        toast({
          title: "Support Request Submitted! ✓",
          description: "We've received your request and will respond within 24 hours. An email has been sent to our admin team.",
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          website: "",
          issueType: "",
          description: "",
        });
      } else {
        toast({
          title: "Submission Failed",
          description: "There was an error sending your request. Please try again or contact us directly at support@dubiqo.com",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error sending your request. Please try again or contact us directly at support@dubiqo.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Support Center
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
            Find answers, get help, and learn how to make the most of Dubiqo's services
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/60" />
              <Input
                placeholder="Search for help..."
                className="pl-10 bg-muted/50 border-border/40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-card/30 border-b border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild variant="outline" className="border-border/40">
              <Link to="/faq">View All FAQs</Link>
            </Button>
            <Button asChild variant="outline" className="border-border/40">
              <Link to="/quote">Get a Quote</Link>
            </Button>
            <Button asChild variant="outline" className="border-border/40">
              <Link to="/pricing">See Pricing</Link>
            </Button>
            <Button asChild variant="outline" className="border-border/40">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse by Category</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Find help articles organized by topic
            </p>
          </div>
          
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground/60">No results found for "{searchQuery}"</p>
              <Button 
                variant="link" 
                className="text-primary mt-2"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category, index) => {
                const Icon = category.icon;
                const isExpanded = expandedCategory === index;
                return (
                  <Card 
                    key={index} 
                    className={`glass border-border/40 hover:border-primary/50 transition-all duration-300 cursor-pointer ${
                      isExpanded ? "border-primary/50" : ""
                    }`}
                    onClick={() => setExpandedCategory(isExpanded ? null : index)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Icon className="h-10 w-10 text-primary mb-2" />
                        <ChevronRight className={`h-5 w-5 text-foreground/60 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                      </div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                      <CardDescription className="pt-2">{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className={`space-y-2 transition-all duration-300 ${isExpanded ? "max-h-96" : "max-h-0 overflow-hidden"}`}>
                        {category.articles.map((article, i) => (
                          <li key={i}>
                            <Link 
                              to={article.link}
                              className="text-sm text-foreground/70 hover:text-primary transition-colors flex items-center gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className="text-primary">→</span> {article.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      {!isExpanded && (
                        <p className="text-sm text-primary">{category.articles.length} articles • Click to expand</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-4">Need More Help?</h2>
                <p className="text-foreground/70">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
              </div>

              <Card className="glass border-border/40">
                <CardHeader>
                  <Mail className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Email Support</CardTitle>
                  <CardDescription className="pt-2">
                    <a href="mailto:support@dubiqo.com" className="text-primary hover:underline">support@dubiqo.com</a><br />
                    Response within 24 hours
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="glass border-border/40">
                <CardHeader>
                  <Phone className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>WhatsApp</CardTitle>
                  <CardDescription className="pt-2">
                    <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">+91 98765 43210</a><br />
                    For urgent issues
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="glass border-border/40">
                <CardHeader>
                  <MessageCircle className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Live Chat</CardTitle>
                  <CardDescription className="pt-2">
                    Click the chat icon in bottom-right<br />
                    Instant support during business hours
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Support Form */}
            <Card className="glass border-border/40">
              <CardHeader>
                <CardTitle className="text-2xl">Submit a Support Request</CardTitle>
                <CardDescription>
                  Fill out this form and we'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="bg-muted/50 border-border/40"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="bg-muted/50 border-border/40"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website URL (if applicable)</Label>
                    <Input
                      id="website"
                      placeholder="https://yourwebsite.com"
                      className="bg-muted/50 border-border/40"
                      value={formData.website}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issue-type">Issue Type *</Label>
                    <Select value={formData.issueType} onValueChange={handleSelectChange}>
                      <SelectTrigger className="bg-muted/50 border-border/40">
                        <SelectValue placeholder="Select issue type" />
                      </SelectTrigger>
                      <SelectContent className="glass border-border/40">
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="billing">Billing Question</SelectItem>
                        <SelectItem value="project">Project Question</SelectItem>
                        <SelectItem value="account">Account Issue</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Issue Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Please describe your issue in detail..."
                      className="bg-muted/50 border-border/40 min-h-32"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gradient-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Submit Support Request
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Support;
