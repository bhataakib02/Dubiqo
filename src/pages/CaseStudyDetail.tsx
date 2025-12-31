import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type CaseStudy = {
  id: string;
  slug: string;
  title: string;
  client_name: string;
  client?: string;
  industry: string | null;
  project_duration: string | null;
  challenge: string;
  solution: string;
  results: string;
  technologies: string[] | null;
  featured_image: string | null;
  image?: string;
  metadata?: any;
  published: boolean | null;
};

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const [study, setStudy] = useState<CaseStudy | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadStudy(slug);
    }
  }, [slug]);

  const loadStudy = async (studySlug: string) => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('slug', studySlug)
        .eq('published', true)
        .single();

      if (error) throw error;
      setStudy(data as CaseStudy);
    } catch (error: any) {
      console.error('Error loading case study:', error);
      if (error.code === 'PGRST116') {
        setStudy(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <Section className="pt-32">
          <div className="container mx-auto px-4">
            <Skeleton className="h-12 w-32 mb-8" />
            <Skeleton className="h-16 w-full mb-6" />
            <Skeleton className="h-6 w-64 mb-12" />
            <div className="grid lg:grid-cols-2 gap-12">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </Section>
      </Layout>
    );
  }

  if (!study) {
    return (
      <Layout>
        <Section className="pt-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Case Study Not Found</h1>
            <p className="text-muted-foreground mb-8">The case study you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/case-studies">View All Case Studies</Link>
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
        <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative">
          <Link
            to="/case-studies"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Case Studies
          </Link>
          
          <div className="max-w-4xl">
            {study.metadata?.services && (
              <div className="flex flex-wrap gap-2 mb-6">
                {(study.metadata.services as string[]).map((service: string) => (
                  <Badge key={service} variant="outline">{service}</Badge>
                ))}
              </div>
            )}
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {study.title}
            </h1>
            
            <div className="flex flex-wrap gap-6 text-muted-foreground">
              <div>
                <span className="text-foreground font-medium">Client:</span> {study.client_name || study.client || 'Unknown'}
              </div>
              {study.industry && (
                <div>
                  <span className="text-foreground font-medium">Industry:</span> {study.industry}
                </div>
              )}
              {study.project_duration && (
                <div>
                  <span className="text-foreground font-medium">Duration:</span> {study.project_duration}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {study.featured_image && (
        <Section>
          <div className="container mx-auto px-4">
            <img
              src={study.featured_image}
              alt={study.title}
              className="w-full rounded-lg"
            />
          </div>
        </Section>
      )}

      {/* Challenge & Solution */}
      <Section>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-destructive">The Challenge</h2>
              <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">
                {study.challenge}
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4 text-primary">Our Solution</h2>
              <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">
                {study.solution}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Results */}
      {study.results && (
        <Section variant="muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Results</h2>
            
            {typeof study.results === 'string' ? (
              <div className="max-w-3xl mx-auto">
                <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap text-center">
                  {study.results}
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {(study.results as any[]).map((result: any, index: number) => (
                  <Card key={index} className="bg-card/50 backdrop-blur border-border/50 text-center">
                    <CardContent className="p-6">
                      <div className="text-4xl font-bold gradient-text mb-2">{result.value || result}</div>
                      <div className="text-muted-foreground">{result.metric || result.label || 'Result'}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Testimonial */}
      {study.metadata?.testimonial && (
        <Section>
          <div className="container mx-auto px-4">
            <Card className="bg-card/50 backdrop-blur border-border/50 max-w-4xl mx-auto">
              <CardContent className="p-8 md:p-12">
                <Quote className="w-12 h-12 text-primary/20 mb-6" />
                <blockquote className="text-xl md:text-2xl font-medium mb-6 leading-relaxed">
                  "{study.metadata.testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold">{study.metadata.testimonial.author}</div>
                  <div className="text-muted-foreground">{study.metadata.testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>
      )}

      {/* Technologies */}
      {study.technologies && study.technologies.length > 0 && (
        <Section variant="muted">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-8">Technologies Used</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {study.technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-base py-2 px-4">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* CTA */}
      <Section>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Want Similar Results?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Let's discuss how we can help transform your business with a custom solution.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild className="glow-primary">
              <Link to="/quote">Start Your Project</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/case-studies">View More Case Studies</Link>
            </Button>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
