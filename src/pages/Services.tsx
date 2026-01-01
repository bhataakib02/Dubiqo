import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Section, SectionHeader } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import {
  ArrowRight,
  Globe,
  Layers,
  LineChart,
  ShoppingCart,
  Briefcase,
  Wrench,
  Headphones,
  CheckCircle,
  Image as ImageIcon,
  Code2,
  BarChart3,
} from 'lucide-react';

// Service illustration components (fallback when no image uploaded)
const ServiceIllustration = ({ serviceSlug }: { serviceSlug: string }) => {
  const illustrations: Record<string, JSX.Element> = {
    websites: (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
          <linearGradient id={`globeGrad-${serviceSlug}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="150" r="80" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.4" />
        <path d="M 120 150 Q 200 100 280 150" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.4" />
        <path d="M 120 150 Q 200 200 280 150" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.4" />
        <circle cx="200" cy="150" r="3" fill="hsl(var(--primary))" opacity="0.6" />
        <circle cx="200" cy="150" r="60" fill={`url(#globeGrad-${serviceSlug})`} opacity="0.3" />
      </svg>
    ),
    'web-apps': (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
          <linearGradient id={`layersGrad-${serviceSlug}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <rect x="100" y="80" width="200" height="40" rx="8" fill={`url(#layersGrad-${serviceSlug})`} opacity="0.4" />
        <rect x="120" y="120" width="200" height="40" rx="8" fill={`url(#layersGrad-${serviceSlug})`} opacity="0.5" />
        <rect x="140" y="160" width="200" height="40" rx="8" fill={`url(#layersGrad-${serviceSlug})`} opacity="0.6" />
        <line x1="100" y1="100" x2="320" y2="100" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.3" />
        <line x1="120" y1="140" x2="320" y2="140" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.3" />
        <line x1="140" y1="180" x2="340" y2="180" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.3" />
      </svg>
    ),
    dashboards: (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
          <linearGradient id={`chartGrad-${serviceSlug}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <rect x="80" y="200" width="30" height="60" rx="4" fill="hsl(var(--primary))" opacity="0.4" />
        <rect x="130" y="160" width="30" height="100" rx="4" fill="hsl(var(--primary))" opacity="0.5" />
        <rect x="180" y="140" width="30" height="120" rx="4" fill="hsl(var(--primary))" opacity="0.6" />
        <rect x="230" y="120" width="30" height="140" rx="4" fill="hsl(var(--primary))" opacity="0.7" />
        <rect x="280" y="150" width="30" height="110" rx="4" fill="hsl(var(--primary))" opacity="0.5" />
        <path d="M 95 200 L 145 160 L 195 140 L 245 120 L 295 150" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" opacity="0.5" />
        <circle cx="95" cy="200" r="4" fill="hsl(var(--primary))" opacity="0.7" />
        <circle cx="145" cy="160" r="4" fill="hsl(var(--primary))" opacity="0.7" />
        <circle cx="195" cy="140" r="4" fill="hsl(var(--primary))" opacity="0.7" />
        <circle cx="245" cy="120" r="4" fill="hsl(var(--primary))" opacity="0.7" />
        <circle cx="295" cy="150" r="4" fill="hsl(var(--primary))" opacity="0.7" />
      </svg>
    ),
    ecommerce: (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
          <linearGradient id={`cartGrad-${serviceSlug}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <rect x="120" y="140" width="160" height="100" rx="12" fill={`url(#cartGrad-${serviceSlug})`} opacity="0.4" />
        <rect x="140" y="160" width="40" height="30" rx="4" fill="hsl(var(--primary))" opacity="0.3" />
        <rect x="200" y="160" width="40" height="30" rx="4" fill="hsl(var(--primary))" opacity="0.3" />
        <rect x="260" y="160" width="40" height="30" rx="4" fill="hsl(var(--primary))" opacity="0.3" />
        <circle cx="150" cy="220" r="8" fill="hsl(var(--primary))" opacity="0.4" />
        <circle cx="250" cy="220" r="8" fill="hsl(var(--primary))" opacity="0.4" />
        <path d="M 100 180 L 120 140" stroke="hsl(var(--primary))" strokeWidth="3" opacity="0.4" />
        <path d="M 300 180 L 280 140" stroke="hsl(var(--primary))" strokeWidth="3" opacity="0.4" />
      </svg>
    ),
    portfolios: (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
          <linearGradient id={`portfolioGrad-${serviceSlug}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <rect x="100" y="100" width="80" height="100" rx="8" fill={`url(#portfolioGrad-${serviceSlug})`} opacity="0.4" />
        <rect x="110" y="110" width="60" height="40" rx="4" fill="hsl(var(--primary))" opacity="0.3" />
        <line x1="110" y1="160" x2="170" y2="160" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.3" />
        <line x1="110" y1="175" x2="150" y2="175" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.3" />
        <rect x="220" y="100" width="80" height="100" rx="8" fill={`url(#portfolioGrad-${serviceSlug})`} opacity="0.5" />
        <rect x="230" y="110" width="60" height="40" rx="4" fill="hsl(var(--primary))" opacity="0.3" />
        <line x1="230" y1="160" x2="290" y2="160" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.3" />
        <line x1="230" y1="175" x2="270" y2="175" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.3" />
      </svg>
    ),
    repair: (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
          <linearGradient id={`repairGrad-${serviceSlug}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <rect x="150" y="120" width="100" height="60" rx="8" fill={`url(#repairGrad-${serviceSlug})`} opacity="0.4" />
        <circle cx="200" cy="150" r="20" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" opacity="0.4" />
        <path d="M 180 150 L 220 150 M 200 130 L 200 170" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
        <path d="M 120 100 L 150 120 M 280 100 L 250 120" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.3" />
        <path d="M 120 200 L 150 180 M 280 200 L 250 180" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.3" />
      </svg>
    ),
    maintenance: (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
          <linearGradient id={`maintenanceGrad-${serviceSlug}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="150" r="60" fill={`url(#maintenanceGrad-${serviceSlug})`} opacity="0.3" />
        <circle cx="200" cy="150" r="40" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.4" />
        <path d="M 200 110 L 200 130 M 200 170 L 200 190 M 170 150 L 150 150 M 250 150 L 230 150" stroke="hsl(var(--primary))" strokeWidth="3" opacity="0.4" />
        <circle cx="200" cy="150" r="4" fill="hsl(var(--primary))" opacity="0.6" />
        <path d="M 180 120 Q 200 100 220 120" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.3" />
      </svg>
    ),
  };

  return illustrations[serviceSlug] || (
    <div className="w-full h-full flex items-center justify-center">
      <Globe className="w-24 h-24 text-primary/30" />
    </div>
  );
};

// Icon mapping
const iconMap: Record<string, any> = {
  Globe,
  Layers,
  LineChart,
  ShoppingCart,
  Briefcase,
  Wrench,
  Headphones,
  Code2,
  BarChart3,
};

type ServiceData = {
  icon: any;
  title: string;
  slug: string;
  description: string;
  features: string[];
  pricing: string;
};

export default function Services() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [serviceImages, setServiceImages] = useState<Record<string, string>>({});
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadServices();
    loadServiceImages();
  }, []);

  const loadServices = async () => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('published', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      const servicesData: ServiceData[] = (data || []).map((s) => ({
        icon: iconMap[s.icon_name || 'Globe'] || Globe,
        title: s.title,
        slug: s.slug,
        description: s.short_description || s.description,
        features: s.features || [],
        pricing: s.pricing_text || 'Contact us',
      }));

      setServices(servicesData);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadServiceImages = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('services')
        .select('slug, image_url')
        .eq('published', true);

      if (error) throw error;

      const imagesMap: Record<string, string> = {};
      data?.forEach((item) => {
        if (item.image_url) {
          imagesMap[item.slug] = item.image_url;
        }
      });
      setServiceImages(imagesMap);
    } catch (error) {
      console.error('Error loading service images:', error);
    }
  };

  const handleImageError = (slug: string) => {
    setFailedImages((prev) => new Set(prev).add(slug));
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[100px]" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Our <span className="gradient-text">Services</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              From simple landing pages to complex web applications, we deliver solutions tailored
              to your unique needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <Section>
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-16">
              {services.map((service, index) => (
              <div
                key={service.slug}
                id={service.slug}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{service.title}</h2>
                  <p className="text-lg text-muted-foreground mb-6">{service.description}</p>

                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-2xl font-bold text-primary">{service.pricing}</span>
                    <Button asChild>
                      <Link to={`/quote?service=${service.slug}`}>
                        Get Quote
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <Card className="bg-card/50 backdrop-blur border-border/50 overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 relative overflow-hidden">
                      {serviceImages[service.slug] && !failedImages.has(service.slug) ? (
                        <img
                          src={serviceImages[service.slug]}
                          alt={service.title}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(service.slug)}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ServiceIllustration serviceSlug={service.slug} />
                        </div>
                      )}
                    </div>
                  </Card>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Not sure which service you need?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Book a free consultation and we'll help you find the perfect solution for your business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/booking">Book Free Consultation</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
