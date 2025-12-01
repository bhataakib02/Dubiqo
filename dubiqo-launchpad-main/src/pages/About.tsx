import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Target,
  Heart,
  Lightbulb,
  Users,
  Award,
  Globe,
} from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "We don't settle for good enough. Every project gets our best work.",
  },
  {
    icon: Heart,
    title: "Client First",
    description: "Your success is our success. We're partners, not just vendors.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We stay ahead of trends to give you cutting-edge solutions.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Open communication and teamwork drive every project.",
  },
];

const team = [
  {
    name: "Alex Morgan",
    role: "Founder & Lead Developer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  },
  {
    name: "Sarah Chen",
    role: "Design Director",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
  {
    name: "Michael Davis",
    role: "Senior Developer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    name: "Emily Watson",
    role: "Project Manager",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  },
];

const stats = [
  { value: "150+", label: "Projects Completed" },
  { value: "50+", label: "Happy Clients" },
  { value: "5+", label: "Years Experience" },
  { value: "12", label: "Countries Served" },
];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              About <span className="gradient-text">Dubiqo</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              We're a team of passionate developers and designers building
              digital solutions that make a difference.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <Section>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Dubiqo was born from a simple observation: too many businesses
                  struggle with outdated, poorly designed websites that hurt their
                  growth potential.
                </p>
                <p>
                  Founded in 2019, we set out to change that. Our mission is to
                  democratize access to high-quality web development, making it
                  accessible to startups, freelancers, and small businesses.
                </p>
                <p>
                  Today, we've helped over 150 clients across 12 countries transform
                  their digital presence. From simple landing pages to complex web
                  applications, we bring the same level of dedication and expertise
                  to every project.
                </p>
              </div>
              <Button className="mt-8" asChild>
                <Link to="/portfolio">
                  See Our Work
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-3xl" />
              <div className="relative glass rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section variant="muted">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="Our Values"
            title="What drives us"
            subtitle="These core values guide everything we do at Dubiqo."
          />
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card
                key={value.title}
                className="bg-card/50 backdrop-blur border-border/50 text-center"
              >
                <CardContent className="pt-8">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Team */}
      <Section>
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="Our Team"
            title="Meet the people behind Dubiqo"
            subtitle="A diverse team of experts passionate about creating exceptional digital experiences."
          />
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <Card
                key={member.name}
                className="overflow-hidden bg-card/50 backdrop-blur border-border/50 group"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="pt-4 text-center">
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-muted-foreground text-sm">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Want to join our team?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals who share our passion
            for creating exceptional digital experiences.
          </p>
          <Button size="lg" asChild>
            <Link to="/careers">
              View Open Positions
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </Section>
    </Layout>
  );
}
