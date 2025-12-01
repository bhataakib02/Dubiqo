import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Clock, Zap, Wrench, CheckCircle2, TrendingUp, AlertTriangle, HeartHandshake } from "lucide-react";

const Maintenance = () => {
  const whyMaintenance = [
    {
      icon: Shield,
      title: "Security Updates",
      description: "Regular patches protect your site from vulnerabilities and threats",
    },
    {
      icon: Zap,
      title: "Performance Optimization",
      description: "Keep your site fast with ongoing speed improvements and monitoring",
    },
    {
      icon: AlertTriangle,
      title: "Prevent Problems",
      description: "Catch issues early before they become expensive emergencies",
    },
    {
      icon: HeartHandshake,
      title: "Peace of Mind",
      description: "Focus on your business while experts handle your website",
    },
  ];

  const plans = [
    {
      name: "Basic Care",
      price: "₹2,999",
      period: "per month",
      description: "Essential maintenance for small websites",
      features: [
        "Weekly backups",
        "Monthly security updates",
        "Uptime monitoring (99.5%)",
        "Plugin & theme updates",
        "1 hour of changes/fixes",
        "Email support (48h response)",
        "Monthly performance report",
      ],
      bestFor: "Personal websites, portfolios",
    },
    {
      name: "Professional",
      price: "₹5,999",
      period: "per month",
      description: "Complete protection for business sites",
      popular: true,
      features: [
        "Daily backups",
        "Weekly security scans",
        "Uptime monitoring (99.9%)",
        "All updates & patches",
        "3 hours of changes/fixes",
        "Priority support (24h response)",
        "Weekly performance reports",
        "Content updates included",
        "Speed optimization",
      ],
      bestFor: "Business websites, e-commerce",
    },
    {
      name: "Enterprise",
      price: "₹12,999",
      period: "per month",
      description: "Premium support for mission-critical sites",
      features: [
        "Real-time backups",
        "Daily security monitoring",
        "Uptime guarantee (99.99%)",
        "Proactive maintenance",
        "10 hours of changes/fixes",
        "24/7 emergency support",
        "Dedicated account manager",
        "Advanced analytics",
        "SEO monitoring",
        "Database optimization",
      ],
      bestFor: "High-traffic sites, SaaS platforms",
    },
  ];

  const whatWeHandle = [
    "Software and security updates",
    "Regular backups and disaster recovery",
    "Performance monitoring and optimization",
    "Uptime monitoring and alerts",
    "Broken link checks and fixes",
    "Form testing and validation",
    "Browser compatibility testing",
    "Mobile responsiveness checks",
    "Content updates and changes",
    "Plugin and theme updates",
    "Database optimization",
    "SSL certificate renewal",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4">
              <Wrench className="h-16 w-16 text-primary mx-auto mb-4" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Website Maintenance & Support
            </h1>
            <p className="text-xl text-foreground/70 mb-8">
              Keep your website secure, fast, and running smoothly with our ongoing maintenance plans. Regular updates, backups, and expert support—so you never have to worry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gradient-primary">
                <Link to="/quote">Choose Your Plan</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/50">
                <Link to="/contact">Talk to Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Maintenance */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Website Maintenance Matters</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Websites need regular care just like cars need servicing
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyMaintenance.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="glass border-border/40 text-center">
                  <CardHeader>
                    <div className="mx-auto h-14 w-14 rounded-xl gradient-primary flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="pt-2">{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Maintenance Plans</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Choose the right level of support for your website
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`glass border-border/40 hover:border-primary/50 transition-all duration-300 ${
                  plan.popular ? 'border-primary/50 ring-2 ring-primary/20 scale-105' : ''
                }`}
              >
                <CardHeader>
                  {plan.popular && (
                    <div className="inline-block mb-2">
                      <span className="text-xs font-bold px-3 py-1 gradient-primary text-primary-foreground rounded-full">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="pt-4">
                    <span className="text-4xl font-bold text-gradient">{plan.price}</span>
                    <span className="text-foreground/60 ml-2">{plan.period}</span>
                  </div>
                  <CardDescription className="pt-2 text-base">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-border/40">
                    <p className="text-xs text-foreground/60 mb-3">Best for:</p>
                    <p className="text-sm font-medium">{plan.bestFor}</p>
                  </div>
                  
                  <Button asChild className="w-full gradient-primary" size="lg">
                    <Link to="/quote">Choose {plan.name}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What We Handle */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Take Care Of</h2>
              <p className="text-foreground/70">
                Comprehensive maintenance covering every aspect of your website
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {whatWeHandle.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 glass rounded-xl border-border/40">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Add-Ons */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Optional Add-Ons</h2>
              <p className="text-foreground/70">
                Enhance your plan with additional services
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass border-border/40">
                <CardHeader>
                  <CardTitle className="text-xl">SEO Monitoring</CardTitle>
                  <div className="text-2xl font-bold text-gradient pt-2">+₹2,999/mo</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      <span className="text-sm">Keyword ranking tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      <span className="text-sm">Monthly SEO reports</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      <span className="text-sm">Optimization recommendations</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="glass border-border/40">
                <CardHeader>
                  <CardTitle className="text-xl">Content Updates</CardTitle>
                  <div className="text-2xl font-bold text-gradient pt-2">+₹1,999/mo</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      <span className="text-sm">4 hours of content changes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      <span className="text-sm">Text and image updates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      <span className="text-sm">New page creation</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="glass border-border/40">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">With vs Without Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold text-lg mb-4 text-destructive flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Without Maintenance
                    </h3>
                    <ul className="space-y-3 text-sm text-foreground/70">
                      <li>• Security vulnerabilities exposed</li>
                      <li>• Slow loading speeds</li>
                      <li>• Unexpected downtime</li>
                      <li>• Broken features go unnoticed</li>
                      <li>• No backups = risk of data loss</li>
                      <li>• Expensive emergency fixes</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg mb-4 text-primary flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      With Maintenance
                    </h3>
                    <ul className="space-y-3 text-sm">
                      <li>• Always secure and protected</li>
                      <li>• Fast and optimized performance</li>
                      <li>• 99.9%+ uptime guaranteed</li>
                      <li>• Issues caught and fixed early</li>
                      <li>• Automatic backups & recovery</li>
                      <li>• Predictable monthly cost</li>
                    </ul>
                  </div>
                </div>
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
                "We used to worry constantly about our website going down or getting hacked. Since signing up for Dubiqo's Professional maintenance plan, we've had zero issues. Everything just works, and we get a detailed monthly report showing everything they've done. Totally worth it."
              </p>
              <div>
                <p className="font-semibold">Neha Gupta</p>
                <p className="text-sm text-foreground/60">Owner, Bella Fashion Boutique</p>
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
            Stop Worrying About Your Website
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Let our experts handle maintenance while you focus on growing your business
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/quote">Choose Your Plan</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/contact">Talk to an Expert</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Maintenance;
