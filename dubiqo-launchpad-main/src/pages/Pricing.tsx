import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    description: "Perfect for small businesses and startups",
    price: "$2,499",
    priceNote: "one-time",
    features: [
      "Up to 5 pages",
      "Responsive design",
      "Basic SEO setup",
      "Contact form",
      "1 month support",
      "2 revision rounds",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    description: "For growing businesses that need more",
    price: "$5,999",
    priceNote: "one-time",
    features: [
      "Up to 15 pages",
      "Custom design",
      "Advanced SEO",
      "CMS integration",
      "Analytics setup",
      "3 months support",
      "5 revision rounds",
      "Performance optimization",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "Full-featured solution for larger organizations",
    price: "Custom",
    priceNote: "contact us",
    features: [
      "Unlimited pages",
      "Custom functionality",
      "E-commerce ready",
      "API integrations",
      "Priority support",
      "Unlimited revisions",
      "SLA guarantee",
      "Dedicated manager",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const addOns = [
  { name: "Extra Pages", price: "$150/page" },
  { name: "E-Commerce Integration", price: "From $1,499" },
  { name: "Custom Animations", price: "From $499" },
  { name: "API Integration", price: "From $999" },
  { name: "Monthly Maintenance", price: "From $199/mo" },
  { name: "Content Writing", price: "$75/page" },
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

export default function Pricing() {
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

      {/* Pricing Cards */}
      <Section>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={cn(
                  "relative bg-card/50 backdrop-blur border-border/50 transition-all",
                  plan.popular && "border-primary/50 glow-border scale-105"
                )}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm ml-2">
                      {plan.priceNote}
                    </span>
                  </div>
                  
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className={cn("w-full", plan.popular && "glow-primary")}
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link to={plan.name === "Enterprise" ? "/contact" : "/quote"}>
                      {plan.cta}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
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
