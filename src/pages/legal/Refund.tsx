import { Layout } from "@/components/layout/Layout";
import { Section } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CheckCircle2, XCircle, Clock, FileText, AlertCircle, Mail, ArrowRight } from "lucide-react";

export default function Refund() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <RefreshCw className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Refund <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Our commitment to fair and transparent refund practices.
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
            
            {/* Introduction */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-3">Our Commitment</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      At Dubiqo Digital Solutions, we are committed to delivering exceptional work that meets and exceeds 
                      your expectations. We understand that circumstances may change, and we've designed our refund policy 
                      to be fair, transparent, and reasonable for both parties. This policy outlines the terms and conditions 
                      under which refunds may be issued.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Refund Eligibility */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">1. Refund Eligibility</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Refunds may be requested under the following circumstances:
                    </p>
                    
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                        <h3 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-success" />
                          Project Cancellation Before Work Begins
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          If you cancel your project before any work has commenced, you are entitled to a full refund of 
                          the deposit, minus any non-refundable expenses already incurred (such as third-party service setup fees).
                        </p>
                      </div>

                      <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                        <h3 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-success" />
                          Project Cancellation After Work Begins
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          If you cancel after work has begun, you will receive a prorated refund based on the percentage of 
                          work completed. The refund amount will be calculated as: Total Payment - (Work Completed % × Total Project Cost) - Non-refundable Expenses.
                        </p>
                      </div>

                      <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                        <h3 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-success" />
                          Dissatisfaction with Deliverables
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          If you are not satisfied with the final deliverables, we will first offer additional revisions at no 
                          cost (within the scope of included revisions). If revisions do not resolve the issue, refunds will 
                          be considered on a case-by-case basis, typically up to 50% of the project cost, after deducting 
                          work completed.
                        </p>
                      </div>

                      <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                        <h3 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-success" />
                          Service Non-Delivery
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          If we fail to deliver the agreed-upon services due to our fault (not including delays caused by 
                          client-side issues or third-party services), you are entitled to a full or partial refund as appropriate.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Non-Refundable Services */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                    <XCircle className="w-6 h-6 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">2. Non-Refundable Services and Fees</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      The following are non-refundable under any circumstances:
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                        <h4 className="font-semibold mb-2 text-foreground">Rush Delivery Fees</h4>
                        <p className="text-sm text-muted-foreground">Additional fees paid for expedited delivery timelines</p>
                      </div>
                      <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                        <h4 className="font-semibold mb-2 text-foreground">Third-Party Costs</h4>
                        <p className="text-sm text-muted-foreground">Domain registrations, hosting fees, stock assets, licenses, and other third-party expenses</p>
                      </div>
                      <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                        <h4 className="font-semibold mb-2 text-foreground">Approved Work</h4>
                        <p className="text-sm text-muted-foreground">Custom work that has been approved by the client in writing or through explicit acceptance</p>
                      </div>
                      <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                        <h4 className="font-semibold mb-2 text-foreground">Consultation Fees</h4>
                        <p className="text-sm text-muted-foreground">Fees for completed consultation sessions, strategy meetings, or planning sessions</p>
                      </div>
                      <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                        <h4 className="font-semibold mb-2 text-foreground">Maintenance Plans</h4>
                        <p className="text-sm text-muted-foreground">Monthly or annual maintenance fees for the current billing period</p>
                      </div>
                      <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                        <h4 className="font-semibold mb-2 text-foreground">Setup Fees</h4>
                        <p className="text-sm text-muted-foreground">One-time setup fees, onboarding costs, and initial configuration charges</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Refund Process */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">3. Refund Request Process</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      To request a refund, please follow these steps:
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-bold text-primary">
                          1
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2 text-foreground">Submit Request</h4>
                          <p className="text-sm text-muted-foreground">
                            Contact us at <a href="mailto:thefreelancer2076@gmail.com" className="text-primary hover:underline">thefreelancer2076@gmail.com</a> within 
                            14 days of project completion or cancellation. Include your project details, invoice number, and reason for the refund request.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-bold text-primary">
                          2
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2 text-foreground">Review Period</h4>
                          <p className="text-sm text-muted-foreground">
                            Our team will review your request within 5 business days. We may request additional information 
                            or documentation to process your request.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-bold text-primary">
                          3
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2 text-foreground">Decision Notification</h4>
                          <p className="text-sm text-muted-foreground">
                            You will receive written notification of our decision via email. If approved, we will provide 
                            details of the refund amount and processing timeline.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-bold text-primary">
                          4
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2 text-foreground">Refund Processing</h4>
                          <p className="text-sm text-muted-foreground">
                            Approved refunds are processed within 7-10 business days. Refunds will be issued to the original 
                            payment method used. Processing times may vary depending on your payment provider.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revisions Policy */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">4. Revisions Policy</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Before requesting a refund, we strongly encourage you to utilize our revision process:
                </p>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mb-4">
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Most projects include 2-3 rounds of revisions at no additional cost</li>
                    <li>Revisions must be requested within the revision period specified in your project agreement</li>
                    <li>We are committed to working with you until you are satisfied with the final deliverable</li>
                    <li>Additional revisions beyond the included rounds may be available at our standard hourly rate</li>
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground">
                  We believe that most concerns can be resolved through open communication and revisions. Refund requests 
                  are typically only considered after all included revisions have been exhausted.
                </p>
              </CardContent>
            </Card>

            {/* Time Limits */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">5. Time Limits for Refund Requests</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p><strong>Project Cancellation:</strong> Refund requests for cancellations must be submitted within 30 days of cancellation.</p>
                  <p><strong>Dissatisfaction Claims:</strong> Refund requests based on dissatisfaction must be submitted within 14 days of final deliverable delivery.</p>
                  <p><strong>Service Non-Delivery:</strong> Refund requests for non-delivery must be submitted within 60 days of the expected delivery date.</p>
                </div>
                <div className="p-4 rounded-lg bg-warning/10 border border-warning/20 mt-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      <strong>Important:</strong> Refund requests submitted after these time limits may not be eligible for consideration, 
                      except in exceptional circumstances at our sole discretion.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Partial Refunds */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">6. Partial Refunds</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  In many cases, partial refunds may be more appropriate than full refunds:
                </p>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-semibold mb-2 text-foreground">Work Completed</h4>
                    <p className="text-sm text-muted-foreground">
                      If substantial work has been completed, you will be charged for the work done, and only the remaining 
                      portion will be refunded.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-semibold mb-2 text-foreground">Materials and Assets</h4>
                    <p className="text-sm text-muted-foreground">
                      Costs for purchased assets, licenses, or third-party services that cannot be returned will be deducted 
                      from any refund amount.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-semibold mb-2 text-foreground">Administrative Fees</h4>
                    <p className="text-sm text-muted-foreground">
                      A small administrative fee (up to 5% of the refund amount) may be deducted to cover processing costs, 
                      except in cases of our error.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dispute Resolution */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">7. Dispute Resolution</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If we cannot resolve a refund dispute to your satisfaction through direct communication:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <ArrowRight className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      We offer mediation through a mutually agreed-upon third-party mediator. Both parties agree to participate 
                      in good faith in any mediation process.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <ArrowRight className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      Mediation costs will be shared equally unless otherwise agreed upon in writing.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <ArrowRight className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      If mediation is unsuccessful, disputes will be resolved through binding arbitration or in accordance 
                      with the governing law specified in our Terms of Service.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Special Circumstances */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">8. Special Circumstances</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We understand that exceptional circumstances may arise. Refund requests outside the standard policy may be 
                  considered on a case-by-case basis for:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Medical emergencies or serious health issues</li>
                  <li>Natural disasters or force majeure events</li>
                  <li>Business closure or bankruptcy</li>
                  <li>Other circumstances beyond your reasonable control</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  Please contact us to discuss your situation. We are committed to finding fair solutions in exceptional cases.
                </p>
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
                    <h2 className="text-2xl font-bold mb-3">9. Contact Us</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      For questions about our refund policy or to initiate a refund request, please contact us:
                    </p>
                    <div className="space-y-2 text-muted-foreground">
                      <p><strong>Refund Requests:</strong> <a href="mailto:thefreelancer2076@gmail.com" className="text-primary hover:underline">thefreelancer2076@gmail.com</a></p>
                      <p><strong>General Support:</strong> <a href="mailto:thefreelancer2076@gmail.com" className="text-primary hover:underline">thefreelancer2076@gmail.com</a></p>
                      <p><strong>Support Portal:</strong> Visit our <a href="/support" className="text-primary hover:underline">Support Center</a></p>
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
