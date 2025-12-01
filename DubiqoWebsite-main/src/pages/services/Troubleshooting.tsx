import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Zap, Clock, Shield, CheckCircle2, Wrench, Bug, TrendingUp } from "lucide-react";

const Troubleshooting = () => {
  const services = [
    { icon: Bug, title: "Bug Fixing", description: "Identify and fix errors fast" },
    { icon: Zap, title: "Performance", description: "Speed up slow websites" },
    { icon: Shield, title: "Security Issues", description: "Fix vulnerabilities" },
    { icon: Wrench, title: "Broken Features", description: "Restore functionality" },
  ];

  const commonProblems = [
    {
      title: "Website Not Loading",
      description: "Site is down, shows errors, or displays blank pages",
      solutions: [
        "Server and hosting diagnostics",
        "Database connection fixes",
        "DNS and domain troubleshooting",
        "Emergency recovery and rollback",
      ],
    },
    {
      title: "Slow Performance",
      description: "Website takes too long to load or feels sluggish",
      solutions: [
        "Page speed optimization",
        "Image compression and lazy loading",
        "Code minification and caching",
        "Database query optimization",
      ],
    },
    {
      title: "Forms Not Working",
      description: "Contact forms, payment forms, or submissions failing",
      solutions: [
        "Form validation fixes",
        "Email integration repair",
        "CAPTCHA and spam filter setup",
        "Payment gateway debugging",
      ],
    },
    {
      title: "Mobile Display Issues",
      description: "Site looks broken or doesn't work on phones/tablets",
      solutions: [
        "Responsive design fixes",
        "Mobile navigation repair",
        "Touch interaction debugging",
        "Cross-device testing",
      ],
    },
    {
      title: "Security Breaches",
      description: "Site hacked, malware detected, or unauthorized access",
      solutions: [
        "Malware removal and cleanup",
        "Security patch installation",
        "Password and access reset",
        "Future prevention measures",
      ],
    },
    {
      title: "Broken After Update",
      description: "Issues appeared after plugin, theme, or code updates",
      solutions: [
        "Compatibility testing",
        "Version rollback if needed",
        "Code conflict resolution",
        "Safe update procedures",
      ],
    },
  ];

  const supportLevels = [
    {
      title: "Emergency Support",
      time: "Response within 2 hours",
      description: "For critical issues affecting your business",
      price: "₹2,999",
      includes: ["Immediate response", "Priority handling", "After-hours available", "Phone support"],
    },
    {
      title: "Standard Support",
      time: "Response within 24 hours",
      description: "For non-urgent fixes and improvements",
      price: "₹1,499",
      includes: ["Same-day response", "Business hours support", "Email & chat support", "Follow-up included"],
    },
    {
      title: "Investigation Only",
      time: "Diagnostic report in 48 hours",
      description: "Not sure what's wrong? We'll investigate",
      price: "₹999",
      includes: ["Detailed diagnosis", "Problem identification", "Solution recommendations", "Fix estimate"],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-destructive/10 via-background to-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4">
              <AlertCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Bug Fixing & Troubleshooting
            </h1>
            <p className="text-xl text-foreground/70 mb-8">
              Website broken? We fix it fast. From critical errors to performance issues, our experts solve problems that keep your site from working properly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gradient-primary">
                <Link to="/contact">Get Emergency Help</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/50">
                <Link to="/support">View Support Options</Link>
              </Button>
            </div>
            
            <div className="mt-8 inline-flex items-center gap-2 text-sm text-primary px-4 py-2 glass rounded-full border border-primary/20">
              <Clock className="h-4 w-4" />
              <span>Emergency support available 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Fix</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              From critical errors to optimization issues
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="glass border-border/40 text-center">
                  <CardHeader>
                    <div className="mx-auto h-14 w-14 rounded-xl gradient-primary flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Common Problems */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Common Problems We Solve</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Recognize any of these issues?
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {commonProblems.map((problem, index) => (
              <Card key={index} className="glass border-border/40 hover:border-primary/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">{problem.title}</CardTitle>
                  <CardDescription className="pt-2">{problem.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-primary mb-2">Our Solutions:</p>
                    {problem.solutions.map((solution, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground/70">{solution}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Levels */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Support Packages</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Choose the right support level for your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {supportLevels.map((level, index) => (
              <Card 
                key={index} 
                className={`glass border-border/40 hover:border-primary/50 transition-all duration-300 ${
                  index === 0 ? 'border-primary/50 ring-2 ring-primary/20' : ''
                }`}
              >
                <CardHeader>
                  {index === 0 && (
                    <div className="inline-block mb-2">
                      <span className="text-xs font-bold px-3 py-1 gradient-primary text-primary-foreground rounded-full">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <CardTitle className="text-2xl">{level.title}</CardTitle>
                  <div className="text-3xl font-bold text-gradient pt-2">{level.price}</div>
                  <CardDescription className="pt-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    {level.time}
                  </CardDescription>
                  <CardDescription className="pt-1">{level.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {level.includes.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                  <Button asChild className="w-full mt-6 gradient-primary" size="lg">
                    <Link to="/contact">Get Support</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Work</h2>
              <p className="text-foreground/70">
                Fast, transparent problem-solving process
              </p>
            </div>
            
            <div className="space-y-6">
              <Card className="glass border-border/40">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold">
                      1
                    </div>
                    <div>
                      <CardTitle>Contact & Assessment</CardTitle>
                      <CardDescription className="pt-2">
                        Tell us what's wrong. We'll ask key questions to understand the issue and assess urgency.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
              
              <Card className="glass border-border/40">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold">
                      2
                    </div>
                    <div>
                      <CardTitle>Diagnosis & Quote</CardTitle>
                      <CardDescription className="pt-2">
                        We investigate the problem, identify root causes, and provide a clear fix estimate and timeline.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
              
              <Card className="glass border-border/40">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold">
                      3
                    </div>
                    <div>
                      <CardTitle>Fix & Test</CardTitle>
                      <CardDescription className="pt-2">
                        Our team resolves the issue, tests thoroughly, and ensures everything works correctly.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
              
              <Card className="glass border-border/40">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold">
                      4
                    </div>
                    <div>
                      <CardTitle>Follow-Up Support</CardTitle>
                      <CardDescription className="pt-2">
                        We monitor for 7 days after the fix to ensure the problem doesn't return. You're covered.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <Card className="glass border-border/40 max-w-3xl mx-auto">
            <CardContent className="p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <TrendingUp key={i} className="h-5 w-5 text-primary" />
                ))}
              </div>
              <p className="text-lg text-foreground/80 mb-4">
                "Our website crashed late Friday evening before a big launch weekend. I panicked and contacted Dubiqo. They responded within an hour, diagnosed the issue, and had us back online in 3 hours. Absolutely saved our launch. I can't thank them enough!"
              </p>
              <div>
                <p className="font-semibold">Rahul Kapoor</p>
                <p className="text-sm text-foreground/60">Founder, TechStart India</p>
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
            Need Urgent Help Right Now?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Don't let website issues hurt your business. Get expert help today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/contact">Get Emergency Support</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/support">View All Support Options</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Troubleshooting;
