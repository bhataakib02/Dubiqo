import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, ArrowRight, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type PricingPlan = {
  id: string;
  name: string;
  price_cents: number | null;
  interval: string | null;
  currency: string | null;
  features: string[] | null;
  active: boolean | null;
  metadata?: any;
};

type DiscountBanner = {
  title: string;
  description: string;
  discount_percent: number;
  active: boolean;
};

const addOns = [
  { name: "Extra Pages", price: "₹150/page" },
  { name: "E-Commerce Integration", price: "From ₹1,499" },
  { name: "Custom Animations", price: "From ₹499" },
  { name: "API Integration", price: "From ₹999" },
  { name: "Monthly Maintenance", price: "From ₹199/mo" },
  { name: "Content Writing", price: "₹75/page" },
];

const faqs = [
  {
    question: "How long does a typical project take?",
    answer: "Project timelines vary based on complexity. A simple website takes 2-3 weeks, while complex web applications can take 2-3 months. We'll provide a detailed timeline during our initial consultation.",
  },
  {
    question: "Do you offer payment plans?",
    answer: "Yes! We offer flexible payment plans. Typically, we require 50% upfront and 50% upon completion. For larger projects, we can arrange milestone-based payments.",
  },
  {
    question: "What's included in the support period?",
    answer: "Support includes bug fixes, minor content updates, and technical assistance. Major feature additions or redesigns are quoted separately.",
  },
  {
    question: "Can I upgrade my plan later?",
    answer: "Absolutely! You can upgrade at any time. We'll assess your current site and provide a quote for the additional features you need.",
  },
  {
    question: "Do you work with international clients?",
    answer: "Yes, we work with clients worldwide. We use modern collaboration tools and adjust to different time zones as needed.",
  },
];

const formatPrice = (priceCents: number | null, currency: string | null) => {
  if (priceCents === null) return "Custom";
  const rupees = priceCents / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency || 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(rupees);
};

export default function Pricing() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [discountBanner, setDiscountBanner] = useState<DiscountBanner | null>(null);

  useEffect(() => {
    loadPlans();
    loadDiscountBanner();
  }, []);

  const loadDiscountBanner = async () => {
    if (!supabase) return;
    try {
      // First, get the active discount key
      const { data: activeData, error: activeError } = await supabase
        .from('feature_flags' as any)
        .select('key, description, enabled')
        .eq('key', 'pricing_discount_active')
        .eq('enabled', true)
        .maybeSingle();
      
      if (activeError || !activeData || !activeData.description) {
        return;
      }
      
      const activeKey = activeData.description;
      
      // Then, get the actual discount banner
      const { data, error } = await supabase
        .from('feature_flags' as any)
        .select('key, description, enabled')
        .eq('key', activeKey)
        .eq('enabled', true)
        .maybeSingle();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return;
        }
        console.error('Error loading discount banner:', error);
        return;
      }
      
      if (data && data.description && data.enabled) {
        try {
          const banner = JSON.parse(data.description) as DiscountBanner;
          if (banner.active) {
            setDiscountBanner(banner);
          }
        } catch (parseError) {
          console.warn('Failed to parse discount banner data:', parseError);
        }
      }
    } catch (err) {
      console.error('Error loading discount banner:', err);
    }
  };

  const loadPlans = async () => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }
    
    try {
      // Load all active plans, then filter by published status
      const { data, error } = await supabase
        .from('pricing_plans' as any)
        .select('*')
        .eq('active', true)
        .order('price_cents', { ascending: true });
      
      if (error) {
        console.error('Error loading pricing plans:', error);
        throw error;
      }
      
      // Filter to only show published plans
      // If published field doesn't exist (backward compatibility), show all active plans
      // Otherwise, only show plans where published is explicitly true
      const publishedPlans = (data || []).filter((plan: any) => {
        // If published field doesn't exist in the plan object, show it (backward compatibility)
        if (!('published' in plan)) {
          return true;
        }
        // Otherwise, only show if published is explicitly true
        return plan.published === true;
      }) as unknown as PricingPlan[];
      
      setPlans(publishedPlans);
    } catch (error) {
      console.error('Error loading pricing plans:', error);
      // Fallback to empty array if database fails
      setPlans([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine if a plan is popular (middle plan if 3 or more, or first if less)
  const getPopularIndex = () => {
    if (plans.length >= 3) return 1;
    if (plans.length === 2) return 0;
    return -1;
  };

  const popularIndex = getPopularIndex();

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Simple, Transparent <span className="gradient-text">Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              No hidden fees. No surprises. Choose the plan that fits your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Discount Banner - Price Tag Style */}
      {discountBanner && discountBanner.active && (
        <div className="fixed top-24 right-6 z-50 animate-bounce">
          <Link to="/quote" className="block cursor-pointer">
            <div className="relative w-56 h-40 shadow-lg transform rotate-[-2deg] hover:rotate-0 transition-all duration-300 hover:scale-105 glow-primary">
              {/* Price Tag Shape with V-notch - Using website primary gradient */}
              <div className="relative w-full h-full gradient-primary" style={{
                clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)'
              }}>
                {/* Dashed border overlay */}
                <div className="absolute inset-0 border-2 border-dashed border-white/80" style={{
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)',
                  pointerEvents: 'none'
                }}></div>
                
                {/* Silver Eyelet */}
                <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full border-2 border-gray-500 shadow-inner flex items-center justify-center z-10">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                </div>
                
                {/* String loop */}
                <div className="absolute top-0 right-3 w-1 h-5 bg-gray-700 rounded-full z-10"></div>
                
                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center px-6 py-4 text-center">
                  <div className="text-primary-foreground font-bold text-lg uppercase tracking-wider mb-1 drop-shadow-lg">
                    SPECIAL
                  </div>
                  <div className="text-primary-foreground font-bold text-2xl uppercase tracking-wider mb-2 drop-shadow-lg">
                    {discountBanner.discount_percent}% OFF
                  </div>
                  <div className="text-primary-foreground font-semibold text-sm uppercase tracking-wide drop-shadow-lg">
                    {discountBanner.title}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Pricing Cards */}
      <Section>
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-12 w-32 mb-6" />
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No pricing plans available at the moment.</p>
              <p className="text-muted-foreground text-sm mt-2">Please check back later or contact us for a custom quote.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <Card
                  key={plan.id}
                  className={cn(
                    "relative bg-card/50 backdrop-blur border-border/50 transition-all",
                    index === popularIndex && "border-primary/50 glow-border scale-105"
                  )}
                >
                  {index === popularIndex && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>
                      {plan.features && plan.features.length > 0 && plan.features[0].length > 30
                        ? plan.features[0]
                        : `Perfect for your needs`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <span className="text-4xl font-bold">
                        {formatPrice(plan.price_cents, plan.currency)}
                      </span>
                      {plan.price_cents !== null && plan.interval && (
                        <span className="text-muted-foreground text-sm ml-2">
                          /{plan.interval}
                        </span>
                      )}
                      {plan.price_cents === null && (
                        <span className="text-muted-foreground text-sm ml-2">
                          contact us
                        </span>
                      )}
                    </div>
                    
                    {plan.features && plan.features.length > 0 && (
                      <ul className="space-y-3">
                        {/* Skip first feature if it's a description (longer than 30 chars) */}
                        {plan.features
                          .filter((feature, idx) => idx !== 0 || feature.length <= 30)
                          .map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                              <span className="text-sm text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                      </ul>
                    )}
                    
                    <Button
                      className={cn("w-full", index === popularIndex && "glow-primary")}
                      variant={index === popularIndex ? "default" : "outline"}
                      asChild
                    >
                      <Link to={plan.price_cents === null ? "/contact" : "/quote"}>
                        {plan.price_cents === null ? "Contact Sales" : "Get Started"}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Add-ons */}
      <Section variant="muted">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="Add-ons"
            title="Enhance your project"
            subtitle="Need something extra? Add these features to any plan."
          />
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {addOns.map((addon) => (
              <Card key={addon.name} className="bg-card/50 backdrop-blur border-border/50">
                <CardContent className="flex items-center justify-between p-4">
                  <span className="font-medium">{addon.name}</span>
                  <span className="text-primary font-semibold">{addon.price}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQs */}
      <Section>
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="FAQ"
            title="Frequently Asked Questions"
            subtitle="Got questions? We've got answers."
          />
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card/50 backdrop-blur border border-border/50 rounded-lg px-6"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <span className="text-left font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Get a personalized quote for your project. No commitment required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="glow-primary" asChild>
              <Link to="/quote">Get Your Free Quote</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/booking">Book a Consultation</Link>
            </Button>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
