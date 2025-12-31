import { Layout } from "@/components/layout/Layout";
import { Section } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Scale, CreditCard, Shield, AlertTriangle, Users, Gavel, Mail } from "lucide-react";

export default function Terms() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Scale className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Terms of <span className="gradient-text">Service</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Please read these terms carefully before using our services.
            </p>
            <Badge variant="outline" className="mt-4">
              Last Updated: January 1, 2025
            </Badge>
          </div>
        </div>
      </section>

      {/* Content */}
      <Section>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Acceptance */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      By accessing and using Dubiqo Digital Solutions' ("Dubiqo," "we," "our," or "us") website and services, 
                      you accept and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, 
                      please do not use our services.
                    </p>
                <p className="text-muted-foreground leading-relaxed">
                      These Terms constitute a legally binding agreement between you and Dubiqo. We reserve the right to modify 
                      these Terms at any time, and such modifications will be effective immediately upon posting.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">2. Services Description</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Dubiqo provides web development, design, digital consulting, and related technology services. Our services include:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-semibold mb-2">Web Development</h4>
                    <p className="text-sm text-muted-foreground">Custom websites, web applications, and digital solutions</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-semibold mb-2">Design Services</h4>
                    <p className="text-sm text-muted-foreground">UI/UX design, branding, and visual identity</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-semibold mb-2">Consulting</h4>
                    <p className="text-sm text-muted-foreground">Technical consulting and digital strategy</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-semibold mb-2">Maintenance & Support</h4>
                    <p className="text-sm text-muted-foreground">Ongoing support, updates, and maintenance services</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  The specific scope, deliverables, timelines, and pricing for each project will be defined in a separate 
                  project agreement or statement of work ("SOW").
                </p>
              </CardContent>
            </Card>

            {/* Payment Terms */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">3. Payment Terms</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-foreground">3.1 Payment Schedule</h3>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                          <li><strong>Deposit:</strong> 50% deposit required before work begins, unless otherwise specified in the SOW</li>
                          <li><strong>Milestone Payments:</strong> For larger projects, payments may be structured around project milestones</li>
                          <li><strong>Final Payment:</strong> Remaining balance due upon project completion and delivery</li>
                          <li><strong>Recurring Services:</strong> Monthly or annual fees for maintenance and subscription services are billed in advance</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-foreground">3.2 Payment Methods</h3>
                        <p className="text-muted-foreground leading-relaxed mb-2">
                          We accept payments through:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                          <li>Credit and debit cards (processed securely through Stripe)</li>
                          <li>Bank transfers (for larger projects)</li>
                          <li>Other payment methods as agreed upon in writing</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-foreground">3.3 Late Payments</h3>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                          <li>Invoices are due within 30 days of the invoice date, unless otherwise specified</li>
                          <li>Late payments may incur a 1.5% monthly interest charge (18% annually)</li>
                          <li>We reserve the right to suspend services for accounts with overdue balances exceeding 60 days</li>
                          <li>All fees and costs associated with collection of overdue amounts are the responsibility of the client</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-foreground">3.4 Refunds</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Refund policies are detailed in our separate Refund Policy. Generally, refunds are processed in 
                          accordance with the terms specified in your project agreement.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">4. Intellectual Property Rights</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-foreground">4.1 Client Ownership</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Upon full payment of all fees, you will receive ownership of all custom work, code, designs, and 
                          deliverables created specifically for your project. This includes source code, design files, and 
                          project documentation, unless otherwise specified in the SOW.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-foreground">4.2 Portfolio Rights</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          We retain the right to showcase completed work in our portfolio, case studies, and marketing materials, 
                          unless you request otherwise in writing at the start of the project. You may request that we keep 
                          certain aspects confidential.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-foreground">4.3 Third-Party Components</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Projects may include third-party components, libraries, or assets subject to their respective licenses. 
                          You are responsible for compliance with these licenses. We will inform you of any third-party components 
                          and their licensing requirements.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-foreground">4.4 Pre-Existing Materials</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Each party retains ownership of their pre-existing intellectual property. Any pre-existing materials 
                          incorporated into the project remain the property of their original owner.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Confidentiality */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">5. Confidentiality</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Both parties agree to maintain strict confidentiality regarding:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                  <li>All client information, business plans, and proprietary data</li>
                  <li>Project details, specifications, and technical information</li>
                  <li>Financial information and pricing structures</li>
                  <li>Any information marked as confidential or that would reasonably be considered confidential</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  This obligation continues indefinitely, except where disclosure is required by law or with written consent 
                  from the other party.
                </p>
              </CardContent>
            </Card>

            {/* Client Responsibilities */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">6. Client Responsibilities</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      You agree to:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                      <li>Provide accurate, complete, and timely information necessary for project completion</li>
                      <li>Respond to requests for feedback, approvals, and information within agreed timeframes</li>
                      <li>Obtain necessary licenses, permissions, and rights for any content, materials, or assets you provide</li>
                      <li>Ensure that any content you provide does not infringe on third-party rights</li>
                      <li>Make timely payments as specified in the payment terms</li>
                      <li>Comply with all applicable laws and regulations in your use of our services</li>
                      <li>Maintain backups of your data and content</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revisions and Changes */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">7. Revisions and Change Requests</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Included Revisions</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Most projects include 2-3 rounds of revisions at no additional cost, as specified in your SOW. 
                      Revisions must be requested within the revision period outlined in your agreement.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Additional Changes</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Changes beyond the included revisions, or changes requested after project completion, will be quoted 
                      separately and billed at our standard hourly rate or as agreed upon.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Scope Changes</h3>
                <p className="text-muted-foreground leading-relaxed">
                      Significant changes to project scope may require a new agreement or SOW amendment. We will provide 
                      a quote for any scope changes before proceeding.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Warranties and Disclaimers */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6 text-warning" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">8. Warranties and Disclaimers</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-foreground">Our Warranties</h3>
                <p className="text-muted-foreground leading-relaxed">
                          We warrant that our services will be performed in a professional and workmanlike manner, consistent 
                          with industry standards. We will use reasonable efforts to ensure deliverables are free from material 
                          defects for 30 days after delivery.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-foreground">Disclaimers</h3>
                        <p className="text-muted-foreground leading-relaxed mb-2">
                          EXCEPT AS EXPRESSLY SET FORTH ABOVE, OUR SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, 
                          EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                          <li>Implied warranties of merchantability and fitness for a particular purpose</li>
                          <li>Warranties regarding third-party services, platforms, or integrations</li>
                          <li>Warranties regarding uptime, availability, or uninterrupted access</li>
                          <li>Warranties regarding specific business outcomes or results</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">9. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                  <li>Our total liability for any claims arising from or related to our services shall not exceed the total 
                      amount paid by you for the specific service giving rise to the claim</li>
                  <li>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
                      including but not limited to lost profits, lost revenue, lost data, or business interruption</li>
                  <li>We are not responsible for delays or failures resulting from circumstances beyond our reasonable control, 
                      including acts of God, natural disasters, war, terrorism, or third-party service failures</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  Some jurisdictions do not allow the exclusion or limitation of certain damages, so the above limitations 
                  may not apply to you.
                </p>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">10. Termination</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Termination by Client</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      You may terminate a project agreement with 30 days written notice. Upon termination, you are responsible 
                      for payment of all work completed up to the termination date, plus any non-refundable expenses incurred.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Termination by Dubiqo</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We may terminate services immediately if you breach these Terms, fail to make payments, or engage in 
                      conduct that we determine is harmful to our business or reputation.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Effect of Termination</h3>
                <p className="text-muted-foreground leading-relaxed">
                      Upon termination, all outstanding invoices become immediately due. We will provide you with all completed 
                      work and project files within 30 days of termination, subject to full payment of outstanding amounts.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dispute Resolution */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Gavel className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">11. Dispute Resolution</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-foreground">Good Faith Negotiation</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          In the event of a dispute, both parties agree to first attempt to resolve the matter through good 
                          faith negotiation for at least 30 days.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-foreground">Mediation</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          If negotiation fails, disputes will be resolved through mediation by a mutually agreed-upon mediator. 
                          Mediation costs will be shared equally unless otherwise agreed.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-foreground">Governing Law</h3>
                <p className="text-muted-foreground leading-relaxed">
                          These Terms are governed by the laws of India, without regard to conflict of law principles. Any 
                          legal action must be brought in the courts of India.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* General Provisions */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">12. General Provisions</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p><strong>Entire Agreement:</strong> These Terms, together with any SOW or project agreement, constitute the entire agreement between you and Dubiqo.</p>
                  <p><strong>Modifications:</strong> We reserve the right to modify these Terms at any time. Material changes will be communicated via email or website notice.</p>
                  <p><strong>Severability:</strong> If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full effect.</p>
                  <p><strong>Assignment:</strong> You may not assign these Terms without our written consent. We may assign these Terms in connection with a merger or acquisition.</p>
                  <p><strong>Waiver:</strong> Failure to enforce any provision does not constitute a waiver of that provision.</p>
                  <p><strong>Force Majeure:</strong> Neither party will be liable for delays or failures due to circumstances beyond reasonable control.</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="bg-card/50 backdrop-blur border-border/50 border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-3">13. Contact Information</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      For questions about these Terms of Service, please contact us:
                    </p>
                    <div className="space-y-2 text-muted-foreground">
                      <p><strong>Email:</strong> <a href="mailto:legal@dubiqo.com" className="text-primary hover:underline">legal@dubiqo.com</a></p>
                      <p><strong>Support:</strong> <a href="mailto:support@dubiqo.com" className="text-primary hover:underline">support@dubiqo.com</a></p>
                      <p><strong>Address:</strong> Dubiqo Digital Solutions, Global · Remote First</p>
                    </div>
                  </div>
            </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </Section>
    </Layout>
  );
}
