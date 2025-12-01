import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const faqs = [
    {
      category: "General",
      questions: [
        {
          id: "general-1",
          q: "What services does Dubiqo offer?",
          a: "We offer complete digital solutions including website development, portfolio creation, dashboards, billing systems, bug fixing/troubleshooting, and ongoing maintenance. We work with individuals, students, freelancers, startups, and businesses.",
        },
        {
          id: "general-2",
          q: "How long does it take to build a website?",
          a: "Simple websites and portfolios take 5-7 days. Professional multi-page sites take 2-3 weeks. Complex projects like dashboards or billing systems take 4-8 weeks depending on requirements. Rush delivery available for urgent projects.",
        },
        {
          id: "general-3",
          q: "What is your development process?",
          a: "Our process has 4 steps: 1) You tell us what you need, 2) We plan and design with your approval, 3) We build and test with regular updates, 4) Launch and ongoing support. We keep you involved throughout.",
        },
      ],
    },
    {
      category: "Pricing & Payments",
      questions: [
        {
          id: "pricing-1",
          q: "How much does a website cost?",
          a: "Pricing depends on complexity. Starter sites begin at ₹4,999, Professional sites at ₹9,999, and Business/Custom solutions at ₹14,999+. Use our quote calculator for an estimate or contact us for a detailed quote.",
        },
        {
          id: "pricing-2",
          q: "What is your payment schedule?",
          a: "We require 50% upfront to start work and 50% upon completion and your approval. We accept bank transfer, UPI, and Razorpay. For international clients, we accept PayPal and Wise.",
        },
        {
          id: "pricing-3",
          q: "Do you offer refunds?",
          a: "If we haven't started work, we offer full refunds minus payment processing fees. Once work begins, refunds are evaluated case-by-case based on progress. See our refund policy page for complete details.",
        },
      ],
    },
    {
      category: "Revisions & Changes",
      questions: [
        {
          id: "revisions-1",
          q: "How many revisions are included?",
          a: "Starter plan includes 2 rounds of revisions, Professional includes 3 rounds, and Business/Custom includes unlimited revisions. Each round covers minor changes across the entire project.",
        },
        {
          id: "revisions-2",
          q: "What counts as a revision?",
          a: "A revision is making changes to existing elements—adjusting colors, text, layout, images, etc. Adding new features or pages beyond the agreed scope may incur additional charges.",
        },
        {
          id: "revisions-3",
          q: "Can I make changes after the project is finished?",
          a: "Yes! Minor tweaks during the support period are free. Major changes or new features after delivery are billed at ₹500-800/hour. We also offer maintenance plans for ongoing updates.",
        },
      ],
    },
    {
      category: "Technical",
      questions: [
        {
          id: "technical-1",
          q: "What technologies do you use?",
          a: "We use modern, industry-standard technologies including React, Next.js, TypeScript, Tailwind CSS, Node.js, and various databases. We choose the best tech stack for each project's needs.",
        },
        {
          id: "technical-2",
          q: "Will I own the code and design?",
          a: "Yes, absolutely! You get full ownership of all code, designs, and content. We provide complete documentation and source code. No vendor lock-in—you can take your project anywhere.",
        },
        {
          id: "technical-3",
          q: "Do you provide hosting?",
          a: "We can help set up hosting on platforms like Vercel, Netlify, or AWS. Hosting fees are separate from development costs. We can also manage hosting for you as part of a maintenance plan.",
        },
        {
          id: "technical-4",
          q: "Will my website be mobile-friendly?",
          a: "Every website we build is fully responsive and optimized for mobile, tablet, and desktop. We test on multiple devices and screen sizes to ensure a perfect experience everywhere.",
        },
      ],
    },
    {
      category: "Support & Maintenance",
      questions: [
        {
          id: "support-1",
          q: "What support do you provide after launch?",
          a: "All plans include post-launch support: Starter gets 14 days, Professional gets 30 days, Business/Custom gets 60 days. Support includes bug fixes, minor tweaks, and technical assistance.",
        },
        {
          id: "support-2",
          q: "What is a maintenance plan?",
          a: "Maintenance plans provide ongoing updates, security monitoring, performance optimization, content updates, and priority support. Plans start at ₹2,000/month depending on your needs.",
        },
        {
          id: "support-3",
          q: "Can you fix my existing broken website?",
          a: "Yes! We specialize in troubleshooting. We can fix bugs, improve performance, resolve hosting issues, and modernize old sites. Contact us for a free assessment of your issue.",
        },
      ],
    },
    {
      category: "Working with Dubiqo",
      questions: [
        {
          id: "working-1",
          q: "Do you work with international clients?",
          a: "Absolutely! We work with clients worldwide. Our pricing for international clients is in USD (approximately $60, $120, $180+ for the three tiers). We're experienced with remote collaboration across time zones.",
        },
        {
          id: "working-2",
          q: "How do we communicate during the project?",
          a: "We communicate via email, WhatsApp, and scheduled video calls. You'll receive regular progress updates, and we're available for questions throughout the project. Response time is typically within 24 hours.",
        },
        {
          id: "working-3",
          q: "Can I see examples of your work?",
          a: "Yes! Check our Portfolio page for examples of websites, dashboards, and billing systems we've built. Our Case Studies page has detailed breakdowns of specific projects with results.",
        },
        {
          id: "working-4",
          q: "How do I get started?",
          a: "Easy! Use our Quote Calculator to get an estimate, then fill out the contact form with your project details. We'll respond within 24 hours with a detailed quote and next steps.",
        },
      ],
    },
  ];

  const filteredFaqs = searchQuery
    ? faqs.map(category => ({
        ...category,
        questions: category.questions.filter(
          q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
               q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqs;

  const totalQuestions = faqs.reduce((acc, cat) => acc + cat.questions.length, 0);
  const filteredCount = filteredFaqs.reduce((acc, cat) => acc + cat.questions.length, 0);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
            Everything you need to know about working with Dubiqo
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/60" />
              <Input
                placeholder="Search FAQs..."
                className="pl-10 bg-muted/50 border-border/40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {searchQuery && (
              <p className="text-sm text-foreground/60 mt-2">
                Found {filteredCount} of {totalQuestions} questions
              </p>
            )}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-foreground/60 mb-4">No questions found matching "{searchQuery}"</p>
                <Button 
                  variant="link" 
                  className="text-primary"
                  onClick={() => setSearchQuery("")}
                >
                  Clear search
                </Button>
              </div>
            ) : (
              filteredFaqs.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h2 className="text-2xl font-bold mb-6 text-primary">{category.category}</h2>
                  <div className="space-y-4">
                    {category.questions.map((faq) => {
                      const isOpen = openItems.includes(faq.id);
                      return (
                        <Card 
                          key={faq.id} 
                          className={`glass border-border/40 cursor-pointer transition-all duration-300 ${
                            isOpen ? "border-primary/50" : "hover:border-primary/30"
                          }`}
                          onClick={() => toggleItem(faq.id)}
                        >
                          <CardHeader className="pb-0">
                            <div className="flex items-start justify-between gap-4">
                              <CardTitle className="text-lg leading-relaxed">{faq.q}</CardTitle>
                              <ChevronDown className={`h-5 w-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                                isOpen ? "rotate-180" : ""
                              }`} />
                            </div>
                            <div className={`overflow-hidden transition-all duration-300 ${
                              isOpen ? "max-h-96 pt-4" : "max-h-0"
                            }`}>
                              <CardDescription className="text-foreground/80 text-base leading-relaxed">
                                {faq.a}
                              </CardDescription>
                            </div>
                          </CardHeader>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <Card className="glass border-primary glow max-w-3xl mx-auto">
            <CardHeader className="text-center p-8 md:p-12">
              <CardTitle className="text-3xl mb-4">Still Have Questions?</CardTitle>
              <CardDescription className="text-base mb-6">
                Can't find what you're looking for? We're here to help.
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gradient-primary">
                  <Link to="/contact">Contact Us</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary/50">
                  <Link to="/support">Visit Support Center</Link>
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
