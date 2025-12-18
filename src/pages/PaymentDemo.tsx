import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Section } from "@/components/ui/section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  CreditCard,
  CheckCircle2,
  Download,
  Shield,
  Lock,
  ArrowRight,
  Loader2
} from "lucide-react";

// Format paise to INR display
const formatINR = (paise: number) => {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(rupees);
};

// Demo invoice data (amounts in paise)
const demoInvoice = {
  id: "INV-2024-001",
  clientName: "Demo Client",
  clientEmail: "demo@example.com",
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  status: "pending",
  items: [
    { description: "Website Development", quantity: 1, rate: 5000000, amount: 5000000 },
    { description: "UI/UX Design", quantity: 40, rate: 7500, amount: 300000 },
    { description: "Content Writing", quantity: 10, rate: 5000, amount: 50000 },
  ],
  subtotal: 5350000, // ₹53,500
  tax: 963000, // 18% GST = ₹9,630
  total: 6313000, // ₹63,130
};

export default function PaymentDemo() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);

  useEffect(() => {
    loadRecentPayments();
  }, []);

  const loadRecentPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        setRecentPayments(data);
      }
    } catch (e) {
      console.error('Error loading payments:', e);
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Call the create-checkout-session Edge Function
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          invoice_id: 'demo-invoice',
          amount: demoInvoice.total,
          currency: 'inr',
          description: `Payment for ${demoInvoice.id}`,
          customer_email: demoInvoice.clientEmail,
          success_url: `${window.location.origin}/payment-demo?success=true`,
          cancel_url: `${window.location.origin}/payment-demo?cancelled=true`,
        }
      });

      if (error) throw error;

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        // Demo mode - simulate success
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsPaid(true);
        toast.success("Payment successful!", {
          description: "Thank you for your payment. A receipt has been sent to your email."
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      // Simulate success for demo purposes
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsPaid(true);
      toast.success("Demo payment processed!", {
        description: "In production, this would redirect to Stripe Checkout."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Check URL params for payment result
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setIsPaid(true);
      toast.success("Payment successful!");
      window.history.replaceState({}, '', '/payment-demo');
    } else if (params.get('cancelled') === 'true') {
      toast.info("Payment cancelled");
      window.history.replaceState({}, '', '/payment-demo');
    }
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return <Badge className="bg-success/10 text-success border-success/20">Paid</Badge>;
      case "pending":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
      case "overdue":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative">
          <Badge variant="outline" className="mb-4">Demo</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Payment Demo
          </h1>
          <p className="text-muted-foreground">
            Experience our seamless invoice payment flow with Stripe (INR)
          </p>
        </div>
      </section>

      <Section className="pt-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            {/* Invoice Details */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{demoInvoice.id}</CardTitle>
                    <CardDescription>
                      Issued: {new Date(demoInvoice.date).toLocaleDateString('en-IN')}
                    </CardDescription>
                  </div>
                  {getStatusBadge(isPaid ? "paid" : demoInvoice.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Client Info */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Bill To</p>
                    <p className="font-medium">{demoInvoice.clientName}</p>
                    <p className="text-sm text-muted-foreground">{demoInvoice.clientEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Due Date</p>
                    <p className="font-medium">{new Date(demoInvoice.dueDate).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>

                <Separator />

                {/* Line Items */}
                <div>
                  <div className="grid grid-cols-[1fr_80px_100px_120px] gap-4 text-sm font-medium text-muted-foreground mb-3">
                    <span>Description</span>
                    <span className="text-right">Qty</span>
                    <span className="text-right">Rate</span>
                    <span className="text-right">Amount</span>
                  </div>
                  {demoInvoice.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-[1fr_80px_100px_120px] gap-4 py-3 border-b border-border last:border-0">
                      <span>{item.description}</span>
                      <span className="text-right text-muted-foreground">{item.quantity}</span>
                      <span className="text-right text-muted-foreground">{formatINR(item.rate)}</span>
                      <span className="text-right font-medium">{formatINR(item.amount)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatINR(demoInvoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span>{formatINR(demoInvoice.tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Due</span>
                    <span className="gradient-text">{formatINR(demoInvoice.total)}</span>
                  </div>
                </div>

                {/* Download Button */}
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <div className="space-y-6">
              {isPaid ? (
                <Card className="bg-success/5 border-success/20">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-success" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Payment Complete!</h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for your payment. A receipt has been sent to your email.
                    </p>
                    <div className="space-y-3">
                      <Button className="w-full" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download Receipt
                      </Button>
                      <Button className="w-full" variant="ghost" onClick={() => setIsPaid(false)}>
                        Reset Demo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Pay Invoice
                    </CardTitle>
                    <CardDescription>
                      Secure payment powered by Stripe
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-2">Amount to Pay</p>
                      <p className="text-3xl font-bold">{formatINR(demoInvoice.total)}</p>
                      <p className="text-sm text-muted-foreground mt-1">INR</p>
                    </div>

                    <Separator />

                    <Button
                      className="w-full glow-primary"
                      size="lg"
                      onClick={handlePayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Redirecting to Stripe...
                        </>
                      ) : (
                        <>
                          Pay {formatINR(demoInvoice.total)}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Lock className="w-4 h-4" />
                      <span>Secured with 256-bit SSL encryption</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Trust Badges */}
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="font-medium">Secure Payment</span>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      PCI DSS compliant
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      256-bit SSL encryption
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      No card data stored on our servers
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      {/* Payment History */}
      <Section variant="muted">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Recent Payments</h2>
          {isLoadingPayments ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : recentPayments.length > 0 ? (
            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <Card key={payment.id} className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <p className="font-medium">Payment #{payment.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(payment.created_at).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatINR(Number(payment.amount))}</p>
                      {getStatusBadge(payment.status)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Show demo data when no real payments exist */}
              {[
                { id: "demo-1", amount: 6313000, date: "2024-01-28", status: "completed" },
                { id: "demo-2", amount: 5500000, date: "2023-12-15", status: "completed" },
                { id: "demo-3", amount: 3200000, date: "2023-11-02", status: "completed" },
              ].map((payment) => (
                <Card key={payment.id} className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <p className="font-medium">INV-2024-{payment.id.slice(-1)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(payment.date).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatINR(payment.amount)}</p>
                      {getStatusBadge(payment.status)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Section>
    </Layout>
  );
}
