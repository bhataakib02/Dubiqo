import { Layout } from "@/components/layout/Layout";
import { Section, SectionHeader } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, FileText, Globe, Mail, AlertCircle } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
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
                    <h2 className="text-2xl font-bold mb-3">Introduction</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Dubiqo Digital Solutions ("we," "our," or "us") is committed to protecting your privacy. 
                      This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
                      you visit our website, use our services, or interact with us. By using our services, you agree 
                      to the collection and use of information in accordance with this policy.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Eye className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-foreground">1.1 Personal Information</h3>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                          We collect information that you provide directly to us, including:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                          <li><strong>Contact Information:</strong> Name, email address, phone number, mailing address</li>
                          <li><strong>Account Information:</strong> Username, password, profile information</li>
                          <li><strong>Business Information:</strong> Company name, job title, business address</li>
                          <li><strong>Project Information:</strong> Project requirements, specifications, and related communications</li>
                          <li><strong>Payment Information:</strong> Billing address, payment method details (processed securely through third-party providers)</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-foreground">1.2 Automatically Collected Information</h3>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                          When you visit our website, we automatically collect certain information about your device:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                          <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                          <li><strong>Usage Data:</strong> Pages visited, time spent on pages, click patterns, referring URLs</li>
                          <li><strong>Location Data:</strong> General geographic location based on IP address</li>
                          <li><strong>Cookies and Tracking:</strong> Information collected through cookies, web beacons, and similar technologies</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-foreground">1.3 Third-Party Information</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          We may receive information about you from third-party services, such as social media platforms 
                          (if you connect your account), payment processors, and analytics providers.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      We use the information we collect for the following purposes:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                        <h4 className="font-semibold mb-2">Service Delivery</h4>
                        <p className="text-sm text-muted-foreground">
                          To provide, maintain, and improve our services, process transactions, and fulfill your requests
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                        <h4 className="font-semibold mb-2">Communication</h4>
                        <p className="text-sm text-muted-foreground">
                          To send you updates, respond to inquiries, provide customer support, and send important notices
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                        <h4 className="font-semibold mb-2">Marketing</h4>
                        <p className="text-sm text-muted-foreground">
                          To send promotional materials, newsletters, and information about products and services (with your consent)
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                        <h4 className="font-semibold mb-2">Analytics & Improvement</h4>
                        <p className="text-sm text-muted-foreground">
                          To analyze usage patterns, improve our website, and develop new features and services
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                        <h4 className="font-semibold mb-2">Legal Compliance</h4>
                        <p className="text-sm text-muted-foreground">
                          To comply with legal obligations, enforce our terms, and protect our rights and safety
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                        <h4 className="font-semibold mb-2">Security</h4>
                        <p className="text-sm text-muted-foreground">
                          To detect, prevent, and address fraud, security breaches, and other harmful activities
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">3. Information Sharing and Disclosure</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      We do not sell your personal information. We may share your information only in the following circumstances:
                    </p>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                        <h4 className="font-semibold mb-2">Service Providers</h4>
                        <p className="text-sm text-muted-foreground">
                          We may share information with trusted third-party service providers who assist us in operating our 
                          business, such as hosting providers, payment processors, email services, and analytics providers. 
                          These providers are contractually obligated to protect your information.
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                        <h4 className="font-semibold mb-2">Business Transfers</h4>
                        <p className="text-sm text-muted-foreground">
                          In the event of a merger, acquisition, or sale of assets, your information may be transferred to 
                          the acquiring entity, subject to the same privacy protections.
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                        <h4 className="font-semibold mb-2">Legal Requirements</h4>
                        <p className="text-sm text-muted-foreground">
                          We may disclose information if required by law, court order, or government regulation, or to 
                          protect our rights, property, or safety, or that of others.
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                        <h4 className="font-semibold mb-2">With Your Consent</h4>
                        <p className="text-sm text-muted-foreground">
                          We may share your information with your explicit consent or at your direction.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We implement industry-standard security measures to protect your personal information:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                  <li><strong>Encryption:</strong> We use SSL/TLS encryption for data transmission</li>
                  <li><strong>Access Controls:</strong> Limited access to personal information on a need-to-know basis</li>
                  <li><strong>Secure Storage:</strong> Data stored on secure servers with regular security audits</li>
                  <li><strong>Regular Updates:</strong> We keep our systems updated with the latest security patches</li>
                  <li><strong>Employee Training:</strong> Our team is trained on data protection best practices</li>
                </ul>
                <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      <strong>Important:</strong> While we strive to protect your information, no method of transmission 
                      over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">5. Your Privacy Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Depending on your location, you may have the following rights regarding your personal information:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-semibold mb-2">Access</h4>
                    <p className="text-sm text-muted-foreground">Request a copy of your personal data</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-semibold mb-2">Correction</h4>
                    <p className="text-sm text-muted-foreground">Request correction of inaccurate data</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-semibold mb-2">Deletion</h4>
                    <p className="text-sm text-muted-foreground">Request deletion of your personal data</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-semibold mb-2">Portability</h4>
                    <p className="text-sm text-muted-foreground">Request transfer of your data to another service</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-semibold mb-2">Objection</h4>
                    <p className="text-sm text-muted-foreground">Object to processing of your personal data</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-semibold mb-2">Restriction</h4>
                    <p className="text-sm text-muted-foreground">Request restriction of processing</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  To exercise these rights, please contact us at <a href="mailto:thefreelancer2076@gmail.com" className="text-primary hover:underline">thefreelancer2076@gmail.com</a>
                </p>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">6. Cookies and Tracking Technologies</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use cookies and similar tracking technologies to collect and store information about your preferences 
                  and interactions with our website. Types of cookies we use:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="shrink-0">Essential</Badge>
                    <p className="text-sm text-muted-foreground">
                      Required for the website to function properly. Cannot be disabled.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="shrink-0">Analytics</Badge>
                    <p className="text-sm text-muted-foreground">
                      Help us understand how visitors interact with our website to improve user experience.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="shrink-0">Functional</Badge>
                    <p className="text-sm text-muted-foreground">
                      Remember your preferences and settings to provide enhanced features.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="shrink-0">Marketing</Badge>
                    <p className="text-sm text-muted-foreground">
                      Used to deliver relevant advertisements and track campaign effectiveness.
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  You can control cookies through your browser settings. Note that disabling cookies may affect website functionality.
                </p>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">7. Data Retention</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your personal information only for as long as necessary to fulfill the purposes outlined in this 
                  policy, unless a longer retention period is required or permitted by law. When we no longer need your information, 
                  we will securely delete or anonymize it in accordance with our data retention policies.
                </p>
              </CardContent>
            </Card>

            {/* Children's Privacy */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect personal 
                  information from children. If you believe we have collected information from a child, please contact us 
                  immediately, and we will take steps to delete such information.
                </p>
              </CardContent>
            </Card>

            {/* International Transfers */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">9. International Data Transfers</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your information may be transferred to and processed in countries other than your country of residence. 
                  These countries may have different data protection laws. We take appropriate safeguards to ensure your 
                  information receives adequate protection in accordance with this Privacy Policy.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Policy */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">10. Changes to This Privacy Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, 
                  operational, or regulatory reasons. We will notify you of any material changes by posting the new policy 
                  on this page and updating the "Last Updated" date. Your continued use of our services after such changes 
                  constitutes acceptance of the updated policy.
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
                    <h2 className="text-2xl font-bold mb-3">11. Contact Us</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
                      please contact us:
                    </p>
                    <div className="space-y-2 text-muted-foreground">
                      <p><strong>Email:</strong> <a href="mailto:thefreelancer2076@gmail.com" className="text-primary hover:underline">thefreelancer2076@gmail.com</a></p>
                      <p><strong>Support:</strong> <a href="mailto:thefreelancer2076@gmail.com" className="text-primary hover:underline">thefreelancer2076@gmail.com</a></p>
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
