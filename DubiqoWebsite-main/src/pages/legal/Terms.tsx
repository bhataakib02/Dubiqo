import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4 text-center">
          <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Please read these terms carefully before using our services
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

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">1. Agreement to Terms</h2>
              <p className="text-foreground/80 leading-relaxed">
                By accessing or using the services provided by Dubiqo Digital Solutions ("Dubiqo", "we", "us", or "our"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">2. Services</h2>
              <p className="text-foreground/80 leading-relaxed">
                Dubiqo provides digital solutions including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li>Website design and development</li>
                <li>Portfolio creation</li>
                <li>Dashboard and admin panel development</li>
                <li>Billing system development</li>
                <li>Website troubleshooting and bug fixing</li>
                <li>Ongoing maintenance and support</li>
              </ul>
              <p className="text-foreground/80 leading-relaxed mt-4">
                Specific details of services will be outlined in individual project agreements or quotes.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">3. Project Agreements</h2>
              <p className="text-foreground/80 leading-relaxed">
                Before starting any project, we will provide you with a detailed quote or proposal outlining:
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li>Scope of work and deliverables</li>
                <li>Timeline and milestones</li>
                <li>Pricing and payment terms</li>
                <li>Number of revisions included</li>
                <li>Post-launch support period</li>
              </ul>
              <p className="text-foreground/80 leading-relaxed mt-4">
                Your acceptance of the quote (verbal or written) constitutes agreement to the project terms.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">4. Payment Terms</h2>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li>A 50% deposit is required to begin work on most projects</li>
                <li>The remaining 50% is due upon project completion and client approval</li>
                <li>Payment is accepted via bank transfer, UPI, Razorpay, PayPal, or Wise</li>
                <li>Invoices are due within 7 days of issuance unless otherwise agreed</li>
                <li>Late payments may result in project delays or suspension</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">5. Client Responsibilities</h2>
              <p className="text-foreground/80 leading-relaxed">
                To ensure successful project completion, you agree to:
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li>Provide all necessary content, images, and materials in a timely manner</li>
                <li>Respond to communications and feedback requests within reasonable time</li>
                <li>Provide clear and complete requirements at the start of the project</li>
                <li>Designate a single point of contact for project decisions</li>
                <li>Review and approve deliverables within the agreed timeline</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">6. Intellectual Property</h2>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li>Upon full payment, you receive complete ownership of the custom code and designs created specifically for your project</li>
                <li>We retain the right to use completed projects in our portfolio (unless otherwise agreed)</li>
                <li>Third-party assets (fonts, images, plugins) remain subject to their respective licenses</li>
                <li>We retain ownership of reusable components, templates, and proprietary tools</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">7. Revisions and Changes</h2>
              <p className="text-foreground/80 leading-relaxed">
                Each service package includes a specified number of revision rounds. Changes requested beyond the included revisions or outside the original project scope may incur additional charges. See our <Link to="/legal/refund" className="text-primary hover:underline">Refund & Revision Policy</Link> for details.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">8. Confidentiality</h2>
              <p className="text-foreground/80 leading-relaxed">
                We maintain strict confidentiality of your business information, project details, and any proprietary data shared with us. We will not share your information with third parties without your consent, except as required by law.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">9. Limitation of Liability</h2>
              <p className="text-foreground/80 leading-relaxed">
                To the maximum extent permitted by law, Dubiqo shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from the use of our services. Our total liability shall not exceed the amount paid for the specific service in question.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">10. Termination</h2>
              <p className="text-foreground/80 leading-relaxed">
                Either party may terminate the project agreement with written notice. Upon termination:
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li>All completed work remains property of the respective party as outlined in Section 6</li>
                <li>Payment for work completed up to termination is due</li>
                <li>Refunds for unused portions will follow our Refund Policy</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">11. Governing Law</h2>
              <p className="text-foreground/80 leading-relaxed">
                These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">12. Changes to Terms</h2>
              <p className="text-foreground/80 leading-relaxed">
                We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">13. Contact</h2>
              <p className="text-foreground/80 leading-relaxed">
                For questions about these Terms of Service, contact us at:
              </p>
              <ul className="list-none text-foreground/80 mt-3 space-y-1">
                <li>Email: <a href="mailto:legal@dubiqo.com" className="text-primary hover:underline">legal@dubiqo.com</a></li>
                <li>Contact Page: <Link to="/contact" className="text-primary hover:underline">/contact</Link></li>
              </ul>
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

export default Terms;
