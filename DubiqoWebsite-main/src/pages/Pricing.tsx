import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Sparkles } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "₹4,999",
      description: "Perfect for simple websites and portfolios",
      features: [
        "1-page website or portfolio",
        "Responsive design (mobile, tablet, desktop)",
        "Contact form integration",
        "Basic animations",
        "5-7 days delivery",
        "2 rounds of revisions",
        "14 days post-launch support",
        "Code ownership",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Professional",
      price: "₹9,999",
      description: "For businesses that need more features",
      features: [
        "3-5 page website",
        "Custom layout + animations",
        "Multiple contact/enquiry forms",
        "Blog integration (optional)",
        "Basic SEO optimization",
        "Google Analytics setup",
        "2-3 weeks delivery",
        "3 rounds of revisions",
        "30 days post-launch support",
        "Code ownership + documentation",
      ],
      cta: "Get Started",
      popular: true,
    },
    {
      name: "Business / Custom",
      price: "₹14,999+",
      description: "Advanced websites and custom solutions",
      features: [
        "Advanced multi-page website OR",
        "Dashboard/admin panel OR",
        "Billing/payment system",
        "Custom features & integrations",
        "Payment gateway integration (UI)",
        "User authentication (if needed)",
        "Advanced animations & interactions",
        "Priority support",
        "4-8 weeks delivery (based on scope)",
        "Unlimited revisions",
        "60 days post-launch support",
        "Full documentation + training",
      ],
      cta: "Contact Us",
      popular: false,
    },
  ];

  const addons = [
    { name: "Additional page", price: "₹500 - ₹1,000/page" },
    { name: "Blog setup (5 sample posts)", price: "₹1,500" },
    { name: "E-commerce UI (product pages only)", price: "₹3,000+" },
    { name: "Advanced animations", price: "₹1,000 - ₹2,000" },
    { name: "Payment integration (Razorpay/Stripe)", price: "₹2,000" },
    { name: "Urgent delivery (rush fee)", price: "25-50% extra" },
  ];

  const faqs = [
    {
      q: "What payment schedule do you follow?",
      a: "50% upfront to start the project, 50% upon completion and your approval. We accept bank transfer, UPI, and online payments.",
    },
    {
      q: "How many revisions are included?",
      a: "Starter: 2 rounds, Professional: 3 rounds, Business/Custom: unlimited revisions until you're satisfied.",
    },
    {
      q: "What if I need changes after the project is done?",
      a: "Minor changes are free during the support period. Major changes or new features can be added at an hourly rate of ₹500-800/hour.",
    },
    {
      q: "Do you offer refunds?",
      a: "If we haven't started work, we offer a full refund minus payment processing fees. Once work begins, refunds are evaluated case-by-case based on progress. See our refund policy for details.",
    },
    {
      q: "Can I upgrade my plan later?",
      a: "Absolutely! You can upgrade anytime. We'll credit what you've already paid toward the higher plan.",
    },
    {
      q: "Do you work with international clients?",
      a: "Yes! We work with clients worldwide. Pricing for international clients is in USD (approximately $60, $120, $180+ for the three plans).",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Simple & Transparent Pricing
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
            No hidden fees, no surprises. Choose the plan that fits your needs, or get a custom quote for your project.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`glass ${
                  plan.popular ? "border-primary glow relative" : "border-border/40"
                } hover:border-primary/50 transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-primary rounded-full text-xs font-semibold text-primary-foreground flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-gradient pt-2">{plan.price}</div>
                  <CardDescription className="pt-2 text-base">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground/80">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    asChild
                    className={plan.popular ? "w-full gradient-primary" : "w-full"}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    <Link to={plan.name === "Business / Custom" ? "/contact" : "/quote"}>
                      {plan.cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-foreground/70 mb-4">Need something different?</p>
            <Button asChild size="lg" variant="outline" className="border-primary/50">
              <Link to="/quote">Get a Custom Quote</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Additional Services</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Enhance your website with these optional add-ons
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {addons.map((addon, index) => (
              <Card key={index} className="glass border-border/40">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{addon.name}</CardTitle>
                    <span className="text-sm font-semibold text-primary">{addon.price}</span>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Payment & Revision Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <Card className="glass border-border/40">
              <CardHeader>
                <CardTitle>Payment Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-foreground/80">
                <p>• 50% upfront payment to begin work</p>
                <p>• 50% upon project completion and approval</p>
                <p>• Accepted methods: Bank transfer, UPI, Razorpay</p>
                <p>• International: PayPal, Wise, or bank transfer</p>
              </CardContent>
            </Card>
            
            <Card className="glass border-border/40">
              <CardHeader>
                <CardTitle>Revision Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-foreground/80">
                <p>• Revisions included as per your plan</p>
                <p>• Each revision round: minor changes across the site</p>
                <p>• Major scope changes may incur extra charges</p>
                <p>• Post-launch changes: charged at hourly rates</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pricing FAQs</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Common questions about pricing and payments
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="glass border-border/40">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.q}</CardTitle>
                  <CardDescription className="pt-2 text-foreground/70">{faq.a}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="glass border-primary glow">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Project?</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto mb-8">
                Get a detailed quote tailored to your specific requirements
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gradient-primary">
                  <Link to="/quote">Get a Quote</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary/50">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
