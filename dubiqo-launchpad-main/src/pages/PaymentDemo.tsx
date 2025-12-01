import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Section } from "@/components/ui/section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  CreditCard,
  FileText,
  CheckCircle2,
  Clock,
  Download,
  Shield,
  Lock,
  ArrowRight
} from "lucide-react";

// Mock invoice data
const mockInvoice = {
  id: "INV-2024-001",
  clientName: "Acme Corporation",
  clientEmail: "billing@acme.com",
  date: "2024-01-28",
  dueDate: "2024-02-28",
  status: "pending",
  items: [
    { description: "Website Development", quantity: 1, rate: 5000, amount: 5000 },
    { description: "UI/UX Design", quantity: 40, rate: 75, amount: 3000 },
    { description: "Content Writing", quantity: 10, rate: 50, amount: 500 },
  ],
  subtotal: 8500,
  tax: 765,
  total: 9265,
  currency: "USD"
};

export default function PaymentDemo() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsPaid(true);
    toast.success("Payment successful!", {
      description: "Thank you for your payment. A receipt has been sent to your email."
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
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
            Experience our seamless invoice payment flow
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
                    <CardTitle className="text-2xl">{mockInvoice.id}</CardTitle>
                    <CardDescription>
                      Issued: {new Date(mockInvoice.date).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  {getStatusBadge(isPaid ? "paid" : mockInvoice.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Client Info */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Bill To</p>
                    <p className="font-medium">{mockInvoice.clientName}</p>
                    <p className="text-sm text-muted-foreground">{mockInvoice.clientEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Due Date</p>
                    <p className="font-medium">{new Date(mockInvoice.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <Separator />

                {/* Line Items */}
                <div>
                  <div className="grid grid-cols-[1fr_80px_80px_100px] gap-4 text-sm font-medium text-muted-foreground mb-3">
                    <span>Description</span>
                    <span className="text-right">Qty</span>
                    <span className="text-right">Rate</span>
                    <span className="text-right">Amount</span>
                  </div>
                  {mockInvoice.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-[1fr_80px_80px_100px] gap-4 py-3 border-b border-border last:border-0">
                      <span>{item.description}</span>
                      <span className="text-right text-muted-foreground">{item.quantity}</span>
                      <span className="text-right text-muted-foreground">${item.rate}</span>
                      <span className="text-right font-medium">${item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${mockInvoice.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (9%)</span>
                    <span>${mockInvoice.tax.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Due</span>
                    <span className="gradient-text">${mockInvoice.total.toLocaleString()}</span>
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
                    <div className="space-y-2">
                      <Label htmlFor="card">Card Number</Label>
                      <Input id="card" placeholder="4242 4242 4242 4242" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">Name on Card</Label>
                      <Input id="name" placeholder="John Doe" />
                    </div>

                    <Separator />

                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${mockInvoice.total.toLocaleString()} USD</span>
                    </div>

                    <Button
                      className="w-full glow-primary"
                      size="lg"
                      onClick={handlePayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Pay ${mockInvoice.total.toLocaleString()}
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
          <div className="space-y-4">
            {[
              { id: "PAY-003", invoice: "INV-2024-001", amount: 9265, date: "2024-01-28", status: "completed" },
              { id: "PAY-002", invoice: "INV-2023-045", amount: 5500, date: "2023-12-15", status: "completed" },
              { id: "PAY-001", invoice: "INV-2023-032", amount: 3200, date: "2023-11-02", status: "completed" },
            ].map((payment) => (
              <Card key={payment.id} className="bg-card/50 backdrop-blur border-border/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium">{payment.invoice}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${payment.amount.toLocaleString()}</p>
                    <Badge className="bg-success/10 text-success border-success/20">Paid</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>
    </Layout>
  );
}
