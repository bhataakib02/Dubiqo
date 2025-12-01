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
import { Calendar, Clock, Video, CheckCircle2, User, Mail, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Booking = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    platform: "",
    purpose: "",
    notes: "",
  });

  // Generate dates for the next 14 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip Sundays
      if (date.getDay() !== 0) {
        dates.push(date);
      }
    }
    return dates;
  };

  const dates = generateDates();

  const timeSlots = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = selectedDate !== null && selectedTime && formData.name && formData.email && formData.platform && formData.purpose;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Booking Confirmed! ✓",
      description: `Your call is scheduled for ${formatFullDate(dates[selectedDate!])} at ${selectedTime}. Check your email for the calendar invite.`,
    });

    // Reset form
    setSelectedDate(null);
    setSelectedTime(null);
    setFormData({
      name: "",
      email: "",
      platform: "",
      purpose: "",
      notes: "",
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4 text-center">
          <Video className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Book a Call
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Schedule a free 30-minute consultation call to discuss your project, ask questions, or get expert advice.
          </p>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Calendar & Time Selection */}
              <div className="lg:col-span-2 space-y-6">
                {/* Date Selection */}
                <Card className="glass border-border/40">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <CardTitle>Select a Date</CardTitle>
                    </div>
                    <CardDescription>
                      Choose your preferred date for the call
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {dates.map((date, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSelectedDate(index)}
                          className={`p-3 rounded-xl text-center transition-all duration-300 ${
                            selectedDate === index
                              ? "gradient-primary text-primary-foreground glow"
                              : "bg-muted/50 hover:bg-muted text-foreground"
                          }`}
                        >
                          <div className="text-xs opacity-70">
                            {date.toLocaleDateString("en-US", { weekday: "short" })}
                          </div>
                          <div className="text-lg font-semibold">
                            {date.getDate()}
                          </div>
                          <div className="text-xs opacity-70">
                            {date.toLocaleDateString("en-US", { month: "short" })}
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Time Selection */}
                <Card className="glass border-border/40">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <CardTitle>Select a Time</CardTitle>
                    </div>
                    <CardDescription>
                      All times are in Indian Standard Time (IST)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`p-3 rounded-xl text-center transition-all duration-300 ${
                            selectedTime === time
                              ? "gradient-primary text-primary-foreground glow"
                              : "bg-muted/50 hover:bg-muted text-foreground"
                          }`}
                        >
                          <div className="text-sm font-medium">{time}</div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Form */}
                <Card className="glass border-border/40">
                  <CardHeader>
                    <CardTitle>Your Details</CardTitle>
                    <CardDescription>
                      Fill in your information to complete the booking
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            placeholder="John Doe"
                            className="pl-10 bg-muted/50 border-border/40"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            className="pl-10 bg-muted/50 border-border/40"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="platform">Preferred Platform *</Label>
                      <Select value={formData.platform} onValueChange={(value) => handleSelectChange("platform", value)}>
                        <SelectTrigger className="bg-muted/50 border-border/40">
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent className="glass border-border/40">
                          <SelectItem value="zoom">Zoom</SelectItem>
                          <SelectItem value="meet">Google Meet</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp Video</SelectItem>
                          <SelectItem value="teams">Microsoft Teams</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="purpose">Meeting Purpose *</Label>
                      <Select value={formData.purpose} onValueChange={(value) => handleSelectChange("purpose", value)}>
                        <SelectTrigger className="bg-muted/50 border-border/40">
                          <SelectValue placeholder="What would you like to discuss?" />
                        </SelectTrigger>
                        <SelectContent className="glass border-border/40">
                          <SelectItem value="new-project">New Project Discussion</SelectItem>
                          <SelectItem value="quote">Get a Quote</SelectItem>
                          <SelectItem value="troubleshooting">Troubleshooting Help</SelectItem>
                          <SelectItem value="consultation">General Consultation</SelectItem>
                          <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any specific topics you'd like to cover..."
                        className="bg-muted/50 border-border/40"
                        value={formData.notes}
                        onChange={handleInputChange}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Booking Summary */}
              <div className="space-y-6">
                <Card className="glass border-primary glow sticky top-24">
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                    <CardDescription>
                      Review your booking details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                        <span className="text-foreground/70">Date</span>
                        <span className="font-medium">
                          {selectedDate !== null
                            ? formatDate(dates[selectedDate])
                            : "Not selected"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                        <span className="text-foreground/70">Time</span>
                        <span className="font-medium">
                          {selectedTime || "Not selected"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                        <span className="text-foreground/70">Duration</span>
                        <span className="font-medium">30 minutes</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                        <span className="text-foreground/70">Platform</span>
                        <span className="font-medium capitalize">
                          {formData.platform || "Not selected"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                        <span className="text-foreground/70">Purpose</span>
                        <span className="font-medium capitalize text-right max-w-[150px] truncate">
                          {formData.purpose?.replace("-", " ") || "Not selected"}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/40">
                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-2 text-xs text-foreground/70">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>Free consultation call</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-foreground/70">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>Calendar invite will be sent to your email</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-foreground/70">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>Easy reschedule up to 2 hours before</span>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full gradient-primary"
                        size="lg"
                        disabled={!isFormValid || isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Confirming...
                          </>
                        ) : (
                          "Confirm Booking"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-border/40">
                  <CardContent className="p-4">
                    <p className="text-sm text-foreground/70 text-center">
                      Need to talk sooner? Chat with us using the widget in the bottom-right corner or email us at{" "}
                      <a href="mailto:hello@dubiqo.com" className="text-primary hover:underline">hello@dubiqo.com</a>
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Booking;
