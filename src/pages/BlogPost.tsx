import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, Clock, User, Share2, Twitter, Linkedin, Facebook } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  tags: string[] | null;
  featured_image: string | null;
  published_at: string | null;
  created_at: string;
  author?: {
    full_name: string | null;
    email: string | null;
  } | null;
};

const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return new Date().toLocaleDateString();
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

const getInitials = (name: string | null): string => {
  if (!name) return "A";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadPost(slug);
    }
  }, [slug]);

  const loadPost = async (postSlug: string) => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, author:profiles!blog_posts_author_id_fkey(full_name, email)')
        .eq('slug', postSlug)
        .eq('published', true)
        .single();

      if (error) throw error;
      setPost(data as BlogPost);
    } catch (error: any) {
      console.error('Error loading blog post:', error);
      if (error.code === 'PGRST116') {
        // Post not found
        setPost(null);
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
            <div className="grid lg:grid-cols-[1fr_300px] gap-12">
              <Skeleton className="h-96" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </Section>
      </Layout>
    );
  }

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
            {post.category && (
              <Badge variant="outline" className="mb-4">{post.category}</Badge>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              {post.author && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {getInitials(post.author.full_name)}
                  </div>
                  <div>
                    <div className="text-foreground font-medium">
                      {post.author.full_name || 'Anonymous'}
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(post.published_at || post.created_at)}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {calculateReadTime(post.content)}
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
              {post.featured_image && (
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full rounded-lg mb-8"
                />
              )}
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
              {post.tags && post.tags.length > 0 && (
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
              )}
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
