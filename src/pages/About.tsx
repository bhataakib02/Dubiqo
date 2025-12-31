import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Section, SectionHeader } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Target, Heart, Lightbulb, Users, Award, Globe, Sparkles, Rocket, TrendingUp, Shield, Zap, CheckCircle2, Star } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Excellence',
    description: "We don't settle for good enough. Every project gets our best work.",
  },
  {
    icon: Heart,
    title: 'Client First',
    description: "Your success is our success. We're partners, not just vendors.",
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We stay ahead of trends to give you cutting-edge solutions.',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'Open communication and teamwork drive every project.',
  },
];

const team = [
  {
    name: 'Shayam Ahmad',
    role: 'Founder & Lead Developer',
    image:
      'https://icon2.cleanpng.com/20180505/khw/kisspng-emojipedia-noto-fonts-emoticon-iphone-5aee006286ec14.9545327215255471065526.jpg',
  },
  {
    name: 'Mohammad Aakib Bhat',
    role: 'Co-Founder & Lead Developer',
    image:
      'https://icon2.cleanpng.com/20180505/khw/kisspng-emojipedia-noto-fonts-emoticon-iphone-5aee006286ec14.9545327215255471065526.jpg',
  },
  {
    name: 'Jan Adnan Farooq',
    role: 'Design Director',
    image:
      'https://icon2.cleanpng.com/20180505/khw/kisspng-emojipedia-noto-fonts-emoticon-iphone-5aee006286ec14.9545327215255471065526.jpg',
  },
  {
    name: 'Haroon Iqbal',
    role: 'Project Manager',
    image:
      'https://icon2.cleanpng.com/20180505/khw/kisspng-emojipedia-noto-fonts-emoticon-iphone-5aee006286ec14.9545327215255471065526.jpg',
  },
];

const stats = [
  { value: '150+', label: 'Projects Completed', icon: Rocket },
  { value: '50+', label: 'Happy Clients', icon: Heart },
  { value: '5+', label: 'Years Experience', icon: Award },
  { value: '12', label: 'Countries Served', icon: Globe },
];

const milestones = [
  {
    year: '2025',
    title: 'Founded',
    description: 'Dubiqo was born with a vision to democratize high-quality web development.',
  },
  {
    year: '2025',
    title: 'First 50 Clients',
    description: 'Reached our first major milestone, serving clients across multiple countries.',
  },
  {
    year: '2025',
    title: '150+ Projects',
    description: 'Delivered exceptional digital solutions to businesses worldwide.',
  },
  {
    year: 'Today',
    title: 'Growing Strong',
    description: 'Continuing to innovate and help businesses transform their digital presence.',
  },
];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge
              variant="outline"
              className="mb-6 px-4 py-2 text-sm border-primary/30 bg-primary/5 animate-fade-in"
            >
              <Sparkles className="w-4 h-4 mr-2 text-primary" />
              Our Story
            </Badge>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in animation-delay-200">
              About <span className="gradient-text">Dubiqo</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in animation-delay-300">
              We're a team of passionate developers and designers building digital solutions that
              make a difference. Every line of code, every pixel, every interaction is crafted with
              purpose.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animation-delay-400">
              <Button size="lg" asChild className="glow-primary text-lg px-8 py-6">
                <Link to="/quote">
                  Work With Us
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
                <Link to="/portfolio">View Our Work</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <Section>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <SectionHeader
                badge="Our Journey"
                title="Building the Future, One Project at a Time"
                subtitle="From a simple idea to a trusted partner for businesses worldwide."
                align="left"
              />
              
              <div className="space-y-4 text-muted-foreground text-lg">
                <p>
                  Dubiqo was born from a simple observation: too many businesses struggle with
                  outdated, poorly designed websites that hurt their growth potential. We saw an
                  opportunity to bridge the gap between enterprise-quality development and
                  accessibility.
                </p>
                <p>
                  Founded in 2025, we set out to change that. Our mission is to democratize access
                  to high-quality web development, making it accessible to startups, freelancers,
                  and small businesses without compromising on quality or innovation.
                </p>
                <p>
                  Today, we've helped over 150 clients across 12 countries transform their digital
                  presence. From simple landing pages to complex web applications, we bring the same
                  level of dedication and expertise to every project, regardless of size.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button className="glow-primary" asChild>
                  <Link to="/portfolio">
                    See Our Work
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/contact">Get in Touch</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-3xl animate-pulse" />
              <div className="relative glass rounded-2xl p-8 border border-border/50">
                <div className="grid grid-cols-2 gap-8">
                  {stats.map((stat, index) => (
                    <div 
                      key={stat.label} 
                      className="text-center group hover:scale-105 transition-transform duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                        <stat.icon className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Mission */}
      <Section variant="muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <SectionHeader
              badge="Our Mission"
              title="Empowering Businesses Through Technology"
              subtitle="We believe every business deserves world-class digital solutions."
            />
            
            <div className="mt-12 grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Target,
                  title: 'Excellence',
                  description: 'We set the bar high and exceed expectations on every project.',
                },
                {
                  icon: TrendingUp,
                  title: 'Growth',
                  description: 'Your success is our success. We build solutions that scale.',
                },
                {
                  icon: Sparkles,
                  title: 'Innovation',
                  description: 'Staying ahead of the curve with cutting-edge technologies.',
                },
              ].map((item, index) => (
                <Card
                  key={item.title}
                  className="bg-card/50 backdrop-blur border-border/50 text-center group hover:border-primary/50 transition-all duration-300"
                >
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <item.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section>
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="Our Values"
            title="What Drives Us"
            subtitle="These core values guide everything we do at Dubiqo—from the smallest detail to the biggest decisions."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {values.map((value, index) => (
              <Card
                key={value.title}
                className="bg-card/50 backdrop-blur border-border/50 text-center group hover:border-primary/50 transition-all duration-300 card-hover"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-8 pb-8">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Timeline */}
      <Section variant="muted">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="Our Journey"
            title="Milestones & Achievements"
            subtitle="Key moments that shaped who we are today."
          />

          <div className="mt-12 relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 hidden md:block" />
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className="w-full md:w-5/12">
                    <Card className="bg-card/80 backdrop-blur border-border/50 group hover:border-primary/50 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Award className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <Badge variant="outline" className="mb-1">
                              {milestone.year}
                            </Badge>
                            <h3 className="text-xl font-semibold">{milestone.title}</h3>
                          </div>
                        </div>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="hidden md:block w-2/12" />
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg hidden md:block" />
                  
                  <div className="w-full md:w-5/12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Team */}
      <Section>
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="Our Team"
            title="Meet the People Behind Dubiqo"
            subtitle="A diverse team of experts passionate about creating exceptional digital experiences that drive real results."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {team.map((member, index) => (
              <Card
                key={member.name}
                className="overflow-hidden bg-card/50 backdrop-blur border-border/50 group hover:border-primary/50 transition-all duration-300 card-hover"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-square overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardContent className="pt-6 pb-6 text-center">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Why Choose Us */}
      <Section variant="muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <SectionHeader
              badge="Why Choose Dubiqo"
              title="The Difference is in the Details"
              subtitle="We don't just build websites—we craft digital experiences that drive growth."
            />

            <div className="mt-12 grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Zap,
                  title: 'Lightning Fast Delivery',
                  description: 'We respect your time. Most projects are delivered ahead of schedule without compromising quality.',
                },
                {
                  icon: Shield,
                  title: 'Enterprise-Grade Security',
                  description: 'Your data and your customers\' data are protected with industry-leading security practices.',
                },
                {
                  icon: Users,
                  title: 'Dedicated Support',
                  description: 'Real humans ready to help. No bots, no runaround—just genuine support when you need it.',
                },
                {
                  icon: Star,
                  title: 'Proven Track Record',
                  description: '99% client satisfaction rate with 150+ successful projects delivered across 12 countries.',
                },
              ].map((item, index) => (
                <div
                  key={item.title}
                  className="flex gap-4 p-6 rounded-xl bg-card/50 backdrop-blur border border-border/50 hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-3xl" />
              <div className="relative glass rounded-2xl p-12 border border-border/50">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Rocket className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  Ready to Build Something <span className="gradient-text">Amazing?</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                  Let's discuss your project and see how we can help you achieve your goals. Every
                  great journey starts with a single step.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" asChild className="glow-primary text-lg px-8 py-6">
                    <Link to="/quote">
                      Start Your Project
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
                    <Link to="/contact">Schedule a Call</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
