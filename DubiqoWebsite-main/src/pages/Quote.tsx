import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calculator, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendQuoteRequest } from "@/utils/emailService";

const Quote = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectType, setProjectType] = useState("");
  const [pages, setPages] = useState("1");
  const [features, setFeatures] = useState<string[]>([]);
  const [urgency, setUrgency] = useState("normal");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    details: "",
  });

  const featuresList = [
    { id: "forms", label: "Contact/Enquiry Forms", impact: 500 },
    { id: "blog", label: "Blog Integration", impact: 1500 },
    { id: "admin", label: "Admin Panel", impact: 3000 },
    { id: "payment", label: "Payment Integration", impact: 2000 },
    { id: "animations", label: "Advanced Animations", impact: 1000 },
    { id: "seo", label: "SEO Optimization", impact: 1000 },
    { id: "auth", label: "User Authentication", impact: 2500 },
    { id: "api", label: "API Integration", impact: 1500 },
  ];

  const estimate = useMemo(() => {
    if (!projectType) return null;

    let base = 0;
    
    // Base price by project type
    switch(projectType) {
      case "website":
        base = 5000;
        break;
      case "portfolio":
        base = 4999;
        break;
      case "dashboard":
        base = 12000;
        break;
      case "billing":
        base = 12000;
        break;
      case "ecommerce":
        base = 15000;
        break;
      default:
        base = 5000;
    }

    // Add for pages
    const pageCount = parseInt(pages);
    if (pageCount > 1 && pageCount <= 5) {
      base += (pageCount - 1) * 750;
    } else if (pageCount > 5) {
      base += 3000 + (pageCount - 5) * 500;
    }

    // Add selected features
    features.forEach(featureId => {
      const feature = featuresList.find(f => f.id === featureId);
      if (feature) base += feature.impact;
    });

    // Urgency multiplier
    let urgencyMultiplier = 1;
    if (urgency === "rush") {
      urgencyMultiplier = 1.5;
    } else if (urgency === "urgent") {
      urgencyMultiplier = 1.25;
    }
    
    base *= urgencyMultiplier;

    const min = Math.floor(base * 0.9);
    const max = Math.floor(base * 1.2);

    return { min, max, urgencyMultiplier };
  }, [projectType, pages, features, urgency]);

  const handleFeatureToggle = (featureId: string) => {
    setFeatures(prev =>
      prev.includes(featureId)
        ? prev.filter(f => f !== featureId)
        : [...prev, featureId]
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and email.",
        variant: "destructive",
      });
      return;
    }

    if (!projectType) {
      toast({
        title: "Select Project Type",
        description: "Please select a project type to get an estimate.",
        variant: "destructive",
      });
      return;
    }

    if (!estimate) {
      toast({
        title: "Error",
        description: "Unable to calculate estimate. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Send quote request email to admin
      const success = await sendQuoteRequest({
        name: formData.name,
        email: formData.email,
        phone: "", // Quote form doesn't have phone field
        projectType: projectType,
        pages: parseInt(pages) || 1,
        features: features,
        urgency: urgency,
        estimatedRange: `₹${estimate.min.toLocaleString()} - ₹${estimate.max.toLocaleString()}`,
        additionalNotes: formData.details,
      });

      if (success) {
        toast({
          title: "Quote Request Submitted! ✓",
          description: "We'll send you a detailed quote within 24 hours. An email has been sent to our admin team.",
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          details: "",
        });
        setProjectType("");
        setPages("1");
        setFeatures([]);
        setUrgency("normal");
      } else {
        toast({
          title: "Submission Failed",
          description: "There was an error sending your request. Please try again or contact us directly at hello@dubiqo.com",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error sending your request. Please try again or contact us directly at hello@dubiqo.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDeliveryTime = () => {
    if (!projectType) return "";
    const baseTime = projectType === "dashboard" || projectType === "billing" ? "4-6 weeks" : 
                     projectType === "ecommerce" ? "6-8 weeks" : "2-3 weeks";
    if (urgency === "rush") return "50% faster delivery";
    if (urgency === "urgent") return "Priority delivery";
    return baseTime;
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4 text-center">
          <Calculator className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Quote Estimator
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Get an instant estimate for your project. Configure your requirements below and see real-time pricing.
          </p>
        </div>
      </section>

      {/* Estimator */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Input Form */}
            <Card className="glass border-border/40">
              <CardHeader>
                <CardTitle className="text-2xl">Project Configuration</CardTitle>
                <CardDescription>
                  Select your requirements to see the estimate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="project-type">Project Type *</Label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger className="bg-muted/50 border-border/40">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent className="glass border-border/40">
                      <SelectItem value="website">Business Website</SelectItem>
                      <SelectItem value="portfolio">Portfolio Website</SelectItem>
                      <SelectItem value="dashboard">Dashboard/Admin Panel</SelectItem>
                      <SelectItem value="billing">Billing System</SelectItem>
                      <SelectItem value="ecommerce">E-commerce (UI)</SelectItem>
                      <SelectItem value="other">Other (Custom)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pages">Number of Pages</Label>
                  <Select value={pages} onValueChange={setPages}>
                    <SelectTrigger className="bg-muted/50 border-border/40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-border/40">
                      <SelectItem value="1">1 page (Landing page)</SelectItem>
                      <SelectItem value="3">3 pages</SelectItem>
                      <SelectItem value="5">5 pages</SelectItem>
                      <SelectItem value="8">8 pages</SelectItem>
                      <SelectItem value="10">10+ pages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Additional Features</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {featuresList.map((feature) => (
                      <div key={feature.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id={feature.id}
                          checked={features.includes(feature.id)}
                          onCheckedChange={() => handleFeatureToggle(feature.id)}
                        />
                        <label
                          htmlFor={feature.id}
                          className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {feature.label}
                        </label>
                        <span className="text-xs text-primary font-medium">+₹{feature.impact.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="urgency">Project Urgency</Label>
                  <Select value={urgency} onValueChange={setUrgency}>
                    <SelectTrigger className="bg-muted/50 border-border/40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-border/40">
                      <SelectItem value="normal">Normal (Standard timeline)</SelectItem>
                      <SelectItem value="urgent">Urgent (+25% for priority)</SelectItem>
                      <SelectItem value="rush">Rush/Emergency (+50% for fastest)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Estimate Display */}
            <div className="space-y-6">
              <Card className={`glass ${estimate ? 'border-primary glow' : 'border-border/40'}`}>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Live Estimate
                  </CardTitle>
                  <CardDescription>
                    Based on your selections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {estimate ? (
                    <div className="space-y-6">
                      <div className="text-center py-8 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
                        <p className="text-sm text-foreground/60 mb-2">Estimated Range</p>
                        <p className="text-5xl font-bold text-gradient">
                          ₹{estimate.min.toLocaleString()} - ₹{estimate.max.toLocaleString()}
                        </p>
                        {estimate.urgencyMultiplier > 1 && (
                          <p className="text-sm text-primary mt-2">
                            Includes {estimate.urgencyMultiplier === 1.5 ? "50%" : "25%"} urgency fee
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm p-3 rounded-lg bg-muted/30">
                          <span className="text-foreground/70">Project Type</span>
                          <span className="font-medium capitalize">{projectType}</span>
                        </div>
                        <div className="flex justify-between text-sm p-3 rounded-lg bg-muted/30">
                          <span className="text-foreground/70">Pages</span>
                          <span className="font-medium">{pages}</span>
                        </div>
                        <div className="flex justify-between text-sm p-3 rounded-lg bg-muted/30">
                          <span className="text-foreground/70">Features</span>
                          <span className="font-medium">{features.length} selected</span>
                        </div>
                        <div className="flex justify-between text-sm p-3 rounded-lg bg-muted/30">
                          <span className="text-foreground/70">Est. Delivery</span>
                          <span className="font-medium">{getDeliveryTime()}</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-foreground/70 pt-4 border-t border-border/40">
                        <p className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          This is an estimate. Final quote based on detailed requirements.
                        </p>
                        <p className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          All projects include responsive design & basic SEO.
                        </p>
                        <p className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          Post-launch support included as per plan.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-foreground/60">
                      <Calculator className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Select project type to see estimate</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Form */}
              <Card className="glass border-border/40">
                <CardHeader>
                  <CardTitle>Get Detailed Quote</CardTitle>
                  <CardDescription>
                    Submit your details for a precise quote within 24 hours
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="bg-muted/50 border-border/40"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="details">Additional Details</Label>
                      <Textarea
                        id="details"
                        placeholder="Tell us more about your project requirements..."
                        className="bg-muted/50 border-border/40"
                        value={formData.details}
                        onChange={handleInputChange}
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
                        "Submit for Final Quote"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Quote;
