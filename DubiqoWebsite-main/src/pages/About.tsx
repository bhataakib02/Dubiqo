import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Heart, Zap } from "lucide-react";

const About = () => {
  const team = [
    {
      name: "Rohan Sharma",
      role: "Founder & Lead Developer",
      bio: "Full-stack developer with 5+ years experience building web applications. Passionate about creating solutions that solve real problems.",
    },
    {
      name: "Priya Mehta",
      role: "UI/UX Designer",
      bio: "Award-winning designer specializing in user-centered design. Creates intuitive interfaces that users love.",
    },
    {
      name: "Amit Patel",
      role: "Senior Developer",
      bio: "Expert in React, Node.js, and cloud infrastructure. Delivers scalable, high-performance applications.",
    },
    {
      name: "Sarah Johnson",
      role: "Support Engineer",
      bio: "Technical support specialist ensuring our clients get help when they need it. Quick problem solver with excellent communication skills.",
    },
  ];

  const values = [
    {
      icon: Target,
      title: "Problem-First Approach",
      description: "We start by understanding your actual problem, not just what you think you need. This ensures we build the right solution.",
    },
    {
      icon: Zap,
      title: "Speed & Quality",
      description: "Fast delivery doesn't mean compromising quality. We use modern tools and efficient processes to deliver quickly without cutting corners.",
    },
    {
      icon: Heart,
      title: "Client Success",
      description: "Your success is our success. We're not satisfied until your website achieves its goals and exceeds your expectations.",
    },
    {
      icon: Users,
      title: "Partnership",
      description: "We're not just vendors—we're partners in your journey. Clear communication, regular updates, and ongoing support.",
    },
  ];

  const milestones = [
    { year: "2023", event: "Dubiqo founded with a mission to solve digital problems" },
    { year: "2024", event: "Reached 50+ completed projects across 10 countries" },
    { year: "2024", event: "Expanded team to 10+ skilled professionals" },
    { year: "2025", event: "Launched specialized services for startups and students" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            About Dubiqo
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            We're a team of developers, designers, and problem solvers dedicated to making the web accessible and effective for everyone
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="glass border-border/40">
              <CardHeader>
                <CardTitle className="text-3xl">Our Story</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/80">
                <p>
                  Dubiqo was born out of frustration. As developers, we kept seeing the same problems: talented students unable to showcase their work, small businesses with broken websites they couldn't fix, and freelancers wasting time on invoicing instead of doing what they love.
                </p>
                <p>
                  We realized that most people don't need fancy features or complex systems. They need reliable solutions that work, delivered by people who care, at prices that make sense.
                </p>
                <p>
                  Today, Dubiqo serves individuals, students, freelancers, startups, and businesses worldwide. We've built hundreds of websites, fixed countless broken ones, and helped our clients grow their online presence.
                </p>
                <p className="font-semibold text-primary">
                  But more importantly, we've solved real problems for real people.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="glass border-border/40">
              <CardHeader>
                <CardTitle>Our Mission</CardTitle>
                <CardDescription className="pt-2 text-foreground/80">
                  Make quality web development accessible and affordable for everyone—from students building their first portfolio to businesses scaling their operations.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="glass border-border/40">
              <CardHeader>
                <CardTitle>Our Vision</CardTitle>
                <CardDescription className="pt-2 text-foreground/80">
                  A world where no one is held back by technical barriers. Where every idea can have an online presence, and every problem has a solution.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="glass border-border/40">
              <CardHeader>
                <CardTitle>What We Believe</CardTitle>
                <CardDescription className="pt-2 text-foreground/80">
                  Technology should solve problems, not create them. Good design is invisible. And the best code is the code that helps someone achieve their goal.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="glass border-border/40 text-center">
                  <CardHeader>
                    <div className="mx-auto h-14 w-14 rounded-xl gradient-primary flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                    <CardDescription className="pt-2">{value.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              The talented people behind Dubiqo
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="glass border-border/40 text-center">
                <CardHeader>
                  <div className="mx-auto h-24 w-24 rounded-full gradient-primary mb-4" />
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <p className="text-sm text-primary">{member.role}</p>
                  <CardDescription className="pt-3">{member.bio}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Key milestones in the Dubiqo story
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {milestones.map((milestone, index) => (
              <Card key={index} className="glass border-border/40">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="text-3xl font-bold text-gradient flex-shrink-0">{milestone.year}</div>
                  <p className="text-foreground/80 pt-1">{milestone.event}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
