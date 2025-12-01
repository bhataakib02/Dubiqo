import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2, TrendingUp, Clock, Users } from "lucide-react";

const CaseStudies = () => {
  const caseStudies = [
    {
      title: "How We Saved a Startup's Launch in 48 Hours",
      client: "TechFlow SaaS",
      industry: "Software",
      challenge: "A SaaS startup came to us 2 days before their scheduled launch with a broken codebase. Their previous developer had disappeared, leaving critical bugs and performance issues.",
      approach: [
        "Immediate assessment of the codebase and identification of critical issues",
        "Round-the-clock work by our team to fix authentication bugs",
        "Performance optimization reducing load time from 8s to 1.2s",
        "Comprehensive testing across devices and browsers",
      ],
      solution: "We worked 48 hours straight, fixing over 30 critical bugs, optimizing database queries, and implementing proper error handling. The site launched on schedule with zero downtime.",
      results: [
        { metric: "500+", label: "Signups in first week" },
        { metric: "1.2s", label: "Page load time" },
        { metric: "99.9%", label: "Uptime since launch" },
        { metric: "0", label: "Critical bugs post-launch" },
      ],
      testimonial: "Dubiqo didn't just save our launch—they saved our startup. The speed and quality of their work was unbelievable. We're now their permanent development partners.",
      tech: ["React", "Node.js", "PostgreSQL", "AWS"],
    },
    {
      title: "Portfolio That Got 10 Job Offers in 2 Months",
      client: "Arjun Reddy",
      industry: "Education",
      challenge: "Computer science student needed a portfolio for campus placements but had no web development experience. Had great projects but they weren't showcased well.",
      approach: [
        "Detailed consultation to understand his work and target companies",
        "Clean, professional design that highlights projects without clutter",
        "Integration with GitHub to show live project stats",
        "Mobile-optimized as recruiters often review on phones",
      ],
      solution: "Created a single-page portfolio with smooth animations, project cards with live demos, skills section, and a downloadable resume. Delivered in 6 days.",
      results: [
        { metric: "10", label: "Interview calls received" },
        { metric: "3", label: "Job offers" },
        { metric: "#1", label: "Portfolio featured at college" },
        { metric: "15+", label: "Projects showcased" },
      ],
      testimonial: "My portfolio became my strongest asset. Recruiters specifically mentioned how professional it looked. I'm now working at my dream company, and I credit this portfolio for getting me there.",
      tech: ["Next.js", "Framer Motion", "Tailwind CSS"],
    },
    {
      title: "Billing System That Automated 20 Hours of Weekly Work",
      client: "Creative Agency Co.",
      industry: "Marketing",
      challenge: "Small marketing agency was spending 20+ hours per week manually creating invoices, tracking payments, and following up with clients. Errors were frequent.",
      approach: [
        "Analyzed their existing invoicing workflow and pain points",
        "Designed an intuitive dashboard with client and invoice management",
        "Integrated Razorpay for online payments",
        "Set up automated email reminders for pending invoices",
      ],
      solution: "Built a custom billing system with client database, invoice generation, payment tracking, and automated reminders. All invoices are professional and branded.",
      results: [
        { metric: "20 hrs", label: "Saved per week" },
        { metric: "95%", label: "Invoices paid on time" },
        { metric: "₹0", label: "Monthly subscription costs" },
        { metric: "100%", label: "Reduction in errors" },
      ],
      testimonial: "This billing system transformed our operations. What used to take hours now takes minutes. The ROI paid for itself in the first month.",
      tech: ["React", "Razorpay", "MongoDB", "Node.js"],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Success Stories
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Real projects, real results. See how we've helped our clients solve problems and achieve their goals.
          </p>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-20">
            {caseStudies.map((study, index) => (
              <div key={index} className="max-w-5xl mx-auto">
                <Card className="glass border-border/40">
                  <CardHeader className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
                        {study.industry}
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full bg-secondary/10 text-secondary">
                        {study.client}
                      </span>
                    </div>
                    <CardTitle className="text-3xl">{study.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-8">
                    {/* Challenge */}
                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        The Challenge
                      </h3>
                      <p className="text-foreground/80">{study.challenge}</p>
                    </div>

                    {/* Approach */}
                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Our Approach
                      </h3>
                      <ul className="space-y-2">
                        {study.approach.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-foreground/80">
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Solution */}
                    <div>
                      <h3 className="text-xl font-semibold mb-3">The Solution</h3>
                      <p className="text-foreground/80">{study.solution}</p>
                    </div>

                    {/* Results */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        The Results
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {study.results.map((result, i) => (
                          <Card key={i} className="bg-muted/30 border-border/40 text-center">
                            <CardHeader className="pb-2">
                              <div className="text-3xl font-bold text-gradient">{result.metric}</div>
                              <CardDescription className="text-xs">{result.label}</CardDescription>
                            </CardHeader>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Testimonial */}
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg">
                      <p className="text-foreground/90 italic mb-2">"{study.testimonial}"</p>
                      <p className="text-sm text-foreground/60">— {study.client}</p>
                    </div>

                    {/* Tech Stack */}
                    <div>
                      <h3 className="text-sm font-semibold mb-2 text-foreground/60">Technologies Used</h3>
                      <div className="flex flex-wrap gap-2">
                        {study.tech.map((tech, i) => (
                          <span key={i} className="text-xs px-3 py-1 rounded bg-muted text-foreground/70">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <Card className="glass border-primary glow max-w-3xl mx-auto">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Write Your Success Story?
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto mb-8">
                Let's solve your problem together. Get started today.
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

export default CaseStudies;
