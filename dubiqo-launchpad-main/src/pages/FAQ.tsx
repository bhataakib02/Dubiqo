import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqCategories = [
  {
    title: "General",
    faqs: [
      {
        question: "What services does Dubiqo offer?",
        answer: "We offer a full range of web development services including custom websites, web applications, dashboards, e-commerce solutions, site repair, and ongoing maintenance. Each service is tailored to meet your specific business needs.",
      },
      {
        question: "How much does a website cost?",
        answer: "Our website projects start at $2,499 for simple sites and can range higher depending on complexity. We provide detailed quotes after understanding your requirements. Use our quote calculator for an instant estimate.",
      },
      {
        question: "How long does a project take?",
        answer: "Timeline varies by project scope. A simple website typically takes 2-3 weeks, while complex web applications can take 2-3 months. We'll provide a detailed timeline during our initial consultation.",
      },
      {
        question: "Do you work with international clients?",
        answer: "Yes! We work with clients worldwide. Our team is distributed globally, and we use modern collaboration tools to work effectively across time zones.",
      },
    ],
  },
  {
    title: "Process & Communication",
    faqs: [
      {
        question: "What is your development process?",
        answer: "We follow an agile methodology: Discovery → Design → Development → Testing → Launch → Support. You'll have regular check-ins and access to a project management dashboard throughout.",
      },
      {
        question: "How do you handle communication?",
        answer: "You'll have a dedicated project manager as your main point of contact. We use Slack for day-to-day communication, email for formal updates, and video calls for meetings. You'll also have access to our client portal.",
      },
      {
        question: "Can I see progress during development?",
        answer: "Absolutely! We set up a staging environment where you can see progress in real-time. We also provide weekly progress reports and hold regular review meetings.",
      },
    ],
  },
  {
    title: "Payments & Pricing",
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept credit cards, bank transfers, and PayPal. For larger projects, we can also arrange milestone-based payments.",
      },
      {
        question: "Do you offer payment plans?",
        answer: "Yes, we offer flexible payment options. Standard terms are 50% upfront and 50% on completion. For larger projects, we can arrange milestone-based payments.",
      },
      {
        question: "What's your refund policy?",
        answer: "We offer a 100% refund if you cancel before design approval. After design approval, refunds are prorated based on work completed. See our full refund policy for details.",
      },
    ],
  },
  {
    title: "Post-Launch Support",
    faqs: [
      {
        question: "What support do you offer after launch?",
        answer: "All projects include a support period (varies by plan). After that, we offer monthly maintenance packages starting at $199/month for ongoing updates, security monitoring, and technical support.",
      },
      {
        question: "Can you host my website?",
        answer: "While we don't provide hosting directly, we help you set up and configure hosting on reliable platforms like Vercel, AWS, or your preferred provider. We can manage hosting as part of our maintenance packages.",
      },
      {
        question: "Do you provide training?",
        answer: "Yes! We provide comprehensive training on how to manage your website's content. This includes video tutorials and live training sessions as needed.",
      },
    ],
  },
];

export default function FAQ() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about our services and process.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <Section>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-12">
            {faqCategories.map((category) => (
              <div key={category.title}>
                <h2 className="text-2xl font-bold mb-6">{category.title}</h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`${category.title}-${index}`}
                      className="bg-card/50 backdrop-blur border border-border/50 rounded-lg px-6"
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <span className="text-left font-medium">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Still have questions?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/support">Visit Support Center</Link>
            </Button>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
