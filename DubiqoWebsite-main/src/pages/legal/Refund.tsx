import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowLeft } from "lucide-react";

const Refund = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4 text-center">
          <RefreshCw className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Refund & Revision Policy
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Our commitment to your satisfaction
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="glass border-border/40 max-w-4xl mx-auto">
            <CardContent className="p-8 md:p-12 prose prose-invert max-w-none">
              <p className="text-foreground/60 mb-6">
                <strong>Last Updated:</strong> November 29, 2025
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Revisions Policy</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">Included Revisions</h3>
              <p className="text-foreground/80 leading-relaxed">
                Each service package includes a specified number of revision rounds:
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li><strong>Starter (₹4,999):</strong> 2 rounds of revisions</li>
                <li><strong>Professional (₹9,999):</strong> 3 rounds of revisions</li>
                <li><strong>Business/Custom (₹14,999+):</strong> Unlimited revisions until satisfaction</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">What Counts as a Revision?</h3>
              <p className="text-foreground/80 leading-relaxed">
                A "revision round" includes minor adjustments such as:
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li>Color, font, or styling changes</li>
                <li>Text and content updates</li>
                <li>Layout adjustments within the existing structure</li>
                <li>Image replacements</li>
                <li>Minor functional tweaks</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">What Doesn't Count as a Revision?</h3>
              <p className="text-foreground/80 leading-relaxed">
                The following are considered scope changes and may incur additional charges:
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li>Adding new pages or features not in the original scope</li>
                <li>Complete redesign or major structural changes</li>
                <li>Adding complex functionality (animations, integrations)</li>
                <li>Changes requested after final approval and launch</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">Revision Process</h3>
              <ol className="list-decimal pl-6 text-foreground/80 space-y-2 mt-3">
                <li>Review the deliverable we share with you</li>
                <li>Compile all your feedback into one consolidated list</li>
                <li>Submit your revision request via email or our project communication channel</li>
                <li>We implement the changes and share the updated version</li>
              </ol>
              <p className="text-foreground/80 leading-relaxed mt-4">
                Consolidating feedback into single requests helps us deliver faster and keeps the project on track.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Refund Policy</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">Before Work Begins</h3>
              <p className="text-foreground/80 leading-relaxed">
                If you cancel before we start any design or development work:
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li>Full refund minus 5% processing fee</li>
                <li>Refund processed within 7 business days</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">After Work Begins</h3>
              <p className="text-foreground/80 leading-relaxed">
                Once work has started, refunds are evaluated case-by-case:
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li><strong>Design Phase:</strong> Partial refund based on design work completed</li>
                <li><strong>Development Phase:</strong> Refund proportional to remaining work</li>
                <li>We will provide a transparent breakdown of work completed</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">After Project Completion</h3>
              <p className="text-foreground/80 leading-relaxed">
                No refunds are available for completed projects that have been approved and launched. However:
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li>We offer post-launch support as per your package</li>
                <li>We'll fix any bugs or issues that arise</li>
                <li>Additional work can be quoted separately</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">Non-Refundable Situations</h3>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li>Completed and approved projects</li>
                <li>Third-party costs (domains, hosting, plugins) already incurred</li>
                <li>Scope changes you requested and we implemented</li>
                <li>Delays caused by late content or feedback from your side</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Satisfaction Guarantee</h2>
              <p className="text-foreground/80 leading-relaxed">
                We're committed to your satisfaction. If you're not happy with our work, we'll:
              </p>
              <ol className="list-decimal pl-6 text-foreground/80 space-y-2 mt-3">
                <li>Listen to your concerns and understand the issue</li>
                <li>Work with you to find a solution within your revision allowance</li>
                <li>If needed, discuss additional options to meet your expectations</li>
              </ol>
              <p className="text-foreground/80 leading-relaxed mt-4">
                Clear communication throughout the project helps ensure we deliver exactly what you need.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">How to Request a Refund</h2>
              <p className="text-foreground/80 leading-relaxed">
                To request a refund:
              </p>
              <ol className="list-decimal pl-6 text-foreground/80 space-y-2 mt-3">
                <li>Email us at <a href="mailto:support@dubiqo.com" className="text-primary hover:underline">support@dubiqo.com</a></li>
                <li>Include your project name and invoice number</li>
                <li>Explain the reason for your request</li>
                <li>We'll respond within 5 business days with next steps</li>
              </ol>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Questions?</h2>
              <p className="text-foreground/80 leading-relaxed">
                If you have questions about our refund or revision policies, please <Link to="/contact" className="text-primary hover:underline">contact us</Link>. We're happy to clarify before you start a project.
              </p>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <Button asChild variant="outline" className="border-primary/50">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Refund;
