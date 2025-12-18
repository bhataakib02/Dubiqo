import { Layout } from "@/components/layout/Layout";
import { Section } from "@/components/ui/section";

export default function Terms() {
  return (
    <Layout>
      <Section className="pt-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: January 1, 2024</p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using Dubiqo's services, you accept and agree to be bound by the
                  terms and provisions of this agreement. If you do not agree to these terms, please
                  do not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Services</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Dubiqo provides web development, design, and digital consulting services. The specific
                  scope of work, deliverables, and timelines will be defined in individual project
                  agreements.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Payment Terms</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Payment terms are as follows:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>50% deposit required before work begins</li>
                  <li>Remaining balance due upon project completion</li>
                  <li>Invoices are due within 30 days unless otherwise specified</li>
                  <li>Late payments may incur a 1.5% monthly interest charge</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Upon full payment, clients receive full ownership of custom work created specifically
                  for their project. We retain the right to showcase completed work in our portfolio
                  unless otherwise agreed in writing.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Confidentiality</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We maintain strict confidentiality regarding all client information and project
                  details. We will not disclose confidential information to third parties without
                  explicit written consent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Dubiqo's liability is limited to the amount paid for services. We are not liable
                  for indirect, incidental, special, or consequential damages arising from the use
                  of our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Either party may terminate a project agreement with 30 days written notice. Upon
                  termination, payment is due for all work completed up to the termination date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these terms at any time. Changes will be effective
                  immediately upon posting to our website. Continued use of our services constitutes
                  acceptance of modified terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about these Terms of Service, please contact us at legal@dubiqo.com.
                </p>
              </section>
            </div>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
