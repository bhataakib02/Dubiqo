import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Section } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowLeft, Zap, Shield, MessageCircle, Mail, Phone, AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";

export default function SLA() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Service Level <span className="gradient-text">Agreement</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Our commitment to response times, service quality, and customer satisfaction.
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
            
            {/* Overview */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">
                  This Service Level Agreement (SLA) outlines the support and service standards you can expect from Dubiqo 
                  Digital Solutions. These commitments apply to active projects, clients with maintenance plans, and ongoing 
                  service agreements. This SLA is designed to ensure transparency, accountability, and exceptional service delivery.
                </p>
              </CardContent>
            </Card>

            {/* Response Time Commitments */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">1. Response Time Commitments</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-success" />
                          During Active Projects
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                          While your project is in active development, we commit to:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                            <h4 className="font-semibold mb-2 text-foreground">Initial Response</h4>
                            <p className="text-sm text-muted-foreground">Within 24 hours on business days</p>
                          </div>
                          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                            <h4 className="font-semibold mb-2 text-foreground">Progress Updates</h4>
                            <p className="text-sm text-muted-foreground">At least 2-3 times per week</p>
                          </div>
                          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                            <h4 className="font-semibold mb-2 text-foreground">Urgent Matters</h4>
                            <p className="text-sm text-muted-foreground">Same-day response during business hours</p>
                          </div>
                          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                            <h4 className="font-semibold mb-2 text-foreground">Project Milestones</h4>
                            <p className="text-sm text-muted-foreground">Timely delivery as per project timeline</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-success" />
                          Post-Launch Support Period
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                          During your included support period after launch (typically 14-30 days):
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                            <h4 className="font-semibold mb-2 text-foreground">General Inquiries</h4>
                            <p className="text-sm text-muted-foreground">Response within 24-48 hours</p>
                          </div>
                          <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                            <h4 className="font-semibold mb-2 text-foreground">Bug Reports</h4>
                            <p className="text-sm text-muted-foreground">Acknowledgment within 24 hours, resolution based on severity</p>
                          </div>
                          <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                            <h4 className="font-semibold mb-2 text-foreground">Training & Documentation</h4>
                            <p className="text-sm text-muted-foreground">Provided within 7 days of launch</p>
                          </div>
                          <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                            <h4 className="font-semibold mb-2 text-foreground">Minor Adjustments</h4>
                            <p className="text-sm text-muted-foreground">Completed within 3-5 business days</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          Maintenance Plan Clients
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                          Clients with active maintenance plans receive enhanced support:
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                            <Badge variant="outline" className="mb-3">Basic Plan</Badge>
                            <ul className="text-sm text-muted-foreground space-y-2">
                              <li>• Response within 24 hours</li>
                              <li>• Standard priority queue</li>
                              <li>• Email support</li>
                            </ul>
                          </div>
                          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                            <Badge variant="outline" className="mb-3">Professional Plan</Badge>
                            <ul className="text-sm text-muted-foreground space-y-2">
                              <li>• Response within 12 hours</li>
                              <li>• Priority queue</li>
                              <li>• Email + WhatsApp support</li>
                              <li>• Monthly health check</li>
                            </ul>
                          </div>
                          <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                            <Badge variant="outline" className="mb-3">Enterprise Plan</Badge>
                            <ul className="text-sm text-muted-foreground space-y-2">
                              <li>• Response within 4 hours</li>
                              <li>• Highest priority</li>
                              <li>• Dedicated support channel</li>
                              <li>• Weekly health checks</li>
                              <li>• 24/7 emergency support</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Issue Priority Levels */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">2. Issue Priority Levels</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Issues are classified by priority level to ensure appropriate response and resolution times:
                    </p>
                    
                    <div className="space-y-4">
                      <div className="p-5 rounded-lg bg-destructive/10 border-2 border-destructive/30">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="destructive" className="text-sm">Priority 1</Badge>
                          <h3 className="text-lg font-semibold text-foreground">Critical</h3>
                        </div>
                        <p className="text-muted-foreground mb-3">
                          Website completely down, security breach, data loss, or complete service failure.
                        </p>
                        <div className="grid md:grid-cols-3 gap-3 text-sm">
                          <div>
                            <strong className="text-foreground">Response:</strong>
                            <p className="text-muted-foreground">Within 2 hours (maintenance clients) / 4 hours (others)</p>
                          </div>
                          <div>
                            <strong className="text-foreground">Resolution Target:</strong>
                            <p className="text-muted-foreground">Within 8 hours</p>
                          </div>
                          <div>
                            <strong className="text-foreground">Availability:</strong>
                            <p className="text-muted-foreground">24/7 for critical emergencies</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 rounded-lg bg-warning/10 border-2 border-warning/30">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="outline" className="text-sm bg-warning/20">Priority 2</Badge>
                          <h3 className="text-lg font-semibold text-foreground">High</h3>
                        </div>
                        <p className="text-muted-foreground mb-3">
                          Major feature not working, significant performance issues, or security vulnerabilities.
                        </p>
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <strong className="text-foreground">Response:</strong>
                            <p className="text-muted-foreground">Within 8 hours</p>
                          </div>
                          <div>
                            <strong className="text-foreground">Resolution Target:</strong>
                            <p className="text-muted-foreground">Within 24-48 hours</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 rounded-lg bg-primary/10 border-2 border-primary/30">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="outline" className="text-sm">Priority 3</Badge>
                          <h3 className="text-lg font-semibold text-foreground">Normal</h3>
                        </div>
                        <p className="text-muted-foreground mb-3">
                          Minor bugs, non-critical issues, general questions, or feature clarifications.
                        </p>
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <strong className="text-foreground">Response:</strong>
                            <p className="text-muted-foreground">Within 24 hours</p>
                          </div>
                          <div>
                            <strong className="text-foreground">Resolution Target:</strong>
                            <p className="text-muted-foreground">Within 3-5 business days</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 rounded-lg bg-muted/30 border-2 border-border/50">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="outline" className="text-sm">Priority 4</Badge>
                          <h3 className="text-lg font-semibold text-foreground">Low</h3>
                        </div>
                        <p className="text-muted-foreground mb-3">
                          Feature requests, minor improvements, suggestions, or cosmetic changes.
                        </p>
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <strong className="text-foreground">Response:</strong>
                            <p className="text-muted-foreground">Within 48 hours</p>
                          </div>
                          <div>
                            <strong className="text-foreground">Resolution:</strong>
                            <p className="text-muted-foreground">Scheduled based on availability and scope</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">3. Business Hours</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-lg bg-muted/30 border border-border/50">
                    <h3 className="font-semibold mb-3 text-foreground">Standard Support Hours</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span><strong>Days:</strong> Monday to Saturday</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span><strong>Hours:</strong> 9:00 AM - 6:00 PM IST</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span><strong>Time Zone:</strong> Indian Standard Time (IST)</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-5 rounded-lg bg-muted/30 border border-border/50">
                    <h3 className="font-semibold mb-3 text-foreground">Holidays & Exceptions</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Major Indian holidays may affect response times</li>
                      <li>• We'll notify you in advance of extended holiday periods</li>
                      <li>• Critical issues are still addressed during holidays</li>
                      <li>• International clients: We accommodate time zone differences</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Communication Channels */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">4. Communication Channels</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      We offer multiple channels for support and communication:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-3 mb-2">
                          <Mail className="w-5 h-5 text-primary" />
                          <h4 className="font-semibold text-foreground">Email Support</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          <a href="mailto:support@dubiqo.com" className="text-primary hover:underline">support@dubiqo.com</a>
                        </p>
                        <p className="text-xs text-muted-foreground">Primary channel for all support requests</p>
                      </div>
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-3 mb-2">
                          <Phone className="w-5 h-5 text-primary" />
                          <h4 className="font-semibold text-foreground">Phone Support</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Available for maintenance plan clients
                        </p>
                        <p className="text-xs text-muted-foreground">Scheduled calls during business hours</p>
                      </div>
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-3 mb-2">
                          <MessageCircle className="w-5 h-5 text-primary" />
                          <h4 className="font-semibold text-foreground">Support Portal</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          <Link to="/support" className="text-primary hover:underline">Visit Support Center</Link>
                        </p>
                        <p className="text-xs text-muted-foreground">Submit tickets and track requests</p>
                      </div>
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-3 mb-2">
                          <MessageCircle className="w-5 h-5 text-primary" />
                          <h4 className="font-semibold text-foreground">Video Calls</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Scheduled for project discussions
                        </p>
                        <p className="text-xs text-muted-foreground">Screen sharing and collaborative reviews</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Uptime Commitment */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">5. Uptime Commitment</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For websites hosted on our recommended platforms and managed under our maintenance plans, we target:
                </p>
                <div className="p-6 rounded-lg bg-success/10 border-2 border-success/30 text-center mb-4">
                  <div className="text-4xl font-bold gradient-text mb-2">99.5%</div>
                  <p className="text-muted-foreground">Uptime Target</p>
                </div>
                <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                  <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-warning" />
                    Uptime Exclusions
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    The following are excluded from uptime calculations:
                  </p>
                  <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                    <li>Scheduled maintenance (communicated at least 48 hours in advance)</li>
                    <li>Third-party service outages (hosting providers, CDNs, APIs)</li>
                    <li>Issues caused by client-side changes or modifications</li>
                    <li>Force majeure events (natural disasters, war, etc.)</li>
                    <li>DDoS attacks or security incidents beyond our control</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Escalation Process */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">6. Escalation Process</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you're not satisfied with the support you're receiving, you can escalate your concern:
                </p>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-bold text-primary">
                      1
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2 text-foreground">Request Escalation</h4>
                      <p className="text-sm text-muted-foreground">
                        Reply to your support thread with "ESCALATE" in the subject line, or contact us directly at 
                        <a href="mailto:support@dubiqo.com" className="text-primary hover:underline ml-1">support@dubiqo.com</a>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-bold text-primary">
                      2
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2 text-foreground">Senior Review</h4>
                      <p className="text-sm text-muted-foreground">
                        Your request will be reviewed by a senior team member or manager within 4 hours
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-bold text-primary">
                      3
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2 text-foreground">Resolution</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll contact you with an update and work to resolve your concern promptly
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exclusions */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">7. Service Exclusions</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This SLA does not cover the following:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-semibold mb-2 text-foreground">Unauthorized Modifications</h4>
                    <p className="text-sm text-muted-foreground">Issues caused by changes made outside our control</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-semibold mb-2 text-foreground">Third-Party Services</h4>
                    <p className="text-sm text-muted-foreground">Plugins, services, or integrations not provided by us</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-semibold mb-2 text-foreground">Client-Managed Hosting</h4>
                    <p className="text-sm text-muted-foreground">Issues with hosting environments we don't manage</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-semibold mb-2 text-foreground">Scope Expansion</h4>
                    <p className="text-sm text-muted-foreground">Feature requests or changes outside original scope</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SLA Credits */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">8. Service Credits</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For maintenance plan clients, if we fail to meet our SLA commitments:
                </p>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-semibold mb-2 text-foreground">Response Time Failures</h4>
                    <p className="text-sm text-muted-foreground">
                      If we fail to respond within the committed time frame, you may be eligible for a service credit 
                      of up to 10% of your monthly maintenance fee, applied to your next billing cycle.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-semibold mb-2 text-foreground">Uptime Failures</h4>
                    <p className="text-sm text-muted-foreground">
                      If uptime falls below 99.5% in a given month (excluding scheduled maintenance), service credits 
                      may be applied based on the severity and duration of the outage.
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Service credits are not refundable and can only be applied to future service fees. To request a 
                    service credit, contact us within 30 days of the SLA failure.
                  </p>
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
                    <h2 className="text-2xl font-bold mb-3">9. Contact & Support</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      For support inquiries, questions about this SLA, or to report an issue:
                    </p>
                    <div className="space-y-2 text-muted-foreground mb-4">
                      <p><strong>Email:</strong> <a href="mailto:support@dubiqo.com" className="text-primary hover:underline">support@dubiqo.com</a></p>
                      <p><strong>Support Portal:</strong> <Link to="/support" className="text-primary hover:underline">Visit Support Center</Link></p>
                      <p><strong>Phone:</strong> Available for maintenance plan clients</p>
                    </div>
                    <Button asChild variant="outline">
                      <Link to="/support">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Get Support
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Back Button */}
            <div className="text-center">
              <Button asChild variant="outline" className="border-primary/50">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>

          </div>
        </div>
      </Section>
    </Layout>
  );
}
