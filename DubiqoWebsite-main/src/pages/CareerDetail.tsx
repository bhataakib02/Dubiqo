import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  Clock,
  Briefcase,
  ArrowLeft,
  CheckCircle2,
  Upload,
  User,
  Mail,
  Link as LinkIcon,
  Loader2,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CareerDetail = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    portfolio: "",
    message: "",
  });

  // Job data
  const jobs: Record<string, {
    title: string;
    location: string;
    type: string;
    department: string;
    description: string;
    responsibilities: string[];
    requirements: string[];
    niceToHave: string[];
    benefits: string[];
  }> = {
    "web-developer": {
      title: "Web Developer",
      location: "Remote",
      type: "Full-time",
      department: "Engineering",
      description: "We're looking for a skilled Web Developer to join our engineering team. You'll be building modern, responsive websites and web applications for clients across various industries. This is a great opportunity to work on diverse projects and make a real impact.",
      responsibilities: [
        "Build responsive websites and web applications using React, Next.js, and modern JavaScript",
        "Collaborate with designers to implement pixel-perfect UIs",
        "Write clean, maintainable, and well-documented code",
        "Optimize website performance and ensure cross-browser compatibility",
        "Participate in code reviews and provide constructive feedback",
        "Communicate with clients to understand requirements and provide updates",
        "Troubleshoot and fix bugs reported by clients",
        "Stay up-to-date with the latest web development trends and technologies",
      ],
      requirements: [
        "2+ years of professional web development experience",
        "Strong proficiency in React and modern JavaScript (ES6+)",
        "Experience with Tailwind CSS or similar utility-first frameworks",
        "Understanding of responsive design principles",
        "Familiarity with version control (Git)",
        "Good communication skills in English",
        "Problem-solving mindset and attention to detail",
        "Ability to work independently and manage your time effectively",
      ],
      niceToHave: [
        "Experience with Next.js and server-side rendering",
        "Knowledge of TypeScript",
        "Experience with animation libraries (Framer Motion, GSAP)",
        "Backend development experience (Node.js, databases)",
        "Experience working with clients directly",
        "Portfolio of personal or professional projects",
      ],
      benefits: [
        "Competitive salary based on experience",
        "100% remote work — work from anywhere",
        "Flexible working hours",
        "Work on diverse, interesting projects",
        "Growth opportunities as we expand",
        "Supportive, collaborative team environment",
      ],
    },
    "ui-ux-designer": {
      title: "UI/UX Designer",
      location: "Remote / Hybrid",
      type: "Full-time",
      department: "Design",
      description: "We're looking for a talented UI/UX Designer to create beautiful, user-centered designs for our client projects. You'll work closely with developers and clients to turn ideas into stunning visual experiences.",
      responsibilities: [
        "Create user interface designs for websites, dashboards, and applications",
        "Develop wireframes, prototypes, and high-fidelity mockups",
        "Conduct user research and incorporate feedback into designs",
        "Collaborate with developers to ensure design feasibility",
        "Maintain and improve our design system",
        "Present designs to clients and incorporate feedback",
        "Stay current with design trends and best practices",
        "Ensure designs are accessible and inclusive",
      ],
      requirements: [
        "2+ years of UI/UX design experience",
        "Proficiency in Figma (required)",
        "Strong portfolio demonstrating web and app design work",
        "Understanding of web development principles",
        "Experience creating responsive designs",
        "Good communication skills in English",
        "Ability to receive and implement feedback constructively",
        "Eye for detail and aesthetics",
      ],
      niceToHave: [
        "Experience with motion design and micro-interactions",
        "Knowledge of HTML/CSS",
        "Experience with design systems",
        "Illustration or icon design skills",
        "Experience working directly with clients",
        "Understanding of accessibility guidelines",
      ],
      benefits: [
        "Competitive salary based on experience",
        "Remote or hybrid work options",
        "Flexible working hours",
        "Creative freedom on projects",
        "Work on diverse client projects",
        "Supportive team environment",
      ],
    },
    "support-engineer": {
      title: "Support Engineer",
      location: "Remote",
      type: "Part-time",
      department: "Support",
      description: "We're looking for a Support Engineer to help our clients with technical issues, questions, and requests. This is a part-time role perfect for someone who enjoys helping people and has a technical background.",
      responsibilities: [
        "Respond to client support requests via email and chat",
        "Troubleshoot website issues and provide solutions",
        "Document common issues and create help articles",
        "Escalate complex issues to the development team",
        "Follow up with clients to ensure issues are resolved",
        "Identify patterns in support requests to improve our processes",
        "Provide feedback to the team on client needs",
        "Maintain accurate records of support interactions",
      ],
      requirements: [
        "Technical background (web development, IT, or related field)",
        "Excellent written communication skills",
        "Strong problem-solving abilities",
        "Patience and empathy when dealing with clients",
        "Ability to explain technical concepts in simple terms",
        "Basic understanding of HTML, CSS, and web technologies",
        "Available for 15-20 hours per week",
        "Reliable internet connection",
      ],
      niceToHave: [
        "Previous customer support experience",
        "Experience with support ticketing systems",
        "Knowledge of web hosting and domains",
        "Experience with WordPress or similar platforms",
        "Ability to write help documentation",
        "Multiple language skills",
      ],
      benefits: [
        "Competitive hourly rate",
        "100% remote work",
        "Flexible hours within support window",
        "Gain experience across diverse projects",
        "Opportunity to grow into full-time role",
        "Friendly, supportive team",
      ],
    },
    "project-manager": {
      title: "Project Manager",
      location: "Remote",
      type: "Freelance",
      department: "Operations",
      description: "We're looking for a Project Manager to help us manage client projects from start to finish. This freelance role is perfect for someone with strong organizational skills who enjoys coordinating teams and keeping projects on track.",
      responsibilities: [
        "Manage client projects from kickoff to delivery",
        "Coordinate between clients, designers, and developers",
        "Create and maintain project timelines and milestones",
        "Conduct regular status meetings and provide updates",
        "Identify and mitigate project risks",
        "Ensure deliverables meet quality standards",
        "Handle client communications and manage expectations",
        "Document project processes and learnings",
      ],
      requirements: [
        "2+ years of project management experience",
        "Experience managing web development or digital projects",
        "Strong organizational and time management skills",
        "Excellent communication skills in English",
        "Ability to manage multiple projects simultaneously",
        "Familiarity with project management tools (Notion, Trello, Asana)",
        "Understanding of web development process",
        "Available for 20-30 hours per week",
      ],
      niceToHave: [
        "PMP or similar certification",
        "Agency or client-services experience",
        "Technical background",
        "Experience with agile methodologies",
        "Budget management experience",
        "Experience working with remote teams",
      ],
      benefits: [
        "Competitive project-based compensation",
        "100% remote work",
        "Flexible hours",
        "Work on diverse, interesting projects",
        "Opportunity for long-term collaboration",
        "Supportive team environment",
      ],
    },
  };

  const job = slug ? jobs[slug] : null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.portfolio) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Application Submitted! ✓",
      description: "Thank you for applying! We'll review your application and get back to you within 5 business days.",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      portfolio: "",
      message: "",
    });
    setFileName("");
    setIsSubmitting(false);
  };

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="glass border-border/40 max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Position Not Found</h1>
            <p className="text-foreground/70 mb-6">
              The job posting you're looking for doesn't exist or has been filled.
            </p>
            <Button asChild className="gradient-primary">
              <Link to="/careers">View All Positions</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4">
          <Link
            to="/careers"
            className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Positions
          </Link>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {job.title}
          </h1>
          
          <div className="flex flex-wrap gap-4 text-foreground/80 mb-6">
            <div className="flex items-center gap-1">
              <MapPin className="h-5 w-5 text-primary" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-5 w-5 text-primary" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="h-5 w-5 text-primary" />
              <span>{job.department}</span>
            </div>
          </div>
          
          <p className="text-lg text-foreground/70 max-w-3xl">
            {job.description}
          </p>
        </div>
      </section>

      {/* Job Details */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Responsibilities */}
              <Card className="glass border-border/40">
                <CardHeader>
                  <CardTitle>Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {job.responsibilities.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card className="glass border-border/40">
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {job.requirements.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Nice to Have */}
              <Card className="glass border-border/40">
                <CardHeader>
                  <CardTitle>Nice to Have</CardTitle>
                  <CardDescription>Not required, but would be a bonus</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {job.niceToHave.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-foreground/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card className="glass border-border/40">
                <CardHeader>
                  <CardTitle>Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {job.benefits.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-foreground/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Application Form */}
            <div>
              <Card className="glass border-primary glow sticky top-24">
                <CardHeader>
                  <CardTitle>Apply Now</CardTitle>
                  <CardDescription>
                    Submit your application and we'll get back to you within 5 business days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="John Doe"
                          className="pl-10 bg-muted/50 border-border/40"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          className="pl-10 bg-muted/50 border-border/40"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="portfolio">Portfolio / LinkedIn URL *</Label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="portfolio"
                          type="url"
                          placeholder="https://"
                          className="pl-10 bg-muted/50 border-border/40"
                          value={formData.portfolio}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cv">Resume / CV</Label>
                      <label 
                        htmlFor="cv"
                        className="border-2 border-dashed border-border/40 rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block"
                      >
                        {fileName ? (
                          <div className="flex items-center justify-center gap-2 text-primary">
                            <FileText className="h-5 w-5" />
                            <span className="text-sm">{fileName}</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-primary mx-auto mb-2" />
                            <p className="text-sm text-foreground/70">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-foreground/50 mt-1">
                              PDF, DOC up to 5MB
                            </p>
                          </>
                        )}
                        <input
                          type="file"
                          id="cv"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Why do you want to work with us?</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about yourself and why you'd be a great fit..."
                        className="bg-muted/50 border-border/40 min-h-24"
                        value={formData.message}
                        onChange={handleInputChange}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full gradient-primary" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>

                    <p className="text-xs text-center text-foreground/60">
                      By applying, you agree to our privacy policy and consent to us storing your information.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareerDetail;
