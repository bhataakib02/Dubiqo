import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowLeft } from "lucide-react";

const SLA = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4 text-center">
          <Clock className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Service Level Agreement
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Our commitment to response times and service quality
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

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Overview</h2>
              <p className="text-foreground/80 leading-relaxed">
                This Service Level Agreement (SLA) outlines the support and service standards you can expect from Dubiqo Digital Solutions. These commitments apply to active projects and clients with maintenance plans.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Response Time Commitments</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">During Active Projects</h3>
              <p className="text-foreground/80 leading-relaxed">
                While your project is in progress, we commit to:
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li><strong>Initial Response:</strong> Within 24 hours on business days</li>
                <li><strong>Progress Updates:</strong> At least 2-3 times per week</li>
                <li><strong>Urgent Matters:</strong> Same-day response during business hours</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">Post-Launch Support Period</h3>
              <p className="text-foreground/80 leading-relaxed">
                During your included support period after launch:
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li><strong>General Inquiries:</strong> Response within 24-48 hours</li>
                <li><strong>Bug Reports:</strong> Acknowledgment within 24 hours, resolution based on severity</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">Maintenance Plan Clients</h3>
              <p className="text-foreground/80 leading-relaxed">
                Clients with active maintenance plans receive:
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li><strong>Basic Plan:</strong> Response within 24 hours</li>
                <li><strong>Professional Plan:</strong> Response within 12 hours, priority queue</li>
                <li><strong>Enterprise Plan:</strong> Response within 4 hours, dedicated support</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Issue Priority Levels</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">Critical (Priority 1)</h3>
              <p className="text-foreground/80 leading-relaxed">
                Website completely down, security breach, or data loss.
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li>Response: Within 2 hours (maintenance clients) / 4 hours (others)</li>
                <li>Resolution target: Within 8 hours</li>
                <li>Available 24/7 for critical emergencies</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">High (Priority 2)</h3>
              <p className="text-foreground/80 leading-relaxed">
                Major feature not working, significant performance issues.
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li>Response: Within 8 hours</li>
                <li>Resolution target: Within 24-48 hours</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">Normal (Priority 3)</h3>
              <p className="text-foreground/80 leading-relaxed">
                Minor bugs, non-critical issues, general questions.
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li>Response: Within 24 hours</li>
                <li>Resolution target: Within 3-5 business days</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">Low (Priority 4)</h3>
              <p className="text-foreground/80 leading-relaxed">
                Feature requests, minor improvements, suggestions.
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li>Response: Within 48 hours</li>
                <li>Resolution: Scheduled based on availability and scope</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Business Hours</h2>
              <p className="text-foreground/80 leading-relaxed">
                Standard support is available:
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li><strong>Days:</strong> Monday to Saturday</li>
                <li><strong>Hours:</strong> 9:00 AM - 6:00 PM IST (Indian Standard Time)</li>
                <li><strong>Holidays:</strong> Major Indian holidays may affect response times</li>
              </ul>
              <p className="text-foreground/80 leading-relaxed mt-4">
                For international clients, we accommodate reasonable time zone differences and schedule calls accordingly.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Communication Channels</h2>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li><strong>Email:</strong> <a href="mailto:support@dubiqo.com" className="text-primary hover:underline">support@dubiqo.com</a> (primary channel)</li>
                <li><strong>WhatsApp:</strong> For quick updates and urgent matters</li>
                <li><strong>Video Calls:</strong> Scheduled for project discussions and reviews</li>
                <li><strong>Live Chat:</strong> Available on our website during business hours</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Uptime Commitment</h2>
              <p className="text-foreground/80 leading-relaxed">
                For websites hosted on our recommended platforms and managed under our maintenance plans, we target 99.5% uptime. This excludes:
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li>Scheduled maintenance (communicated in advance)</li>
                <li>Third-party service outages</li>
                <li>Issues caused by client-side changes</li>
                <li>Force majeure events</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Escalation Process</h2>
              <p className="text-foreground/80 leading-relaxed">
                If you're not satisfied with the support you're receiving:
              </p>
              <ol className="list-decimal pl-6 text-foreground/80 space-y-2 mt-3">
                <li>Reply to your support thread with "ESCALATE" in the subject</li>
                <li>Your request will be reviewed by a senior team member</li>
                <li>We'll contact you within 4 hours with an update</li>
              </ol>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Exclusions</h2>
              <p className="text-foreground/80 leading-relaxed">
                This SLA does not cover:
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2 mt-3">
                <li>Issues caused by unauthorized modifications to the website</li>
                <li>Third-party plugins, services, or integrations not provided by us</li>
                <li>Problems with client-managed hosting</li>
                <li>Feature requests or scope expansion (quoted separately)</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Contact</h2>
              <p className="text-foreground/80 leading-relaxed">
                For support inquiries, contact us at <a href="mailto:support@dubiqo.com" className="text-primary hover:underline">support@dubiqo.com</a> or visit our <Link to="/support" className="text-primary hover:underline">Support Center</Link>.
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

export default SLA;
