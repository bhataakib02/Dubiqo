import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MapPin, Clock, Briefcase, DollarSign, Check, Upload } from "lucide-react";
import { toast } from "sonner";

const positionsData: Record<string, {
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
}> = {
  "senior-frontend-developer": {
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    salary: "$120k - $160k",
    description: "We're looking for a Senior Frontend Developer to join our growing team. You'll work on exciting projects for clients across various industries, building beautiful and performant user interfaces.",
    responsibilities: [
      "Lead frontend development for client projects",
      "Architect scalable frontend solutions",
      "Mentor junior developers",
      "Collaborate with designers and backend developers",
      "Write clean, maintainable code",
      "Participate in code reviews"
    ],
    requirements: [
      "5+ years of frontend development experience",
      "Expert knowledge of React and TypeScript",
      "Experience with modern CSS (Tailwind, CSS-in-JS)",
      "Strong understanding of web performance",
      "Experience with testing frameworks",
      "Excellent communication skills"
    ],
    niceToHave: [
      "Experience with Next.js",
      "Knowledge of backend technologies",
      "Open source contributions",
      "Experience leading a team"
    ],
    benefits: [
      "100% Remote Work",
      "Competitive Salary",
      "Health Insurance",
      "Unlimited PTO",
      "Learning Budget",
      "Home Office Stipend",
      "Team Retreats",
      "Flexible Hours"
    ]
  },
  "full-stack-developer": {
    title: "Full Stack Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    salary: "$100k - $140k",
    description: "Join us as a Full Stack Developer and work across the entire stack to deliver end-to-end solutions for our clients.",
    responsibilities: [
      "Develop full-stack features from design to deployment",
      "Design and implement APIs",
      "Work with databases and data modeling",
      "Collaborate with the team on architecture decisions",
      "Write tests and documentation"
    ],
    requirements: [
      "3+ years of full-stack development experience",
      "Proficiency in React and Node.js",
      "Experience with SQL and NoSQL databases",
      "Understanding of RESTful API design",
      "Familiarity with cloud services (AWS/GCP)"
    ],
    niceToHave: [
      "Experience with GraphQL",
      "Knowledge of DevOps practices",
      "Experience with real-time applications"
    ],
    benefits: [
      "100% Remote Work",
      "Competitive Salary",
      "Health Insurance",
      "Unlimited PTO",
      "Learning Budget"
    ]
  },
  "ui-ux-designer": {
    title: "UI/UX Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    salary: "$90k - $130k",
    description: "We're seeking a talented UI/UX Designer to create stunning designs and seamless user experiences for our clients.",
    responsibilities: [
      "Create user-centered designs",
      "Develop wireframes and prototypes",
      "Conduct user research",
      "Collaborate with developers on implementation",
      "Maintain design systems"
    ],
    requirements: [
      "4+ years of UI/UX design experience",
      "Proficiency in Figma",
      "Strong portfolio demonstrating web/app design",
      "Understanding of design systems",
      "Experience with user research methods"
    ],
    niceToHave: [
      "Motion design skills",
      "Frontend development knowledge",
      "Experience with design tokens"
    ],
    benefits: [
      "100% Remote Work",
      "Competitive Salary",
      "Health Insurance",
      "Creative Freedom"
    ]
  },
  "project-manager": {
    title: "Project Manager",
    department: "Operations",
    location: "Remote",
    type: "Full-time",
    salary: "$80k - $110k",
    description: "Lead projects from concept to delivery with excellence. We need a PM who can keep our projects on track and our clients happy.",
    responsibilities: [
      "Manage multiple client projects simultaneously",
      "Create and maintain project timelines",
      "Facilitate communication between clients and team",
      "Identify and mitigate project risks",
      "Ensure projects are delivered on time and budget"
    ],
    requirements: [
      "3+ years of project management experience",
      "Experience in software/web development projects",
      "Excellent communication skills",
      "Proficiency with PM tools (Jira, Asana)",
      "PMP or similar certification preferred"
    ],
    niceToHave: [
      "Technical background",
      "Experience with agile methodologies",
      "Client-facing experience"
    ],
    benefits: [
      "100% Remote Work",
      "Competitive Salary",
      "Health Insurance"
    ]
  },
  "devops-engineer": {
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Contract",
    salary: "$130k - $170k",
    description: "Build and maintain our CI/CD pipelines and cloud infrastructure. Help us ship code faster and more reliably.",
    responsibilities: [
      "Design and implement CI/CD pipelines",
      "Manage cloud infrastructure (AWS/GCP)",
      "Implement monitoring and alerting",
      "Automate deployment processes",
      "Ensure security best practices"
    ],
    requirements: [
      "4+ years of DevOps experience",
      "Expert knowledge of AWS or GCP",
      "Experience with Docker and Kubernetes",
      "Proficiency in infrastructure as code (Terraform)",
      "Strong scripting skills (Bash, Python)"
    ],
    niceToHave: [
      "Security certifications",
      "Experience with multiple cloud providers",
      "Database administration experience"
    ],
    benefits: [
      "100% Remote Work",
      "Competitive Rate",
      "Flexible Hours"
    ]
  }
};

export default function CareerDetail() {
  const { slug } = useParams();
  const position = positionsData[slug || ""];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Application submitted successfully!", {
      description: "We'll review your application and get back to you soon."
    });
    setIsSubmitting(false);
  };

  if (!position) {
    return (
      <Layout>
        <Section className="pt-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Position Not Found</h1>
            <p className="text-muted-foreground mb-8">This position doesn't exist or has been filled.</p>
            <Button asChild>
              <Link to="/careers">View All Positions</Link>
            </Button>
          </div>
        </Section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        <div className="container mx-auto px-4 relative">
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Careers
          </Link>
          
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">{position.department}</Badge>
              <Badge variant="secondary">{position.type}</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              {position.title}
            </h1>
            
            <div className="flex flex-wrap gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {position.location}
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                {position.salary}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <Section>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[1fr_400px] gap-12">
            {/* Main Content */}
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-bold mb-4">About the Role</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {position.description}
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-4">Responsibilities</h2>
                <ul className="space-y-3">
                  {position.responsibilities.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {position.requirements.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {position.niceToHave.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Nice to Have</h2>
                  <ul className="space-y-3">
                    {position.niceToHave.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Benefits */}
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle>Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {position.benefits.map((benefit) => (
                      <Badge key={benefit} variant="secondary">{benefit}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Application Form */}
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle>Apply Now</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Doe" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn Profile</Label>
                      <Input id="linkedin" placeholder="https://linkedin.com/in/..." />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="portfolio">Portfolio URL</Label>
                      <Input id="portfolio" placeholder="https://..." />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="resume">Resume/CV</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF, DOC up to 5MB
                        </p>
                        <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cover">Cover Letter (Optional)</Label>
                      <Textarea
                        id="cover"
                        placeholder="Tell us why you're interested in this role..."
                        rows={4}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
