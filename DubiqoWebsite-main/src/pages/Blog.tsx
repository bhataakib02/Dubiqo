import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, User, ArrowRight, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Blog = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const articles = [
    {
      title: "5 Things Your Business Website Must Have in 2025",
      slug: "5-things-business-website-2025",
      excerpt: "The digital landscape is evolving. Here are the essential elements every business website needs to succeed in 2025.",
      author: "Rohan Sharma",
      date: "March 15, 2025",
      category: "Web Development",
      readTime: "5 min read",
    },
    {
      title: "How to Create a Strong Portfolio as a Student",
      slug: "student-portfolio-guide",
      excerpt: "Your portfolio is your ticket to landing your first job or internship. Here's how to make it stand out from the crowd.",
      author: "Priya Mehta",
      date: "March 10, 2025",
      category: "Career Tips",
      readTime: "7 min read",
    },
    {
      title: "Why Your Website is Slow (And What We Do to Fix It)",
      slug: "website-speed-optimization",
      excerpt: "Slow websites lose customers. Learn about common performance issues and how we optimize for lightning-fast load times.",
      author: "Amit Patel",
      date: "March 5, 2025",
      category: "Performance",
      readTime: "6 min read",
    },
    {
      title: "Do You Really Need a Custom Billing System?",
      slug: "custom-billing-system-guide",
      excerpt: "Many businesses waste time with spreadsheets and manual invoicing. Here's when a custom billing system makes sense.",
      author: "Rohan Sharma",
      date: "February 28, 2025",
      category: "Business Tools",
      readTime: "4 min read",
    },
    {
      title: "How Maintenance Plans Save You From Big Problems Later",
      slug: "website-maintenance-importance",
      excerpt: "Prevention is better than cure. Why ongoing website maintenance is crucial for long-term success.",
      author: "Sarah Johnson",
      date: "February 20, 2025",
      category: "Maintenance",
      readTime: "5 min read",
    },
    {
      title: "The Hidden Costs of DIY Website Builders",
      slug: "diy-website-builder-costs",
      excerpt: "Wix and Squarespace seem affordable at first, but are they really? We break down the true costs over time.",
      author: "Rohan Sharma",
      date: "February 15, 2025",
      category: "Business",
      readTime: "6 min read",
    },
    {
      title: "Converting Your Design to Code: What You Need to Know",
      slug: "design-to-code-guide",
      excerpt: "Have a great design but don't know how to bring it to life? Here's what the development process actually involves.",
      author: "Amit Patel",
      date: "February 10, 2025",
      category: "Web Development",
      readTime: "8 min read",
    },
    {
      title: "Security Basics Every Website Owner Should Know",
      slug: "website-security-basics",
      excerpt: "Your website is a target. Learn about common security threats and how to protect your site and user data.",
      author: "Sarah Johnson",
      date: "February 5, 2025",
      category: "Security",
      readTime: "7 min read",
    },
  ];

  const categories = ["All", "Web Development", "Career Tips", "Performance", "Business Tools", "Security", "Maintenance", "Business"];

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
      const matchesSearch = searchQuery === "" || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Subscribed Successfully! ✓",
      description: "You'll receive our latest articles in your inbox.",
    });
    setNewsletterEmail("");
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Dubiqo Blog
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
            Web development tips, business insights, and practical advice for building and growing your online presence
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/60" />
              <Input
                placeholder="Search articles..."
                className="pl-10 bg-muted/50 border-border/40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-card/30 border-b border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={selectedCategory === category ? "gradient-primary" : "border-border/40"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-foreground/60">No articles found matching your criteria.</p>
              <Button 
                variant="link" 
                className="text-primary mt-2"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => (
                <Link key={index} to={`/blog/${article.slug}`}>
                  <Card className="glass border-border/40 hover:border-primary/50 transition-all duration-300 group h-full">
                    <div className="h-48 bg-gradient-primary relative overflow-hidden">
                      <div className="absolute inset-0 bg-background/20 group-hover:bg-background/0 transition-all duration-300" />
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
                          {article.category}
                        </span>
                        <span className="text-xs text-foreground/60">{article.readTime}</span>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="pt-2 line-clamp-3">{article.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-foreground/60">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{article.date}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-primary font-medium text-sm">
                        Read More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <Card className="glass border-primary glow max-w-3xl mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Never Miss an Article</h2>
              <p className="text-foreground/70 mb-6">
                Get web development tips and business insights delivered to your inbox
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="bg-muted/50 border-border/40"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
                <Button type="submit" className="gradient-primary">
                  Subscribe
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Blog;
