import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  EyeOff,
  FolderOpen,
  CreditCard,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
  LogOut,
  User,
  Settings,
  Bell,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ClientPortal = () => {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginData(prev => ({ ...prev, [id]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Missing Credentials",
        description: "Please enter your email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Demo login (accept any credentials for demo)
    setIsLoggedIn(true);
    toast({
      title: "Welcome Back! ✓",
      description: "You've successfully logged into your client portal.",
    });

    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginData({ email: "", password: "" });
    toast({
      title: "Logged Out",
      description: "You've been successfully logged out.",
    });
  };

  // Mock data for dashboard
  const projects = [
    { id: 1, name: "E-Commerce Website", status: "In Progress", progress: 75, lastUpdate: "2 hours ago" },
    { id: 2, name: "Admin Dashboard", status: "Review", progress: 90, lastUpdate: "Yesterday" },
    { id: 3, name: "Portfolio Redesign", status: "Completed", progress: 100, lastUpdate: "1 week ago" },
  ];

  const invoices = [
    { id: "INV-001", amount: "₹12,499", status: "Paid", date: "Nov 15, 2025" },
    { id: "INV-002", amount: "₹6,249", status: "Pending", date: "Nov 28, 2025" },
    { id: "INV-003", amount: "₹9,999", status: "Paid", date: "Oct 20, 2025" },
  ];

  const tickets = [
    { id: "TKT-001", subject: "Logo update request", status: "Open", priority: "Normal", date: "Nov 27, 2025" },
    { id: "TKT-002", subject: "Mobile menu not working", status: "Resolved", priority: "High", date: "Nov 25, 2025" },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "paid":
      case "resolved":
        return "text-green-500 bg-green-500/10";
      case "in progress":
      case "pending":
      case "open":
        return "text-yellow-500 bg-yellow-500/10";
      case "review":
        return "text-blue-500 bg-blue-500/10";
      default:
        return "text-foreground/60 bg-muted";
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4">
          <Card className="glass border-border/40 max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="text-3xl font-bold text-gradient mb-2">Dubiqo</div>
              <CardTitle className="text-2xl">Client Portal</CardTitle>
              <CardDescription className="pt-2">
                Sign in to access your projects, invoices, and support tickets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="bg-muted/50 border-border/40"
                    value={loginData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="bg-muted/50 border-border/40 pr-10"
                      value={loginData.password}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full gradient-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <p className="text-sm text-center text-foreground/60">
                  <a href="#" className="text-primary hover:underline">Forgot password?</a>
                </p>
              </form>

              <div className="mt-6 pt-6 border-t border-border/40">
                <p className="text-sm text-center text-foreground/60 mb-4">
                  Don't have an account?
                </p>
                <Button asChild variant="outline" className="w-full border-primary/50">
                  <Link to="/contact">Request Access</Link>
                </Button>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
                <p className="text-xs text-center text-foreground/70">
                  <strong>Demo Mode:</strong> Enter any email and password to explore the client portal interface.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-card/30">
      {/* Portal Header */}
      <div className="gradient-primary border-b border-border/40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-primary-foreground">Dubiqo</div>
              <span className="text-primary-foreground/70 text-sm hidden sm:inline">Client Portal</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10">
                <Settings className="h-5 w-5" />
              </Button>
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 text-primary-foreground">
                <User className="h-4 w-4" />
                <span className="text-sm">{loginData.email || "demo@client.com"}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary-foreground hover:bg-white/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <Card className="glass border-primary glow mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">Welcome Back!</h1>
                <p className="text-foreground/70">Here's an overview of your projects and account activity.</p>
              </div>
              <Button asChild className="gradient-primary">
                <Link to="/contact">Start New Project</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="glass border-border/40">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <FolderOpen className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-foreground/60">Active Projects</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass border-border/40">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹28,747</p>
                <p className="text-sm text-foreground/60">Total Paid</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass border-border/40">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹6,249</p>
                <p className="text-sm text-foreground/60">Pending Payment</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass border-border/40">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-foreground/60">Open Tickets</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="glass border-border/40 w-full justify-start">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Invoices
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Support
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            {projects.map((project) => (
              <Card key={project.id} className="glass border-border/40">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-foreground/60">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Last update: {project.lastUpdate}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-foreground/60">Progress</p>
                        <p className="text-lg font-bold text-primary">{project.progress}%</p>
                      </div>
                      <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                        <div 
                          className="h-full gradient-primary transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-4">
            {invoices.map((invoice) => (
              <Card key={invoice.id} className="glass border-border/40">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{invoice.id}</p>
                        <p className="text-sm text-foreground/60">{invoice.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                      <p className="font-bold text-lg">{invoice.amount}</p>
                      {invoice.status === "Pending" && (
                        <Button size="sm" className="gradient-primary">Pay Now</Button>
                      )}
                      {invoice.status === "Paid" && (
                        <Button size="sm" variant="outline" className="border-border/40">Download</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Your Support Tickets</h3>
              <Button size="sm" className="gradient-primary">New Ticket</Button>
            </div>
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="glass border-border/40">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{ticket.subject}</p>
                        <p className="text-sm text-foreground/60">{ticket.id} • {ticket.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ticket.priority === "High" ? "text-red-500 bg-red-500/10" : "text-foreground/60 bg-muted"
                      }`}>
                        {ticket.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                      <Button size="sm" variant="outline" className="border-border/40">View</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Portal Notice */}
        <Card className="glass border-border/40 mt-8">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-foreground/60">
              This is a demo interface. In production, this portal connects to your actual project data, invoices, and support system.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientPortal;
