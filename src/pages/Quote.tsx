import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Calculator, Send, CheckCircle, Loader2 } from "lucide-react";
import { z } from "zod";

// All prices in paise (smallest unit) for backend
// Display prices in rupees for UI
const services = [
  { id: "websites", label: "Custom Website", basePrice: 249900, displayPrice: "₹2,499" },
  { id: "web-apps", label: "Web Application", basePrice: 799900, displayPrice: "₹7,999" },
  { id: "dashboards", label: "Dashboard", basePrice: 499900, displayPrice: "₹4,999" },
  { id: "ecommerce", label: "E-Commerce", basePrice: 599900, displayPrice: "₹5,999" },
  { id: "repair", label: "Site Repair", basePrice: 49900, displayPrice: "₹499" },
  { id: "maintenance", label: "Maintenance", basePrice: 19900, displayPrice: "₹199/mo" },
  { id: "portfolio", label: "Portfolio Website", basePrice: 499900, displayPrice: "₹4,999" },
];

const features = [
  { id: "cms", label: "Content Management System", price: 50000, displayPrice: "₹500" },
  { id: "auth", label: "User Authentication", price: 80000, displayPrice: "₹800" },
  { id: "payments", label: "Payment Integration", price: 100000, displayPrice: "₹1,000" },
  { id: "analytics", label: "Advanced Analytics", price: 40000, displayPrice: "₹400" },
  { id: "seo", label: "SEO Optimization", price: 60000, displayPrice: "₹600" },
  { id: "api", label: "API Integration", price: 120000, displayPrice: "₹1,200" },
];

const timelines = [
  { id: "standard", label: "Standard (4-6 weeks)", multiplier: 1 },
  { id: "rush", label: "Rush (2-3 weeks)", multiplier: 1.5 },
  { id: "urgent", label: "Urgent (1-2 weeks)", multiplier: 2 },
];

const quoteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  details: z.string().optional(),
});

export default function Quote() {
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get("service") || searchParams.get("type") || "";
  
  const [selectedService, setSelectedService] = useState(initialService);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [timeline, setTimeline] = useState("standard");
  const [pages, setPages] = useState([5]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", details: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const getUser = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({ id: session.user.id });
      }
    };
    getUser();
  }, []);

  // Format paise to INR display
  const formatINR = (paise: number) => {
    const rupees = paise / 100;
    return `₹${rupees.toLocaleString('en-IN')}`;
  };

  const calculateEstimate = () => {
    const service = services.find((s) => s.id === selectedService);
    if (!service) return 0;

    let total = service.basePrice;

    // Add feature costs
    selectedFeatures.forEach((featureId) => {
      const feature = features.find((f) => f.id === featureId);
      if (feature) total += feature.price;
    });

    // Add page costs (for websites) - ₹150 per extra page
    if (selectedService === "websites" && pages[0] > 5) {
      total += (pages[0] - 5) * 15000; // ₹150 in paise
    }

    // Apply timeline multiplier
    const timelineOption = timelines.find((t) => t.id === timeline);
    if (timelineOption) {
      total *= timelineOption.multiplier;
    }

    return Math.round(total);
  };

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const result = quoteSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    if (!selectedService) {
      toast.error("Please select a service");
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
        const result = await supabase.functions.invoke('quote-create', {
          body: {
            service_type: selectedService,
            features: selectedFeatures,
            pages: pages[0],
            timeline,
            name: formData.name,
            email: formData.email,
            details: formData.details,
            client_id: user?.id || null,
          },
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
      if (useDirectInsert) {
        if (!supabase) {
          throw new Error("Supabase client not available");
        }

        // Calculate estimate manually
        const service = services.find((s) => s.id === selectedService);
        if (!service) {
          throw new Error("Invalid service selected");
        }

        let estimatedCost = service.basePrice;
        selectedFeatures.forEach((featureId) => {
          const feature = features.find((f) => f.id === featureId);
          if (feature) estimatedCost += feature.price;
        });

        if (selectedService === "websites" && pages[0] > 5) {
          estimatedCost += (pages[0] - 5) * 15000;
        }

        const timelineOption = timelines.find((t) => t.id === timeline);
        if (timelineOption) {
          estimatedCost = Math.round(estimatedCost * timelineOption.multiplier);
        }

        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + 30);

        // Direct database insert
        const { data: quoteData, error: dbError } = await supabase
          .from('quotes')
          .insert({
            client_id: user?.id || null,
            service_type: selectedService,
            estimated_cost: estimatedCost,
            valid_until: validUntil.toISOString().split('T')[0],
            status: 'pending',
            project_details: {
              name: formData.name,
              email: formData.email,
              features: selectedFeatures,
              pages: pages[0],
              timeline,
              details: formData.details,
            },
          })
          .select()
          .single();

        if (dbError) {
          throw dbError;
        }

        data = { success: true, quote: quoteData };
        error = null;
      }

      if (error) {
        console.error("Quote submission error:", error);
        throw error;
      }

      setIsSubmitted(true);
      toast.success("Quote Request Submitted!", {
        description: "We'll review your requirements and get back to you within 24 hours.",
      });
    } catch (error: any) {
      console.error("Error submitting quote:", error);
      
      // More specific error messages
      let errorMessage = "Failed to submit quote. Please try again.";
      let errorDescription = "If the problem persists, please contact us directly.";
      
      if (error?.message) {
        if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = "Network error";
          errorDescription = "Please check your internet connection and try again.";
        } else if (error.message.includes('permission') || error.message.includes('row-level security')) {
          errorMessage = "Permission denied";
          errorDescription = "You may not have permission to submit quotes. Please contact support.";
        } else {
          errorMessage = error.message;
        }
      } else if (error?.error) {
        errorMessage = error.error;
      }
      
      toast.error(errorMessage, {
        description: errorDescription,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const estimate = calculateEstimate();

  if (isSubmitted) {
    return (
      <Layout>
        <section className="pt-32 pb-16 min-h-screen">
          <div className="container mx-auto px-4">
            <Card className="max-w-lg mx-auto bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Quote Request Submitted!</h2>
                <p className="text-muted-foreground mb-4">
                  Thank you for your interest. We'll review your requirements and send you a detailed proposal within 24 hours.
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Estimated budget: <span className="font-bold text-primary">{formatINR(estimate)}</span>
                </p>
                <Button onClick={() => setIsSubmitted(false)} variant="outline">
                  Submit Another Quote
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
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
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Get Your <span className="gradient-text">Quote</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Use our calculator to get an instant estimate in INR, then submit for a
              detailed proposal.
            </p>
          </div>
        </div>
      </section>

      {/* Quote Calculator */}
      <Section>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Calculator */}
            <div className="lg:col-span-2 space-y-8">
              {/* Service Selection */}
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                      1
                    </span>
                    Select Service
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={selectedService}
                    onValueChange={setSelectedService}
                    className="grid sm:grid-cols-2 gap-4"
                  >
                    {services.map((service) => (
                      <div key={service.id} className="relative">
                        <RadioGroupItem
                          value={service.id}
                          id={service.id}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={service.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all"
                        >
                          <span>{service.label}</span>
                          <span className="text-primary font-semibold">
                            {service.displayPrice}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Features */}
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                      2
                    </span>
                    Add Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {features.map((feature) => (
                      <div
                        key={feature.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={feature.id}
                            checked={selectedFeatures.includes(feature.id)}
                            onCheckedChange={() => handleFeatureToggle(feature.id)}
                          />
                          <Label htmlFor={feature.id} className="cursor-pointer">
                            {feature.label}
                          </Label>
                        </div>
                        <span className="text-muted-foreground text-sm">
                          +{feature.displayPrice}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pages (for websites) */}
              {selectedService === "websites" && (
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                        3
                      </span>
                      Number of Pages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Slider
                        value={pages}
                        onValueChange={setPages}
                        min={1}
                        max={30}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {pages[0]} pages
                        </span>
                        <span className="text-muted-foreground">
                          {pages[0] > 5 && `+₹${((pages[0] - 5) * 150).toLocaleString('en-IN')} for extra pages`}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Timeline */}
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                      {selectedService === "websites" ? "4" : "3"}
                    </span>
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={timeline}
                    onValueChange={setTimeline}
                    className="space-y-3"
                  >
                    {timelines.map((option) => (
                      <div key={option.id} className="relative">
                        <RadioGroupItem
                          value={option.id}
                          id={option.id}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={option.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all"
                        >
                          <span>{option.label}</span>
                          {option.multiplier > 1 && (
                            <span className="text-warning text-sm">
                              +{(option.multiplier - 1) * 100}%
                            </span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Estimate Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-primary" />
                      Estimate
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {selectedService ? (
                      <>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Base Price</span>
                            <span>
                              {services.find((s) => s.id === selectedService)?.displayPrice}
                            </span>
                          </div>
                          {selectedFeatures.length > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Features</span>
                              <span>
                                +{formatINR(selectedFeatures.reduce((sum, id) => {
                                  const feature = features.find((f) => f.id === id);
                                  return sum + (feature?.price || 0);
                                }, 0))}
                              </span>
                            </div>
                          )}
                          {selectedService === "websites" && pages[0] > 5 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Extra Pages</span>
                              <span>+₹{((pages[0] - 5) * 150).toLocaleString('en-IN')}</span>
                            </div>
                          )}
                          {timeline !== "standard" && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Rush Fee</span>
                              <span className="text-warning">
                                +{(timelines.find((t) => t.id === timeline)!.multiplier - 1) * 100}%
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="border-t border-border pt-4">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">Total Estimate</span>
                            <span className="text-3xl font-bold gradient-text">
                              {formatINR(estimate)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            *This is an estimate. Final price may vary based on specific requirements.
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Select a service to see your estimate
                      </p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name *</Label>
                        <Input 
                          id="name" 
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe" 
                          className={errors.name ? "border-destructive" : ""}
                        />
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                          className={errors.email ? "border-destructive" : ""}
                        />
                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="details">Project Details</Label>
                        <Textarea
                          id="details"
                          value={formData.details}
                          onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                          placeholder="Tell us about your project..."
                          rows={3}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full glow-primary"
                        disabled={isSubmitting}
                        onClick={(e) => {
                          if (!selectedService) {
                            e.preventDefault();
                            toast.error("Please select a service first");
                            return;
                          }
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Request Quote
                            <Send className="ml-2 w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
