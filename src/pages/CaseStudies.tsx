import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Section, SectionHeader } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp, Clock, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const staticCaseStudies = [
  {
    id: '1',
    slug: 'fintech-dashboard-redesign',
    title: 'FinTech Dashboard Redesign',
    client: 'PayFlow Inc.',
    category: 'Web Application',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
    excerpt:
      'How we helped a fintech startup increase user engagement by 150% with a complete dashboard redesign.',
    stats: [
      { label: 'User Engagement', value: '+150%' },
      { label: 'Time on Platform', value: '+85%' },
      { label: 'Support Tickets', value: '-60%' },
    ],
  },
  {
    id: '2',
    slug: 'ecommerce-platform-migration',
    title: 'E-Commerce Platform Migration',
    client: 'StyleHub',
    category: 'E-Commerce',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop',
    excerpt: 'Migrating a fashion retailer from a legacy platform to a modern, scalable solution.',
    stats: [
      { label: 'Page Load Speed', value: '-70%' },
      { label: 'Conversion Rate', value: '+45%' },
      { label: 'Mobile Sales', value: '+120%' },
    ],
  },
  {
    id: '3',
    slug: 'healthcare-portal-development',
    title: 'Healthcare Portal Development',
    client: 'MedConnect',
    category: 'Web Application',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=500&fit=crop',
    excerpt: 'Building a HIPAA-compliant patient portal with telemedicine capabilities.',
    stats: [
      { label: 'Patient Satisfaction', value: '+90%' },
      { label: 'Appointment Bookings', value: '+200%' },
      { label: 'No-Shows', value: '-40%' },
    ],
  },
  {
    id: '4',
    slug: 'saas-analytics-platform',
    title: 'SaaS Analytics Platform',
    client: 'DataPulse',
    category: 'Dashboard',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
    excerpt: 'Creating an AI-powered analytics platform for real-time business insights.',
    stats: [
      { label: 'Data Processing', value: '10x Faster' },
      { label: 'User Retention', value: '+75%' },
      { label: 'Revenue Growth', value: '+180%' },
    ],
  },
];

export default function CaseStudies() {
  const [caseStudies, setCaseStudies] = useState(staticCaseStudies);
  const [isLoading, setIsLoading] = useState(false);

  const loadStudies = async () => {
    if (!supabase) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        setCaseStudies(data as typeof staticCaseStudies);
      } else {
        setCaseStudies(staticCaseStudies);
      }
    } catch (error) {
      console.error('Error loading case studies:', error);
      toast.error('Failed to load case studies. Showing defaults.');
      setCaseStudies(staticCaseStudies);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudies();
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[100px]" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Case <span className="gradient-text">Studies</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Deep dives into how we've helped businesses transform and grow.
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <Section>
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-16">
              {caseStudies.map((study, index) => (
                <div
                  key={study.id}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? '' : ''}`}
                >
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <Card className="overflow-hidden bg-card/50 backdrop-blur border-border/50">
                      <img
                        src={study.image}
                        alt={study.title}
                        className="w-full aspect-video object-cover"
                      />
                    </Card>
                  </div>

                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <Badge variant="secondary" className="mb-4">
                      {study.category}
                    </Badge>
                    <h2 className="text-3xl font-bold mb-2">{study.title}</h2>
                    <p className="text-muted-foreground mb-4">Client: {study.client}</p>
                    <p className="text-muted-foreground mb-6">{study.excerpt}</p>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {(study.stats || []).map((stat) => (
                        <div key={stat.label} className="text-center">
                          <div className="text-2xl font-bold text-primary">{stat.value}</div>
                          <div className="text-xs text-muted-foreground">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    <Button asChild>
                      <Link to={`/case-studies/${study.slug}`}>
                        Read Full Case Study
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* CTA */}
      <Section variant="muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to be our next success story?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Let's discuss how we can help transform your business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="glow-primary" asChild>
              <Link to="/quote">Get Your Free Quote</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/booking">Book a Consultation</Link>
            </Button>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
