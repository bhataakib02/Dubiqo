import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Clock, Briefcase } from "lucide-react";

const positions = [
  {
    id: "1",
    slug: "senior-frontend-developer",
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Build beautiful, performant user interfaces with React and TypeScript.",
  },
  {
    id: "2",
    slug: "full-stack-developer",
    title: "Full Stack Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Work across the entire stack to deliver end-to-end solutions.",
  },
  {
    id: "3",
    slug: "ui-ux-designer",
    title: "UI/UX Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    description: "Create stunning designs and seamless user experiences.",
  },
  {
    id: "4",
    slug: "project-manager",
    title: "Project Manager",
    department: "Operations",
    location: "Remote",
    type: "Full-time",
    description: "Lead projects from concept to delivery with excellence.",
  },
  {
    id: "5",
    slug: "devops-engineer",
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Contract",
    description: "Build and maintain our CI/CD pipelines and cloud infrastructure.",
  },
];

const perks = [
  "100% Remote Work",
  "Flexible Hours",
  "Competitive Salary",
  "Health Insurance",
  "Learning Budget",
  "Home Office Stipend",
  "Unlimited PTO",
  "Team Retreats",
];

export default function Careers() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Join Our <span className="gradient-text">Team</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Build the future of web development with a team of passionate creators.
            </p>
          </div>
        </div>
      </section>

      {/* Perks */}
      <Section>
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="Why Dubiqo"
            title="Perks & Benefits"
            subtitle="We believe in taking care of our team so they can do their best work."
          />
          
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
            {perks.map((perk) => (
              <Badge
                key={perk}
                variant="secondary"
                className="text-base py-2 px-4"
              >
                {perk}
              </Badge>
            ))}
          </div>
        </div>
      </Section>

      {/* Open Positions */}
      <Section variant="muted">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="Open Positions"
            title="Find your next opportunity"
            subtitle="We're always looking for talented individuals to join our team."
          />
          
          <div className="max-w-4xl mx-auto space-y-4">
            {positions.map((position) => (
              <Link key={position.id} to={`/careers/${position.slug}`} className="block group">
                <Card className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{position.department}</Badge>
                          <Badge variant="secondary">{position.type}</Badge>
                        </div>
                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors mb-2">
                          {position.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-3">
                          {position.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {position.location}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" className="shrink-0 group-hover:border-primary group-hover:text-primary">
                        Apply Now
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Don't see a perfect fit?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            We're always interested in hearing from talented individuals.
            Send us your resume and we'll reach out if there's a match.
          </p>
          <Button size="lg" asChild>
            <Link to="/contact">Send Your Resume</Link>
          </Button>
        </div>
      </Section>
    </Layout>
  );
}
