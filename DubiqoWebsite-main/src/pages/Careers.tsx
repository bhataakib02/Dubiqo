import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  Users,
  Heart,
  Laptop,
  Coffee,
  Zap,
  CheckCircle2,
} from "lucide-react";

const Careers = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  const jobs = [
    {
      id: 1,
      title: "Web Developer",
      slug: "web-developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Build modern, responsive websites and web applications using React, Next.js, and modern JavaScript.",
    },
    {
      id: 2,
      title: "UI/UX Designer",
      slug: "ui-ux-designer",
      department: "Design",
      location: "Remote / Hybrid",
      type: "Full-time",
      description: "Create beautiful, user-centered designs for our client projects. Work closely with developers and clients.",
    },
    {
      id: 3,
      title: "Support Engineer",
      slug: "support-engineer",
      department: "Support",
      location: "Remote",
      type: "Part-time",
      description: "Help our clients with technical issues, questions, and requests. Great for those who enjoy helping people.",
    },
    {
      id: 4,
      title: "Project Manager",
      slug: "project-manager",
      department: "Operations",
      location: "Remote",
      type: "Freelance",
      description: "Manage client projects from start to finish. Coordinate between clients, designers, and developers.",
    },
  ];

  const departments = ["All", "Engineering", "Design", "Support", "Operations"];

  const filteredJobs = useMemo(() => {
    if (selectedDepartment === "All") return jobs;
    return jobs.filter(job => job.department === selectedDepartment);
  }, [selectedDepartment]);

  const benefits = [
    {
      icon: Laptop,
      title: "Remote Work",
      description: "Work from anywhere in the world. We're a fully remote team.",
    },
    {
      icon: Clock,
      title: "Flexible Hours",
      description: "Set your own schedule. We care about results, not hours.",
    },
    {
      icon: Zap,
      title: "Interesting Projects",
      description: "Work on diverse projects across different industries.",
    },
    {
      icon: Users,
      title: "Small Team",
      description: "Your voice matters. Direct impact on company direction.",
    },
    {
      icon: Heart,
      title: "Growth Focus",
      description: "Learn and grow. We invest in your professional development.",
    },
    {
      icon: Coffee,
      title: "Work-Life Balance",
      description: "No crunch. Sustainable pace. Take care of yourself first.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4 text-center">
          <Briefcase className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Join Our Team
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
            Help us build amazing digital solutions for clients around the world. We're always looking for talented, passionate people to join Dubiqo.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="gradient-primary">
              <a href="#positions">View Open Positions</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Join Dubiqo?</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              We're building something special and want you to be part of it
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="glass border-border/40 hover:border-primary/50 transition-all duration-300">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>{benefit.title}</CardTitle>
                    <CardDescription className="pt-2">{benefit.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Open Positions</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto mb-8">
              Find your next opportunity with us
            </p>

            {/* Department Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {departments.map((dept) => (
                <Button
                  key={dept}
                  variant={selectedDepartment === dept ? "default" : "outline"}
                  className={selectedDepartment === dept ? "gradient-primary" : "border-border/40"}
                  size="sm"
                  onClick={() => setSelectedDepartment(dept)}
                >
                  {dept}
                  {dept !== "All" && (
                    <span className="ml-1 text-xs opacity-70">
                      ({jobs.filter(j => j.department === dept).length})
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-foreground/60">No open positions in {selectedDepartment} right now.</p>
                <p className="text-sm text-foreground/50 mt-2">Check back soon or apply for a different department!</p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <Card key={job.id} className="glass border-border/40 hover:border-primary/50 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {job.department}
                          </span>
                        </div>
                        <p className="text-foreground/70 mb-3">{job.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{job.type}</span>
                          </div>
                        </div>
                      </div>
                      <Button asChild className="gradient-primary group-hover:scale-105 transition-transform">
                        <Link to={`/careers/${job.slug}`}>
                          Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Culture</h2>
              <p className="text-foreground/70 mb-6">
                At Dubiqo, we believe great work comes from happy, empowered people. We're building a team that values quality, collaboration, and continuous learning.
              </p>
              <ul className="space-y-3">
                {[
                  "We ship quality work, not just fast work",
                  "We communicate openly and honestly",
                  "We support each other's growth",
                  "We respect work-life boundaries",
                  "We celebrate wins, big and small",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="glass border-primary glow">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Don't see your role?</h3>
                <p className="text-foreground/70 mb-6">
                  We're always looking for talented people, even if we don't have a specific opening. Send us your resume and tell us how you can contribute.
                </p>
                <Button asChild className="w-full gradient-primary">
                  <Link to="/contact">Get in Touch</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How We Hire */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Hire</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Our hiring process is straightforward and respectful of your time
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: 1, title: "Apply", description: "Submit your application with portfolio/resume" },
              { step: 2, title: "Review", description: "We review and respond within 5 business days" },
              { step: 3, title: "Interview", description: "30-45 minute video call to learn about each other" },
              { step: 4, title: "Trial", description: "Short paid trial project to see how we work together" },
            ].map((item) => (
              <Card key={item.step} className="glass border-border/40 text-center relative">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 text-primary-foreground font-bold text-lg">
                    {item.step}
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription className="pt-2">{item.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
