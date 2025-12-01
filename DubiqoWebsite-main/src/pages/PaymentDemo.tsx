import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  ArrowRight,
  Loader2,
  Receipt,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const PaymentDemo = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4);
    }
    return v;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || !expiry || !cvv) {
      toast({
        title: "Missing Information",
        description: "Please fill in all card details.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setPaymentComplete(true);
    
    toast({
      title: "Payment Successful! ✓",
      description: "Your payment has been processed. Check your email for confirmation.",
    });
  };

  const currentInvoice = {
    id: "INV-2025-042",
    client: "Demo Client",
    date: "Nov 29, 2025",
    dueDate: "Dec 15, 2025",
    items: [
      { description: "Professional Website Development", amount: 9999 },
      { description: "Blog Integration (Add-on)", amount: 1500 },
      { description: "SEO Optimization", amount: 1000 },
    ],
    status: paymentComplete ? "Paid" : "Pending",
  };

  const subtotal = currentInvoice.items.reduce((sum, item) => sum + item.amount, 0);
  const tax = 0;
  const total = subtotal + tax;

  const pastPayments = [
    { id: "PAY-2025-041", invoiceId: "INV-2025-041", amount: 4999, date: "Nov 15, 2025", status: "Completed" },
    { id: "PAY-2025-040", invoiceId: "INV-2025-040", amount: 2499, date: "Oct 28, 2025", status: "Completed" },
    { id: "PAY-2025-039", invoiceId: "INV-2025-039", amount: 14999, date: "Oct 10, 2025", status: "Completed" },
  ];

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "paid":
        return "text-green-500 bg-green-500/10";
      case "pending":
        return "text-yellow-500 bg-yellow-500/10";
      case "overdue":
        return "text-red-500 bg-red-500/10";
      default:
        return "text-foreground/60 bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-card/30">
      {/* Header */}
      <div className="gradient-primary border-b border-border/40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">Billing & Payments</h1>
              <p className="text-primary-foreground/80 text-sm">Demo: Custom billing system interface</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-white/20 text-primary-foreground">
              Demo Mode
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Current Invoice */}
          <div className="space-y-6">
            <Card className="glass border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-primary" />
                    Invoice {currentInvoice.id}
                  </CardTitle>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(currentInvoice.status)}`}>
                    {currentInvoice.status}
                  </span>
                </div>
                <CardDescription>
                  Issued: {currentInvoice.date} • Due: {currentInvoice.dueDate}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-t border-b border-border/40 py-4 space-y-3">
                    {currentInvoice.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-foreground/80">{item.description}</span>
                        <span className="font-medium">₹{item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Tax (0%)</span>
                      <span>₹{tax}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-border/40">
                      <span>Total</span>
                      <span className="text-gradient">₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  {paymentComplete ? (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                      <div>
                        <p className="font-medium text-green-500">Payment Complete</p>
                        <p className="text-sm text-foreground/60">Receipt sent to your email</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                      <Clock className="h-6 w-6 text-yellow-500" />
                      <div>
                        <p className="font-medium text-yellow-500">Payment Due</p>
                        <p className="text-sm text-foreground/60">Due by {currentInvoice.dueDate}</p>
                      </div>
                    </div>
                  )}

                  <Button variant="outline" className="w-full border-border/40">
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Past Payments */}
            <Card className="glass border-border/40">
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Your previous transactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {pastPayments.map((payment, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{payment.id}</p>
                        <p className="text-xs text-foreground/60">{payment.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{payment.amount.toLocaleString()}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusStyle(payment.status)}`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="space-y-6">
            <Card className={`glass ${paymentComplete ? "border-green-500/50" : "border-primary glow"}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  {paymentComplete ? "Payment Complete" : "Make a Payment"}
                </CardTitle>
                <CardDescription>
                  {paymentComplete 
                    ? "Thank you for your payment" 
                    : "Secure payment processing"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {paymentComplete ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                    <p className="text-foreground/70 mb-6">
                      Your payment of ₹{total.toLocaleString()} has been received.
                    </p>
                    <Button 
                      onClick={() => {
                        setPaymentComplete(false);
                        setCardNumber("");
                        setExpiry("");
                        setCvv("");
                      }}
                      variant="outline"
                      className="border-border/40"
                    >
                      Make Another Payment
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handlePayment} className="space-y-4">
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-foreground/70">Amount to Pay</span>
                        <span className="text-2xl font-bold text-gradient">₹{total.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="card">Card Number</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="card"
                          placeholder="4242 4242 4242 4242"
                          className="pl-10 bg-muted/50 border-border/40"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          maxLength={19}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          className="bg-muted/50 border-border/40"
                          value={expiry}
                          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                          maxLength={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          className="bg-muted/50 border-border/40"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                          maxLength={3}
                          type="password"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full gradient-primary" 
                      size="lg"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Pay ₹{total.toLocaleString()}
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-xs text-foreground/50">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"/>
                      </svg>
                      <span>This is a demo. No real payment will be processed.</span>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="glass border-border/40">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Demo Mode</p>
                    <p className="text-foreground/60">
                      This is a demonstration of our custom billing UI. In production, this integrates with Razorpay or Stripe for secure payment processing.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <Card className="glass border-primary glow max-w-4xl mx-auto mt-12">
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Need a Custom Billing System?</h2>
            <p className="text-foreground/70 mb-6 max-w-xl mx-auto">
              We build complete billing and invoicing solutions with payment integration, client portals, and automated reminders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="gradient-primary">
                <Link to="/quote">Get a Quote</Link>
              </Button>
              <Button asChild variant="outline" className="border-primary/50">
                <Link to="/services/billing-systems">Learn More</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentDemo;
