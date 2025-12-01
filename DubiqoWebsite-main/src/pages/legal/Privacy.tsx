import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4 text-center">
          <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            How we collect, use, and protect your information
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

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">1. Introduction</h2>
              <p className="text-foreground/80 leading-relaxed">
                Dubiqo Digital Solutions ("Dubiqo", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">Personal Information</h3>
              <p className="text-foreground/80 leading-relaxed">
                When you contact us, request a quote, or engage our services, we may collect:
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li>Name and contact information (email, phone number)</li>
                <li>Business or organization name</li>
                <li>Project requirements and preferences</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Communications and correspondence with us</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">Automatically Collected Information</h3>
              <p className="text-foreground/80 leading-relaxed">
                When you visit our website, we automatically collect:
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li>IP address and browser type</li>
                <li>Device information and operating system</li>
                <li>Pages visited and time spent on our website</li>
                <li>Referring website or source</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">3. How We Use Your Information</h2>
              <p className="text-foreground/80 leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li>Provide, operate, and maintain our services</li>
                <li>Process transactions and send related information</li>
                <li>Respond to inquiries and provide customer support</li>
                <li>Send updates, newsletters, and marketing communications (with consent)</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">4. Information Sharing</h2>
              <p className="text-foreground/80 leading-relaxed">
                We do not sell your personal information. We may share information with:
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li><strong>Service providers:</strong> Third-party vendors who assist in our operations (e.g., payment processors, hosting services)</li>
                <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business transfers:</strong> In connection with any merger or acquisition</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">5. Cookies</h2>
              <p className="text-foreground/80 leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience. You can control cookies through your browser settings. Disabling cookies may affect some website functionality.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">6. Data Security</h2>
              <p className="text-foreground/80 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">7. Your Rights</h2>
              <p className="text-foreground/80 leading-relaxed">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">8. Third-Party Links</h2>
              <p className="text-foreground/80 leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">9. Changes to This Policy</h2>
              <p className="text-foreground/80 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated revision date.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">10. Contact Us</h2>
              <p className="text-foreground/80 leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <ul className="list-none text-foreground/80 mt-3 space-y-1">
                <li>Email: <a href="mailto:privacy@dubiqo.com" className="text-primary hover:underline">privacy@dubiqo.com</a></li>
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

export default Privacy;
