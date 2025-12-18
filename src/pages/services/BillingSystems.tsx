import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Receipt, FileText, Users, TrendingUp, Zap, CheckCircle2, Shield } from "lucide-react";

const BillingSystems = () => {
  const features = [
    { icon: Receipt, title: "Invoice Management", description: "Create and track invoices easily" },
    { icon: Users, title: "Client Database", description: "Organized client information" },
    { icon: CreditCard, title: "Payment Integration", description: "Razorpay, Stripe, PayPal ready" },
    { icon: FileText, title: "Reports & Analytics", description: "Track revenue and payments" },
  ];

  const useCases = [
    {
      title: "Freelancers",
      description: "Manage clients, send invoices, and track payments in one place",
      includes: ["Client management", "Professional invoices", "Payment tracking", "Expense logging"],
    },
    {
      title: "Small Agencies",
      description: "Handle multiple projects and clients with ease",
      includes: ["Project-based billing", "Team time tracking", "Recurring invoices", "Client portal access"],
    },
    {
      title: "Consultants",
      description: "Simple billing for hourly or project-based work",
      includes: ["Hourly rate calculator", "Proposal templates", "Payment reminders", "Tax calculations"],
    },
  ];

  const systemFeatures = [
    "Generate professional PDF invoices",
    "Send payment links via email or WhatsApp",
    "Track paid, pending, and overdue invoices",
    "Multi-currency support",
    "Automated payment reminders",
    "Expense tracking and profit calculation",
    "Client portal for viewing invoices",
    "Integration with payment gateways",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4">
              <CreditCard className="h-16 w-16 text-primary mx-auto mb-4" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Billing & Payment Systems
            </h1>
            <p className="text-xl text-foreground/70 mb-8">
              Custom billing dashboards that make invoicing painless. Manage clients, track payments, and get paid faster with our intuitive billing solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gradient-primary">
                <Link to="/quote">Get a Custom Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/50">
                <Link to="/payment-demo">View Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Features</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Everything you need to manage your billing professionally
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="glass border-border/40 text-center">
                  <CardHeader>
                    <div className="mx-auto h-14 w-14 rounded-xl gradient-primary flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Perfect For</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Built for professionals who need simple, effective billing
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="glass border-border/40 hover:border-primary/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">{useCase.title}</CardTitle>
                  <CardDescription className="pt-2">{useCase.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {useCase.includes.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground/70">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete Billing Solution</h2>
              <p className="text-foreground/70">
                Every system we build includes these powerful features
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {systemFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-4 glass rounded-xl border-border/40">
                  <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Payment Integration */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="glass border-primary/50">
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl">Secure Payment Integration</CardTitle>
                <CardDescription className="pt-2 text-base">
                  We integrate with trusted payment gateways so you can accept payments directly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap justify-center gap-6 pt-4">
                  <div className="px-6 py-3 glass rounded-xl border-border/40 font-medium">
                    Razorpay
                  </div>
                  <div className="px-6 py-3 glass rounded-xl border-border/40 font-medium">
                    Stripe
                  </div>
                  <div className="px-6 py-3 glass rounded-xl border-border/40 font-medium">
                    PayPal
                  </div>
                  <div className="px-6 py-3 glass rounded-xl border-border/40 font-medium">
                    Bank Transfer
                  </div>
                </div>
                <p className="text-center text-sm text-foreground/60 mt-6">
                  All integrations follow industry-standard security practices
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Custom Pricing</h2>
              <p className="text-foreground/70">
                Every billing system is tailored to your specific needs
              </p>
            </div>
            
            <Card className="glass border-border/40">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-border/40">
                    <span className="font-medium">Basic Billing Dashboard</span>
                    <span className="text-xl font-bold text-gradient">From ₹14,999</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-border/40">
                    <span className="font-medium">Advanced with Payment Gateway</span>
                    <span className="text-xl font-bold text-gradient">From ₹24,999</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Enterprise Multi-User System</span>
                    <span className="text-xl font-bold text-gradient">Custom Quote</span>
                  </div>
                </div>
                <p className="text-sm text-foreground/60 mt-6 text-center">
                  All packages include design, development, testing, and 30 days support
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="glass border-border/40 max-w-3xl mx-auto">
            <CardContent className="p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <TrendingUp key={i} className="h-5 w-5 text-primary" />
                ))}
              </div>
              <p className="text-lg text-foreground/80 mb-4">
                "Before Dubiqo, I was using spreadsheets and sending manual invoices. Their custom billing system changed everything. I now track all my clients, send professional invoices in minutes, and get paid 50% faster. Best investment for my freelance business!"
              </p>
              <div>
                <p className="font-semibold">Priya Sharma</p>
                <p className="text-sm text-foreground/60">Freelance Graphic Designer, Mumbai</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Simplify Your Billing?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Let's build a billing system that saves you time and helps you get paid faster
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/quote">Get a Quote</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/payment-demo">View Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BillingSystems;
