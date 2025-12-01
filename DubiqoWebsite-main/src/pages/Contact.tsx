import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, MapPin, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendContactForm } from "@/utils/emailService";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Send contact form email to admin
      const success = await sendContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        projectType: formData.projectType || "Not specified",
        budget: formData.budget || "Not specified",
        timeline: formData.timeline || "Not specified",
        message: formData.message,
      });

      if (success) {
        toast({
          title: "Message Sent Successfully! ✓",
          description: "Thank you for contacting us. We'll get back to you within 24 hours. An email has been sent to our admin team.",
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          projectType: "",
          budget: "",
          timeline: "",
          message: "",
        });
      } else {
        toast({
          title: "Submission Failed",
          description: "There was an error sending your message. Please try again or contact us directly at hello@dubiqo.com",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error sending your message. Please try again or contact us directly at hello@dubiqo.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Get In Touch
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Have a project in mind? Need help with your website? Let's talk and see how we can help you achieve your goals.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="glass border-border/40">
                <CardHeader>
                  <Mail className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Email Us</CardTitle>
                  <CardDescription className="pt-2">
                    <a href="mailto:hello@dubiqo.com" className="hover:text-primary transition-colors">hello@dubiqo.com</a><br />
                    <a href="mailto:support@dubiqo.com" className="hover:text-primary transition-colors">support@dubiqo.com</a>
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="glass border-border/40">
                <CardHeader>
                  <MapPin className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Location</CardTitle>
                  <CardDescription className="pt-2">
                    Remote-first team<br />
                    Serving clients worldwide
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="glass border-border/40">
                <CardHeader>
                  <Clock className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Working Hours</CardTitle>
                  <CardDescription className="pt-2">
                    Monday - Saturday<br />
                    9:00 AM - 6:00 PM IST<br />
                    <span className="text-xs text-foreground/60">(We respond within 24 hours)</span>
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="glass border-border/40 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name *</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        className="bg-muted/50 border-border/40"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="bg-muted/50 border-border/40"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="bg-muted/50 border-border/40"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-type">Project Type *</Label>
                      <Select value={formData.projectType} onValueChange={(value) => handleSelectChange("projectType", value)}>
                        <SelectTrigger className="bg-muted/50 border-border/40">
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent className="glass border-border/40">
                          <SelectItem value="website">Website Development</SelectItem>
                          <SelectItem value="portfolio">Portfolio</SelectItem>
                          <SelectItem value="dashboard">Dashboard/Admin Panel</SelectItem>
                          <SelectItem value="billing">Billing System</SelectItem>
                          <SelectItem value="troubleshooting">Bug Fixing/Troubleshooting</SelectItem>
                          <SelectItem value="maintenance">Maintenance & Support</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget Range</Label>
                      <Select value={formData.budget} onValueChange={(value) => handleSelectChange("budget", value)}>
                        <SelectTrigger className="bg-muted/50 border-border/40">
                          <SelectValue placeholder="Select budget" />
                        </SelectTrigger>
                        <SelectContent className="glass border-border/40">
                          <SelectItem value="5k">Under ₹5,000</SelectItem>
                          <SelectItem value="5-10k">₹5,000 - ₹10,000</SelectItem>
                          <SelectItem value="10-20k">₹10,000 - ₹20,000</SelectItem>
                          <SelectItem value="20k+">₹20,000+</SelectItem>
                          <SelectItem value="discuss">Let's discuss</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeline">When do you want to start?</Label>
                      <Select value={formData.timeline} onValueChange={(value) => handleSelectChange("timeline", value)}>
                        <SelectTrigger className="bg-muted/50 border-border/40">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent className="glass border-border/40">
                          <SelectItem value="asap">ASAP / Urgent</SelectItem>
                          <SelectItem value="1-2weeks">1-2 weeks</SelectItem>
                          <SelectItem value="1month">Within 1 month</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Project Details *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your project, what you need, any specific requirements..."
                      className="bg-muted/50 border-border/40 min-h-32"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gradient-primary" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-center text-foreground/60">
                    By submitting this form, you agree to our privacy policy. We'll never share your information with third parties.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Alternative Contact Methods */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Other Ways to Reach Us</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Choose your preferred communication method
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="glass border-border/40 text-center hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <CardTitle>WhatsApp</CardTitle>
                <CardDescription className="pt-2">
                  Quick responses for urgent queries<br />
                  <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">+91 98765 43210</a>
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="glass border-border/40 text-center hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <CardTitle>Schedule a Call</CardTitle>
                <CardDescription className="pt-2">
                  Book a 30-minute consultation<br />
                  <a href="/booking" className="text-primary hover:underline">Go to Booking Page</a>
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="glass border-border/40 text-center hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <CardTitle>Live Chat</CardTitle>
                <CardDescription className="pt-2">
                  Click the chat icon in the bottom-right corner for instant support
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
