import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Briefcase, Star, Code, Palette, FileText, Mail, CheckCircle2, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const features = [
  { icon: Code, title: "Project Showcase", description: "Beautifully organized project galleries" },
  { icon: Palette, title: "Custom Design", description: "Tailored to your personal brand" },
  { icon: FileText, title: "Resume Section", description: "Integrated CV and experience" },
  { icon: Mail, title: "Contact Forms", description: "Easy ways for clients to reach you" },
];

const targetAudience = [
  {
    title: "Students & Fresh Graduates",
    description: "Stand out in campus placements and land your first job",
    benefit: "Perfect for showcasing college projects and internships",
  },
  {
    title: "Developers & Engineers",
    description: "Highlight your technical skills and open-source contributions",
    benefit: "GitHub integration, live demos, and technical blog",
  },
  {
    title: "Designers & Creatives",
    description: "Visual showcase of your creative work and design process",
    benefit: "Image galleries, case studies, and client testimonials",
  },
  {
    title: "Freelancers",
    description: "Professional online presence that attracts clients",
    benefit: "Service listings, pricing, and easy booking",
  },
];

const portfolioTemplates = [
  {
    id: "minimal-developer",
    title: "Minimal Developer",
    description: "Clean, minimal design perfect for developers and engineers. Focuses on code samples and projects.",
    price: "₹4,999",
    priceValue: 499900,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
    features: ["Dark/Light mode", "GitHub integration", "Project showcase", "Blog section"],
  },
  {
    id: "creative-designer",
    title: "Creative Designer",
    description: "Bold, visual-focused design for designers and creatives. Perfect for showcasing visual work.",
    price: "₹5,999",
    priceValue: 599900,
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop",
    features: ["Image galleries", "Dribbble integration", "Case studies", "Animation effects"],
  },
  {
    id: "professional-resume",
    title: "Professional Resume",
    description: "Corporate style perfect for job seekers and professionals. Clean and ATS-friendly.",
    price: "₹3,999",
    priceValue: 399900,
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop",
    features: ["PDF export", "LinkedIn style", "Skills section", "Testimonials"],
  },
];

const Portfolios = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleUseTemplate = async (templateId: string) => {
    // Check if user is logged in
    if (!supabase) {
      toast.error("Please sign in to use this template");
      navigate("/auth");
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.info("Please sign in to create a project");
      navigate("/auth");
      return;
    }

    setSelectedTemplate(templateId);
    setIsCreating(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/projects-create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            template_id: templateId,
            project_type: "portfolio",
            client_id: session.user.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create project");
      }

      toast.success("Project created!", {
        description: "Your portfolio project has been created. Redirecting to your dashboard...",
      });

      // Redirect to client portal
      setTimeout(() => {
        navigate("/client-portal?tab=projects");
      }, 1500);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setIsCreating(false);
      setSelectedTemplate(null);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4">
              <Briefcase className="h-16 w-16 text-primary mx-auto mb-4" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Portfolio Websites
            </h1>
            <p className="text-xl text-foreground/70 mb-4">
              Your work deserves to shine. We create stunning portfolios that help you land dream jobs, attract clients, and build your personal brand.
            </p>
            <p className="text-lg text-primary font-medium mb-8 bg-primary/10 px-6 py-3 rounded-lg inline-block">
              We design and build portfolio websites for other people — including students, developers, designers, freelancers, and working professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gradient-primary glow-primary">
                <Link to="/quote?type=portfolio">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get My Portfolio
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/50">
                <Link to="/portfolio">See Examples</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Templates */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Template</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Pick a template that fits your style. Click "Use This Template" to start your project instantly.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {portfolioTemplates.map((template) => (
              <Card key={template.id} className="glass border-border/40 overflow-hidden group hover:border-primary/50 transition-all duration-300">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={template.image}
                    alt={template.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-2xl font-bold text-primary">{template.price}</span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{template.title}</CardTitle>
                  <CardDescription className="pt-2">{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {template.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full gradient-primary"
                    onClick={() => handleUseTemplate(template.id)}
                    disabled={isCreating && selectedTemplate === template.id}
                  >
                    {isCreating && selectedTemplate === template.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        Use This Template
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why You Need a Portfolio */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why a Portfolio Website Matters</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              In today's digital world, a personal website is your most powerful tool
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="glass border-border/40">
              <CardHeader>
                <Star className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Stand Out</CardTitle>
                <CardDescription className="pt-2">
                  99% of candidates don't have a personal website. Be in the 1% that gets noticed by recruiters and clients.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="glass border-border/40">
              <CardHeader>
                <Star className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Control Your Narrative</CardTitle>
                <CardDescription className="pt-2">
                  LinkedIn is great, but your own website lets you tell your story exactly how you want, with no platform limitations.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="glass border-border/40">
              <CardHeader>
                <Star className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Always Accessible</CardTitle>
                <CardDescription className="pt-2">
                  Share a single link that works 24/7. No need for multiple PDFs or profiles scattered across platforms.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What's Included</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Every portfolio website comes with these essential features
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

      {/* Target Audience */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Perfect For</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Whether you're starting your career or growing your freelance business
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {targetAudience.map((audience, index) => (
              <Card key={index} className="glass border-border/40 hover:border-primary/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">{audience.title}</CardTitle>
                  <CardDescription className="pt-2">{audience.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2 text-sm text-primary">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>{audience.benefit}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="glass border-primary glow">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Portfolio Website Package</CardTitle>
                <div className="text-4xl font-bold text-gradient pt-4">₹4,999</div>
                <CardDescription className="pt-2 text-base">
                  Complete portfolio website delivered in 5-7 days
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-sm">Professional single-page design</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-sm">Project showcase with images</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-sm">About section + skills display</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-sm">Contact form integration</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-sm">Mobile responsive design</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-sm">2 rounds of revisions</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-sm">14 days post-launch support</span>
                </div>
                
                <div className="pt-4">
                  <Button asChild className="w-full gradient-primary glow-primary" size="lg">
                    <Link to="/quote?type=portfolio">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Get Started Now
                    </Link>
                  </Button>
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
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-lg text-foreground/80 mb-4">
                "I got my portfolio from Dubiqo before my final year placements. It made such a difference. Recruiters were impressed, and I received 10 interview calls. Ended up with 3 offers and joined my dream company!"
              </p>
              <div>
                <p className="font-semibold">Arjun Reddy</p>
                <p className="text-sm text-foreground/60">Computer Science Student, IIT Delhi</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Build Your Portfolio?
          </h2>
          <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
            Let's create a portfolio that opens doors for you
          </p>
          <Button asChild size="lg" className="gradient-primary glow-primary">
            <Link to="/quote?type=portfolio">
              <Sparkles className="w-5 h-5 mr-2" />
              Get Your Portfolio
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Portfolios;
