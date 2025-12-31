import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Section, SectionHeader } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image: string | null;
  category: string | null;
  tags: string[] | null;
  published: boolean;
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
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }
    
    try {
      // Only load posts where published is explicitly true (not null or false)
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, author:profiles!blog_posts_author_id_fkey(full_name, email)')
        .eq('published', true)  // Only published posts
        .not('published', 'is', null)  // Exclude null values
        .order('published_at', { ascending: false, nullsLast: true })
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error loading blog posts:', error);
        throw error;
      }
      
      console.log('Loaded blog posts:', data?.length || 0, 'published posts');
      setPosts((data || []) as BlogPost[]);
    } catch (error) {
      console.error('Error loading blog posts:', error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

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
      {isLoading ? (
        <Section>
          <div className="container mx-auto px-4">
            <Card className="overflow-hidden bg-card/50 backdrop-blur border-border/50">
              <div className="grid md:grid-cols-2 gap-0">
                <Skeleton className="aspect-video md:aspect-auto w-full h-full" />
                <div className="p-8 space-y-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </Card>
          </div>
        </Section>
      ) : featuredPost ? (
        <Section>
          <div className="container mx-auto px-4">
            <Link to={`/blog/${featuredPost.slug}`} className="group block">
              <Card className="overflow-hidden bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="aspect-video md:aspect-auto overflow-hidden bg-muted">
                    {featuredPost.featured_image ? (
                      <img
                        src={featuredPost.featured_image}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    {featuredPost.category && (
                      <Badge variant="secondary" className="w-fit mb-4">
                        {featuredPost.category}
                      </Badge>
                    )}
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {featuredPost.excerpt || 'No excerpt available'}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {featuredPost.author?.full_name && (
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {featuredPost.author.full_name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(featuredPost.published_at || featuredPost.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </Section>
      ) : null}

      {/* Other Posts */}
      <Section variant="muted">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Latest Articles"
            subtitle="Stay updated with our latest insights and tutorials."
          />
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="h-full overflow-hidden bg-card/50 backdrop-blur border-border/50">
                  <Skeleton className="aspect-video w-full" />
                  <CardHeader>
                    <Skeleton className="h-5 w-20 mb-2" />
                    <Skeleton className="h-6 w-full mb-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : otherPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No blog posts available yet.</p>
              <p className="text-muted-foreground text-sm mt-2">Check back soon for new articles!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                  <Card className="h-full overflow-hidden bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all">
                    <div className="aspect-video overflow-hidden bg-muted">
                      {post.featured_image ? (
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                          No Image
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      {post.category && (
                        <Badge variant="secondary" className="w-fit mb-2">
                          {post.category}
                        </Badge>
                      )}
                      <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {post.excerpt || 'No excerpt available'}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{formatDate(post.published_at || post.created_at)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </Section>
    </Layout>
  );
}
