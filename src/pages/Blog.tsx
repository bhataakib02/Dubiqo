import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Section, SectionHeader } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";

const posts = [
  {
    id: "1",
    slug: "future-of-web-development-2024",
    title: "The Future of Web Development in 2024",
    excerpt: "Explore the latest trends shaping web development, from AI integration to edge computing.",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=400&fit=crop",
    category: "Technology",
    author: "Alex Morgan",
    date: "Nov 15, 2024",
    readTime: "5 min read",
  },
  {
    id: "2",
    slug: "why-your-business-needs-modern-website",
    title: "Why Your Business Needs a Modern Website",
    excerpt: "Discover how a well-designed website can transform your business and drive growth.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    category: "Business",
    author: "Sarah Chen",
    date: "Nov 10, 2024",
    readTime: "4 min read",
  },
  {
    id: "3",
    slug: "mastering-responsive-design",
    title: "Mastering Responsive Design: A Complete Guide",
    excerpt: "Learn the principles and techniques for creating websites that work on any device.",
    image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=800&h=400&fit=crop",
    category: "Design",
    author: "Michael Davis",
    date: "Nov 5, 2024",
    readTime: "8 min read",
  },
  {
    id: "4",
    slug: "seo-best-practices-2024",
    title: "SEO Best Practices for 2024",
    excerpt: "Stay ahead of the curve with these proven SEO strategies for the new year.",
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&h=400&fit=crop",
    category: "Marketing",
    author: "Emily Watson",
    date: "Oct 28, 2024",
    readTime: "6 min read",
  },
  {
    id: "5",
    slug: "building-scalable-web-applications",
    title: "Building Scalable Web Applications",
    excerpt: "Architecture patterns and best practices for applications that grow with your business.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
    category: "Development",
    author: "Alex Morgan",
    date: "Oct 20, 2024",
    readTime: "10 min read",
  },
  {
    id: "6",
    slug: "ecommerce-conversion-optimization",
    title: "E-Commerce Conversion Optimization Tips",
    excerpt: "Proven techniques to increase your online store's conversion rates.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
    category: "E-Commerce",
    author: "Sarah Chen",
    date: "Oct 15, 2024",
    readTime: "7 min read",
  },
];

export default function Blog() {
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Our <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Insights, tutorials, and industry news from the Dubiqo team.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <Section>
        <div className="container mx-auto px-4">
          <Link to={`/blog/${featuredPost.slug}`} className="group block">
            <Card className="overflow-hidden bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="aspect-video md:aspect-auto overflow-hidden">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <Badge variant="secondary" className="w-fit mb-4">
                    {featuredPost.category}
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {featuredPost.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </Section>

      {/* Other Posts */}
      <Section variant="muted">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Latest Articles"
            subtitle="Stay updated with our latest insights and tutorials."
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                <Card className="h-full overflow-hidden bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit mb-2">
                      {post.category}
                    </Badge>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{post.date}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </Section>
    </Layout>
  );
}
