import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Section, SectionHeader } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
} from 'lucide-react';

const services = [
  {
    icon: Globe,
    title: 'Custom Websites',
    slug: 'websites',
    description: 'Beautiful, responsive websites that convert visitors into customers.',
    features: [
      'Responsive design for all devices',
      'SEO optimization included',
      'Fast loading speeds',
      'Content management system',
      'Analytics integration',
      'Security best practices',
    ],
    pricing: 'From ₹1,99,900',
  },
  {
    icon: Layers,
    title: 'Web Applications',
    slug: 'web-apps',
    description: 'Full-stack applications with modern architecture and seamless UX.',
    features: [
      'Custom functionality',
      'User authentication',
      'Database integration',
      'API development',
      'Real-time features',
      'Scalable architecture',
    ],
    pricing: 'From ₹6,49,900',
  },
  {
    icon: LineChart,
    title: 'Dashboards',
    slug: 'dashboards',
    description: 'Data visualization and admin panels that drive decisions.',
    features: [
      'Interactive charts & graphs',
      'Real-time data updates',
      'Custom KPI tracking',
      'Export capabilities',
      'Role-based access',
      'Mobile responsive',
    ],
    pricing: 'From ₹3,99,900',
  },
  {
    icon: ShoppingCart,
    title: 'E-Commerce',
    slug: 'ecommerce',
    description: 'Online stores optimized for conversions and growth.',
    features: [
      'Product management',
      'Secure checkout',
      'Payment integration',
      'Inventory tracking',
      'Order management',
      'Marketing tools',
    ],
    pricing: 'From ₹4,99,900',
  },
  {
    icon: Briefcase,
    title: 'Portfolio Making',
    slug: 'portfolios',
    description: 'Professional portfolios for showcasing your work and attracting clients.',
    features: [
      'Showcase your projects',
      'Responsive design',
      'SEO optimized',
      'Contact forms',
      'Social media integration',
      'Fast loading speeds',
    ],
    pricing: 'From ₹4,99,900',
  },
  {
    icon: Wrench,
    title: 'Site Repair',
    slug: 'repair',
    description: 'Fix broken sites, improve performance, resolve issues.',
    features: [
      'Bug fixing',
      'Performance optimization',
      'Security patches',
      'Mobile responsiveness',
      'Browser compatibility',
      'Code cleanup',
    ],
    pricing: 'From ₹39,900',
  },
  {
    icon: Headphones,
    title: 'Maintenance',
    slug: 'maintenance',
    description: 'Ongoing support, updates, and peace of mind.',
    features: [
      'Regular updates',
      'Security monitoring',
      'Performance checks',
      'Content updates',
      'Technical support',
      'Backup management',
    ],
    pricing: 'From ₹14,900/mo',
  },
];

export default function Services() {
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
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <service.icon className="w-24 h-24 text-primary/30" />
                    </div>
                  </Card>
                </div>
              </div>
            ))}
          </div>
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
