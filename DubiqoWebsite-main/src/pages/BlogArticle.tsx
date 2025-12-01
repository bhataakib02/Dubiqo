import { Link, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, User, ArrowLeft, Clock, Tag, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const BlogArticle = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Subscribed Successfully! ✓",
      description: "You'll receive our latest articles.",
    });
    setNewsletterEmail("");
    setIsSubmitting(false);
  };

  // Article content database
  const articles: Record<string, {
    title: string;
    author: string;
    date: string;
    category: string;
    readTime: string;
    content: React.ReactNode;
  }> = {
    "5-things-business-website-2025": {
      title: "5 Things Your Business Website Must Have in 2025",
      author: "Rohan Sharma",
      date: "March 15, 2025",
      category: "Web Development",
      readTime: "5 min read",
      content: (
        <>
          <p>The digital landscape continues to evolve rapidly. What worked for websites five years ago may not cut it in 2025. If you want your business to thrive online, your website needs to meet modern expectations. Here are five essential elements every business website must have.</p>

          <h2>1. Lightning-Fast Load Times</h2>
          <p>Users expect websites to load in under 3 seconds. Anything slower, and they'll bounce to a competitor. In 2025, this isn't just about user experience—it's about survival. Google heavily factors page speed into rankings, and slow sites get buried.</p>
          <p>To achieve fast load times:</p>
          <ul>
            <li>Optimize and compress images</li>
            <li>Use modern image formats like WebP</li>
            <li>Implement lazy loading for below-the-fold content</li>
            <li>Choose a fast, reliable hosting provider</li>
            <li>Minimize JavaScript and CSS bloat</li>
          </ul>

          <h2>2. Mobile-First Design</h2>
          <p>Over 60% of web traffic now comes from mobile devices. Your website must be designed for mobile first, not as an afterthought. This means:</p>
          <ul>
            <li>Touch-friendly buttons and navigation</li>
            <li>Readable text without zooming</li>
            <li>Fast mobile load times (even on slower connections)</li>
            <li>Simplified forms for mobile input</li>
          </ul>

          <h2>3. Clear Value Proposition</h2>
          <p>Within 5 seconds of landing on your homepage, visitors should understand what you do and why they should care. This means having a clear, compelling headline that speaks to your target audience's needs—not just a description of your services.</p>
          <p>Ask yourself: If someone landed on your homepage with no context, would they immediately understand your value?</p>

          <h2>4. Trust Signals</h2>
          <p>People are skeptical online. They need reassurance before they'll contact you or make a purchase. Essential trust signals include:</p>
          <ul>
            <li>Client testimonials with real names and photos</li>
            <li>Case studies showing actual results</li>
            <li>Industry certifications or awards</li>
            <li>Secure payment indicators</li>
            <li>Clear contact information and physical address</li>
          </ul>

          <h2>5. Strategic Calls-to-Action</h2>
          <p>Every page on your website should guide visitors toward a next step. Whether it's "Get a Quote," "Book a Call," or "Learn More," your CTAs should be visible, compelling, and relevant to the page content.</p>
          <p>Don't make visitors hunt for how to contact you. Make it obvious and easy.</p>

          <h2>Ready to Upgrade Your Website?</h2>
          <p>If your website is missing any of these elements, it's time for an upgrade. At Dubiqo, we build modern, fast, conversion-focused websites that help your business grow. Contact us for a free consultation.</p>
        </>
      ),
    },
    "student-portfolio-guide": {
      title: "How to Create a Strong Portfolio as a Student",
      author: "Priya Mehta",
      date: "March 10, 2025",
      category: "Career Tips",
      readTime: "7 min read",
      content: (
        <>
          <p>Your portfolio is often your first impression to potential employers or clients. As a student, you might feel like you don't have enough "real" work to show—but that's not true. Here's how to build a portfolio that stands out.</p>

          <h2>Start with What You Have</h2>
          <p>You likely have more portfolio-worthy work than you think:</p>
          <ul>
            <li>Class projects and assignments</li>
            <li>Personal projects or side experiments</li>
            <li>Volunteer work or pro-bono projects</li>
            <li>Contributions to open-source projects</li>
            <li>Hackathon projects</li>
          </ul>

          <h2>Quality Over Quantity</h2>
          <p>It's better to show 3-5 strong projects than 15 mediocre ones. For each project you include:</p>
          <ul>
            <li>Explain the problem you were solving</li>
            <li>Describe your process and decision-making</li>
            <li>Show the final result with screenshots or demos</li>
            <li>Share what you learned</li>
          </ul>

          <h2>Create Projects That Fill Gaps</h2>
          <p>If you want to work in a specific area but don't have projects in that space, create them. Want to design mobile apps? Design a concept app. Want to build e-commerce sites? Build a demo store.</p>
          <p>These projects show initiative and prove you can do the work you want to be hired for.</p>

          <h2>Make It Personal</h2>
          <p>Your portfolio should reflect who you are. Include:</p>
          <ul>
            <li>An about section that shows your personality</li>
            <li>Your interests and what drives you</li>
            <li>Your goals and the kind of work you want</li>
          </ul>

          <h2>Keep It Updated</h2>
          <p>A portfolio is never "done." Regularly update it with new work, remove older pieces that no longer represent your best, and refine your presentation.</p>

          <h2>Need Help Building Your Portfolio?</h2>
          <p>We specialize in creating professional portfolio websites for students and emerging professionals. Starting at just ₹4,999, you can have a portfolio that truly represents your potential.</p>
        </>
      ),
    },
    "website-speed-optimization": {
      title: "Why Your Website is Slow (And What We Do to Fix It)",
      author: "Amit Patel",
      date: "March 5, 2025",
      category: "Performance",
      readTime: "6 min read",
      content: (
        <>
          <p>A slow website costs you visitors, customers, and search rankings. If your site takes more than 3 seconds to load, you're losing up to 40% of visitors before they even see your content. Let's look at common causes and solutions.</p>

          <h2>Common Causes of Slow Websites</h2>

          <h3>1. Unoptimized Images</h3>
          <p>Large, uncompressed images are the #1 cause of slow websites. A single hero image can be several megabytes if not optimized—that's larger than your entire HTML, CSS, and JavaScript combined.</p>

          <h3>2. Too Many HTTP Requests</h3>
          <p>Every script, stylesheet, image, and font file requires a separate request to the server. More requests = slower load time.</p>

          <h3>3. Poor Hosting</h3>
          <p>Cheap shared hosting might save money, but it often means slow servers, limited resources, and poor uptime. Your hosting choice has a massive impact on performance.</p>

          <h3>4. Bloated Code</h3>
          <p>WordPress themes with dozens of unused features, excessive plugins, or poorly written custom code can significantly slow down your site.</p>

          <h3>5. No Caching</h3>
          <p>Without caching, the server has to regenerate pages from scratch for every visitor. This is slow and wasteful.</p>

          <h2>How We Fix Performance Issues</h2>

          <h3>Image Optimization</h3>
          <p>We compress images without visible quality loss, convert to modern formats like WebP, and implement lazy loading so images only load when needed.</p>

          <h3>Code Optimization</h3>
          <p>We minify CSS and JavaScript, remove unused code, and optimize the critical rendering path so essential content loads first.</p>

          <h3>Hosting Recommendations</h3>
          <p>We help you choose hosting that matches your needs—whether that's Vercel for Next.js sites, managed WordPress hosting, or VPS solutions for custom applications.</p>

          <h3>Caching Implementation</h3>
          <p>We set up browser caching, server-side caching, and CDN distribution to serve content from locations closest to your visitors.</p>

          <h2>Real Results</h2>
          <p>We've helped clients reduce load times from 8+ seconds to under 2 seconds. The result? Lower bounce rates, higher engagement, and better conversions.</p>

          <p>Is your website slow? Contact us for a free performance audit.</p>
        </>
      ),
    },
    "custom-billing-system-guide": {
      title: "Do You Really Need a Custom Billing System?",
      author: "Rohan Sharma",
      date: "February 28, 2025",
      category: "Business Tools",
      readTime: "4 min read",
      content: (
        <>
          <p>Managing invoices through spreadsheets? Chasing payments manually? You're not alone—many businesses start this way. But at some point, a custom billing system makes sense. Here's how to know when you've reached that point.</p>

          <h2>Signs You Need a Custom Billing System</h2>
          <ul>
            <li>You're spending hours each week on invoicing and payment tracking</li>
            <li>You've lost track of who owes you money</li>
            <li>Clients ask for professional invoices you can't easily generate</li>
            <li>You need recurring billing but are doing it manually</li>
            <li>You want automatic payment reminders</li>
            <li>You need detailed financial reports</li>
          </ul>

          <h2>What a Custom Billing System Can Do</h2>
          <p>Unlike generic tools, a custom system is built around your specific workflow:</p>
          <ul>
            <li>Generate invoices with your branding in seconds</li>
            <li>Accept online payments via Razorpay, Stripe, or UPI</li>
            <li>Automatic payment reminders at intervals you set</li>
            <li>Dashboard showing outstanding vs. received payments</li>
            <li>Client portal where customers can view and pay invoices</li>
            <li>Integration with your existing tools and processes</li>
          </ul>

          <h2>Off-the-Shelf vs. Custom</h2>
          <p>Tools like Zoho Invoice or FreshBooks work for many businesses. But they come with limitations—you're locked into their workflow, their pricing increases as you grow, and customization is limited.</p>
          <p>A custom system costs more upfront but pays for itself through time saved and a workflow that fits your exact needs.</p>

          <h2>Is It Right for You?</h2>
          <p>A custom billing system makes sense if:</p>
          <ul>
            <li>You bill more than 10-15 clients per month</li>
            <li>You have recurring billing requirements</li>
            <li>You want to eliminate manual payment tracking</li>
            <li>You need specific features off-the-shelf tools don't provide</li>
          </ul>

          <p>Not sure? Let's talk. We can assess your needs and recommend the right approach—sometimes a simple tool is enough, and we'll tell you that.</p>
        </>
      ),
    },
    "website-maintenance-importance": {
      title: "How Maintenance Plans Save You From Big Problems Later",
      author: "Sarah Johnson",
      date: "February 20, 2025",
      category: "Maintenance",
      readTime: "5 min read",
      content: (
        <>
          <p>Your website isn't a "set it and forget it" asset. Like a car, it needs regular maintenance to run smoothly. Skip maintenance, and you'll eventually face expensive repairs—or worse, a complete breakdown.</p>

          <h2>What Happens Without Maintenance</h2>
          <ul>
            <li><strong>Security vulnerabilities:</strong> Outdated software is the #1 cause of hacks</li>
            <li><strong>Broken features:</strong> Browser updates can break old code</li>
            <li><strong>Performance degradation:</strong> Sites slow down over time without optimization</li>
            <li><strong>SEO decline:</strong> Outdated sites get deprioritized by search engines</li>
            <li><strong>Incompatibility:</strong> Old tech becomes harder to update or fix</li>
          </ul>

          <h2>What's Included in a Maintenance Plan</h2>
          <p>Our maintenance plans cover:</p>
          <ul>
            <li>Regular software and security updates</li>
            <li>Weekly backups (so you never lose data)</li>
            <li>Performance monitoring and optimization</li>
            <li>Uptime monitoring with immediate alerts</li>
            <li>Content updates (text, images, new pages)</li>
            <li>Priority support when issues arise</li>
          </ul>

          <h2>The Cost of Not Having Maintenance</h2>
          <p>A hacked website can cost thousands to recover—plus lost business and damaged reputation. Emergency fixes outside a plan are expensive and stressful. Regular maintenance is a fraction of the cost of dealing with problems after they happen.</p>

          <h2>Peace of Mind</h2>
          <p>With a maintenance plan, you don't have to worry about your website. We handle everything proactively, so problems are prevented before they affect your business.</p>

          <p>Our plans start at ₹2,000/month. That's peace of mind for less than the cost of a single emergency fix.</p>
        </>
      ),
    },
    "diy-website-builder-costs": {
      title: "The Hidden Costs of DIY Website Builders",
      author: "Rohan Sharma",
      date: "February 15, 2025",
      category: "Business",
      readTime: "6 min read",
      content: (
        <>
          <p>Wix, Squarespace, and WordPress.com promise affordable websites with no coding required. And they deliver—initially. But the true cost over time tells a different story.</p>

          <h2>The Advertised Price vs. Reality</h2>
          <p>A typical Wix "Business" plan costs around ₹350/month. Sounds affordable, right? But add in:</p>
          <ul>
            <li>Premium templates: ₹2,000-10,000</li>
            <li>Essential apps/plugins: ₹500-2,000/month</li>
            <li>Premium fonts: ₹1,000-3,000</li>
            <li>Storage upgrades: ₹200-500/month</li>
            <li>Email hosting: ₹200-500/month</li>
          </ul>
          <p>Suddenly that ₹350/month is ₹1,000-3,000/month—every month, for as long as you have the site.</p>

          <h2>The Time Cost</h2>
          <p>DIY builders are "easy"—until you try to do something they don't support out of the box. Then you're watching tutorials, fighting with templates, and spending hours on something a developer could do in minutes.</p>
          <p>What's your time worth? If you spend 20 hours building and tweaking a DIY site, at even ₹500/hour of your time, that's ₹10,000—more than our Starter package.</p>

          <h2>The Quality Gap</h2>
          <p>Templates look good in demos. But customizing them to match your brand, with your content, rarely looks as polished as a custom design. And your competitors might be using the exact same template.</p>

          <h2>The Migration Headache</h2>
          <p>When you outgrow a DIY builder (and you will), migrating is painful. Your content is often locked in their format. Your domain might be tied to their system. Moving to something professional means essentially starting over.</p>

          <h2>When DIY Makes Sense</h2>
          <p>DIY builders can work for:</p>
          <ul>
            <li>Personal blogs or hobby projects</li>
            <li>Very early-stage testing before committing</li>
            <li>Temporary sites for one-off events</li>
          </ul>
          <p>But for a business that wants to grow, professional development pays for itself.</p>

          <h2>Compare the Numbers</h2>
          <p>3 years of a DIY builder with extras: ₹36,000-108,000<br />
          Professional website (one-time): ₹9,999-14,999<br />
          Plus maintenance if desired: ₹24,000-72,000 over 3 years</p>
          <p>For similar or lower cost, you get a professional, custom site that truly represents your brand.</p>
        </>
      ),
    },
    "design-to-code-guide": {
      title: "Converting Your Design to Code: What You Need to Know",
      author: "Amit Patel",
      date: "February 10, 2025",
      category: "Web Development",
      readTime: "8 min read",
      content: (
        <>
          <p>You have a beautiful Figma design. Now you need to turn it into a working website. Here's what that process actually involves and what to expect.</p>

          <h2>The Design-to-Code Process</h2>

          <h3>1. Design Review & Clarification</h3>
          <p>Before coding begins, developers review the design to:</p>
          <ul>
            <li>Understand the structure and components</li>
            <li>Identify any missing states (hover, mobile, error states)</li>
            <li>Note any functionality that needs discussion</li>
            <li>Flag potential accessibility issues</li>
          </ul>

          <h3>2. Technical Planning</h3>
          <p>The developer decides:</p>
          <ul>
            <li>How to structure the HTML semantically</li>
            <li>Which CSS approach to use (Tailwind, modules, styled-components)</li>
            <li>How to handle responsive behavior</li>
            <li>What components to create for reuse</li>
          </ul>

          <h3>3. Development</h3>
          <p>The actual coding happens in stages:</p>
          <ul>
            <li>Base layout and structure</li>
            <li>Individual components</li>
            <li>Styling to match the design</li>
            <li>Responsive adjustments</li>
            <li>Animations and interactions</li>
            <li>Functionality (forms, navigation, etc.)</li>
          </ul>

          <h3>4. Testing & Refinement</h3>
          <p>The site is tested across:</p>
          <ul>
            <li>Multiple browsers (Chrome, Safari, Firefox, Edge)</li>
            <li>Multiple devices (desktop, tablet, mobile)</li>
            <li>Various screen sizes</li>
          </ul>

          <h2>What Makes a "Developer-Friendly" Design</h2>
          <ul>
            <li>Consistent spacing and sizing</li>
            <li>Defined typography scale</li>
            <li>Clear component patterns</li>
            <li>All states included (hover, active, disabled)</li>
            <li>Mobile breakpoints considered</li>
          </ul>

          <h2>Common Surprises</h2>
          <p>Things that often aren't considered in static designs:</p>
          <ul>
            <li>What happens when text is longer than expected?</li>
            <li>How does the nav behave on mobile?</li>
            <li>What loading states should look like?</li>
            <li>Error messages and form validation</li>
          </ul>

          <h2>How Long Does It Take?</h2>
          <p>For a typical 5-page website:</p>
          <ul>
            <li>Simple static: 1-2 weeks</li>
            <li>With CMS integration: 2-3 weeks</li>
            <li>With complex functionality: 3-4+ weeks</li>
          </ul>

          <p>Have a design that needs coding? We'd love to help bring it to life.</p>
        </>
      ),
    },
    "website-security-basics": {
      title: "Security Basics Every Website Owner Should Know",
      author: "Sarah Johnson",
      date: "February 5, 2025",
      category: "Security",
      readTime: "7 min read",
      content: (
        <>
          <p>Your website is a target. Even small sites get attacked by automated bots looking for vulnerabilities. Here's what every website owner should know about security.</p>

          <h2>Common Security Threats</h2>

          <h3>Brute Force Attacks</h3>
          <p>Bots try thousands of password combinations to guess your login. Common usernames like "admin" are especially vulnerable.</p>

          <h3>SQL Injection</h3>
          <p>Attackers insert malicious code into forms to access or modify your database.</p>

          <h3>Cross-Site Scripting (XSS)</h3>
          <p>Malicious scripts are injected into your site to steal user data or redirect visitors.</p>

          <h3>Outdated Software</h3>
          <p>Old versions of WordPress, plugins, or themes often have known vulnerabilities that attackers exploit.</p>

          <h2>Essential Security Measures</h2>

          <h3>1. Strong Passwords</h3>
          <p>Use unique, complex passwords for all accounts. Enable two-factor authentication wherever possible.</p>

          <h3>2. Keep Everything Updated</h3>
          <p>WordPress, themes, and plugins should be updated regularly. Most hacks exploit known vulnerabilities in outdated software.</p>

          <h3>3. SSL Certificate</h3>
          <p>HTTPS is essential. It encrypts data between visitors and your server. Google also penalizes sites without SSL.</p>

          <h3>4. Regular Backups</h3>
          <p>If the worst happens, backups let you restore quickly. Back up weekly at minimum, store backups off-site.</p>

          <h3>5. Security Monitoring</h3>
          <p>Use tools that monitor for malware, unusual activity, and known vulnerabilities.</p>

          <h2>What To Do If You're Hacked</h2>
          <ol>
            <li>Don't panic—acting rashly can make things worse</li>
            <li>Take the site offline if necessary to prevent damage</li>
            <li>Restore from a clean backup</li>
            <li>Change all passwords</li>
            <li>Identify and fix the vulnerability</li>
            <li>Monitor closely for recurring issues</li>
          </ol>

          <h2>Prevention Is Easier Than Cure</h2>
          <p>Our maintenance plans include security monitoring, updates, and backups—so you don't have to worry about becoming a victim.</p>

          <p>Concerned about your site's security? Contact us for a free security assessment.</p>
        </>
      ),
    },
  };

  const article = slug ? articles[slug] : null;

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <Card className="glass border-border/40 max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <p className="text-foreground/70 mb-6">
              The article you're looking for doesn't exist or has been moved.
            </p>
            <Button asChild className="gradient-primary">
              <Link to="/blog">View All Articles</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4">
          <Link
            to="/blog"
            className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
              {article.category}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 max-w-4xl">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap gap-4 text-foreground/70">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Article Content */}
            <div className="lg:col-span-2">
              <Card className="glass border-border/40">
                <CardContent className="p-8 md:p-12">
                  <article className="prose prose-invert max-w-none
                    prose-headings:text-foreground prose-headings:font-bold
                    prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                    prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                    prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-4
                    prose-li:text-foreground/80 prose-li:my-1
                    prose-ul:my-4 prose-ul:pl-6 prose-ul:list-disc
                    prose-ol:my-4 prose-ol:pl-6 prose-ol:list-decimal
                    prose-strong:text-foreground prose-strong:font-semibold
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  ">
                    {article.content}
                  </article>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Author Card */}
              <Card className="glass border-border/40">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">About the Author</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                      {article.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{article.author}</p>
                      <p className="text-sm text-foreground/60">Dubiqo Team</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter */}
              <Card className="glass border-primary glow">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Get More Tips</h3>
                  <p className="text-sm text-foreground/70 mb-4">
                    Subscribe for web tips and insights delivered to your inbox.
                  </p>
                  <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                    <Input
                      type="email"
                      placeholder="Your email"
                      className="bg-muted/50 border-border/40"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                    />
                    <Button type="submit" className="w-full gradient-primary" disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="glass border-border/40">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Need Help?</h3>
                  <p className="text-sm text-foreground/70 mb-4">
                    Ready to build or improve your website?
                  </p>
                  <Button asChild className="w-full gradient-primary">
                    <Link to="/quote">Get a Quote</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-foreground/70 mb-8 max-w-xl mx-auto">
            Whether you need a new website or help with an existing one, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gradient-primary">
              <Link to="/quote">Get a Quote</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary/50">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogArticle;
