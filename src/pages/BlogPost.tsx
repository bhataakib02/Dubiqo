import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, User, Share2, Twitter, Linkedin, Facebook } from "lucide-react";

const blogPostsData: Record<string, {
  title: string;
  excerpt: string;
  content: string;
  author: { name: string; avatar: string; role: string };
  date: string;
  readTime: string;
  category: string;
  tags: string[];
}> = {
  "modern-web-development-2024": {
    title: "Modern Web Development in 2024: Trends and Best Practices",
    excerpt: "Explore the latest trends shaping web development and learn best practices for building modern applications.",
    content: `
# Modern Web Development in 2024

The web development landscape continues to evolve at a rapid pace. In this article, we'll explore the key trends and best practices that are shaping modern web development.

## The Rise of Server Components

React Server Components have revolutionized how we think about building React applications. By rendering components on the server, we can significantly reduce the JavaScript bundle size sent to the client.

## Edge Computing

Edge functions are becoming increasingly popular for handling API requests closer to users. This reduces latency and improves the overall user experience.

## AI-Powered Development

AI tools are becoming integral to the development workflow, from code completion to automated testing and bug detection.

## Best Practices

1. **Performance First**: Optimize for Core Web Vitals
2. **Accessibility**: Build inclusive experiences for all users
3. **Security**: Implement proper authentication and data protection
4. **Testing**: Maintain comprehensive test coverage

## Conclusion

Staying current with web development trends is essential for building competitive applications. Focus on fundamentals while adopting new technologies thoughtfully.
    `,
    author: { name: "Alex Johnson", avatar: "AJ", role: "Lead Developer" },
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Development",
    tags: ["React", "Web Development", "Trends", "Best Practices"]
  },
  "building-scalable-applications": {
    title: "Building Scalable Applications: Architecture Patterns",
    excerpt: "Learn essential architecture patterns for building applications that can scale with your business.",
    content: `
# Building Scalable Applications

Scalability is crucial for any application expecting growth. Let's explore the architecture patterns that enable applications to handle increasing loads.

## Microservices vs Monolith

The choice between microservices and monolithic architecture depends on your team size, complexity, and scaling requirements.

## Database Scaling Strategies

- Read replicas for heavy read workloads
- Sharding for horizontal scaling
- Caching layers with Redis or Memcached

## Message Queues

Asynchronous processing with message queues like RabbitMQ or Apache Kafka can help manage peak loads.

## Conclusion

Building scalable applications requires careful planning and the right architecture choices from the start.
    `,
    author: { name: "Sarah Chen", avatar: "SC", role: "Solutions Architect" },
    date: "2024-01-10",
    readTime: "12 min read",
    category: "Architecture",
    tags: ["Scalability", "Architecture", "Microservices", "Database"]
  }
};

export default function BlogPost() {
  const { slug } = useParams();
  const post = blogPostsData[slug || ""];

  if (!post) {
    return (
      <Layout>
        <Section className="pt-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/blog">View All Posts</Link>
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
            to="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          
          <div className="max-w-4xl">
            <Badge variant="outline" className="mb-4">{post.category}</Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  {post.author.avatar}
                </div>
                <div>
                  <div className="text-foreground font-medium">{post.author.name}</div>
                  <div className="text-sm">{post.author.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <Section>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[1fr_300px] gap-12">
            <article className="prose prose-invert prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {post.content}
              </div>
            </article>
            
            <aside className="space-y-6">
              {/* Share */}
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share this post
                  </h3>
                  <div className="flex gap-3">
                    <Button variant="outline" size="icon">
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Facebook className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Tags */}
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Need Help With Your Project?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Let's discuss how we can help bring your ideas to life.
          </p>
          <Button size="lg" asChild className="glow-primary">
            <Link to="/contact">Get in Touch</Link>
          </Button>
        </div>
      </Section>
    </Layout>
  );
}
