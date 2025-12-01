import { Layout } from "@/components/layout/Layout";
import { Section } from "@/components/ui/section";

export default function Refund() {
  return (
    <Layout>
      <Section className="pt-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Refund Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: January 1, 2024</p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
                <p className="text-muted-foreground leading-relaxed">
                  At Dubiqo, we strive to deliver exceptional work that meets your expectations.
                  We understand that circumstances may change, and we've designed our refund policy
                  to be fair to both parties.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Refund Eligibility</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Refunds may be requested under the following conditions:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Project cancellation before work begins: Full refund of deposit</li>
                  <li>Project cancellation after work begins: Prorated refund based on work completed</li>
                  <li>Dissatisfaction with deliverables: Case-by-case basis with revision opportunity first</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Non-Refundable Services</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The following are non-refundable:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Rush delivery fees</li>
                  <li>Third-party costs (domains, hosting, stock assets)</li>
                  <li>Custom work that has been approved by the client</li>
                  <li>Consultation fees for completed sessions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Refund Process</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To request a refund:
                </p>
                <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
                  <li>Contact us at refunds@dubiqo.com within 14 days of project completion</li>
                  <li>Provide your project details and reason for the refund request</li>
                  <li>Our team will review your request within 5 business days</li>
                  <li>If approved, refunds are processed within 7-10 business days</li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Revisions Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Before requesting a refund, we encourage clients to utilize our revision process.
                  Most projects include 2-3 rounds of revisions at no additional cost. We're committed
                  to working with you until you're satisfied with the final deliverable.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Dispute Resolution</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If we cannot resolve a refund dispute to your satisfaction, we offer mediation
                  through a mutually agreed-upon third party. Both parties agree to participate
                  in good faith in any mediation process.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about our refund policy or to initiate a refund request,
                  please contact us at refunds@dubiqo.com or through our support page.
                </p>
              </section>
            </div>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
