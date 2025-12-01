import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { Calculator, Send, CheckCircle } from "lucide-react";

const services = [
  { id: "websites", label: "Custom Website", basePrice: 2499 },
  { id: "web-apps", label: "Web Application", basePrice: 7999 },
  { id: "dashboards", label: "Dashboard", basePrice: 4999 },
  { id: "ecommerce", label: "E-Commerce", basePrice: 5999 },
  { id: "repair", label: "Site Repair", basePrice: 499 },
  { id: "maintenance", label: "Maintenance", basePrice: 199 },
];

const features = [
  { id: "cms", label: "Content Management System", price: 500 },
  { id: "auth", label: "User Authentication", price: 800 },
  { id: "payments", label: "Payment Integration", price: 1000 },
  { id: "analytics", label: "Advanced Analytics", price: 400 },
  { id: "seo", label: "SEO Optimization", price: 600 },
  { id: "api", label: "API Integration", price: 1200 },
];

const timelines = [
  { id: "standard", label: "Standard (4-6 weeks)", multiplier: 1 },
  { id: "rush", label: "Rush (2-3 weeks)", multiplier: 1.5 },
  { id: "urgent", label: "Urgent (1-2 weeks)", multiplier: 2 },
];

export default function Quote() {
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get("service") || "";
  
  const [selectedService, setSelectedService] = useState(initialService);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [timeline, setTimeline] = useState("standard");
  const [pages, setPages] = useState([5]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const calculateEstimate = () => {
    const service = services.find((s) => s.id === selectedService);
    if (!service) return 0;

    let total = service.basePrice;

    // Add feature costs
    selectedFeatures.forEach((featureId) => {
      const feature = features.find((f) => f.id === featureId);
      if (feature) total += feature.price;
    });

    // Add page costs (for websites)
    if (selectedService === "websites" && pages[0] > 5) {
      total += (pages[0] - 5) * 150;
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
    setIsSubmitting(true);

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Quote Request Submitted!",
      description: "We'll review your requirements and get back to you within 24 hours.",
    });

    setIsSubmitting(false);
  };

  const estimate = calculateEstimate();

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
              Use our calculator to get an instant estimate, then submit for a
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
                            ${service.basePrice.toLocaleString()}
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
                          +${feature.price}
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
                          {pages[0] > 5 && `+$${(pages[0] - 5) * 150} for extra pages`}
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
                              ${services.find((s) => s.id === selectedService)?.basePrice.toLocaleString()}
                            </span>
                          </div>
                          {selectedFeatures.length > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Features</span>
                              <span>
                                +${selectedFeatures.reduce((sum, id) => {
                                  const feature = features.find((f) => f.id === id);
                                  return sum + (feature?.price || 0);
                                }, 0).toLocaleString()}
                              </span>
                            </div>
                          )}
                          {selectedService === "websites" && pages[0] > 5 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Extra Pages</span>
                              <span>+${((pages[0] - 5) * 150).toLocaleString()}</span>
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
                              ${estimate.toLocaleString()}
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
                        <Label htmlFor="name">Your Name</Label>
                        <Input id="name" name="name" required placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="details">Project Details</Label>
                        <Textarea
                          id="details"
                          name="details"
                          placeholder="Tell us about your project..."
                          rows={3}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full glow-primary"
                        disabled={!selectedService || isSubmitting}
                      >
                        {isSubmitting ? (
                          "Submitting..."
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
