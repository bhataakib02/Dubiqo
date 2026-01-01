import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Clock, Video, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays, isBefore, startOfDay } from "date-fns";

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00",
];

const meetingTypes = [
  {
    id: "discovery",
    title: "Discovery Call",
    duration: 30,
    description: "Learn about our services and discuss your needs",
  },
  {
    id: "consultation",
    title: "Project Consultation",
    duration: 60,
    description: "In-depth discussion about your project requirements",
  },
  {
    id: "demo",
    title: "Product Demo",
    duration: 45,
    description: "See our work and capabilities in action",
  },
];

export default function Booking() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [meetingType, setMeetingType] = useState("discovery");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time");
      return;
    }

    setIsSubmitting(true);

    try {
      const meeting = meetingTypes.find((m) => m.id === meetingType);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const scheduledAt = new Date(selectedDate);
      scheduledAt.setHours(hours, minutes, 0, 0);

      // Get current user if logged in
      const { data: { user } } = await supabase.auth.getUser();

      const bookingData = {
        booking_type: meeting?.title || meetingType,
        scheduled_at: scheduledAt.toISOString(),
        duration_minutes: meeting?.duration || 30,
        status: 'pending',
        notes: null, // Internal notes for admin/staff only
        client_id: user?.id || null,
        metadata: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          company: formData.company,
          clientNotes: formData.notes || null, // Client's notes from booking form
        },
      };

      const { error } = await supabase
        .from('bookings')
        .insert(bookingData);

      if (error) throw error;

      toast.success("Booking confirmed! Check your email for details.");
      setStep(4);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabledDays = (date: Date) => {
    const day = date.getDay();
    const today = startOfDay(new Date());
    return day === 0 || day === 6 || isBefore(date, today);
  };

  const meeting = meetingTypes.find((m) => m.id === meetingType);

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Book a <span className="gradient-text">Consultation</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Schedule a free call to discuss your project and how we can help.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Flow */}
      <Section>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4 mb-12">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
                      step >= s
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={cn(
                        "w-16 h-1 rounded",
                        step > s ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>

            {step === 4 ? (
              /* Confirmation */
              <Card className="bg-card/50 backdrop-blur border-border/50 text-center">
                <CardContent className="py-12">
                  <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-success" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Booking Confirmed!</h2>
                  <p className="text-muted-foreground mb-6">
                    You'll receive a confirmation email with the meeting details shortly.
                  </p>
                  <div className="bg-muted/30 rounded-lg p-6 max-w-sm mx-auto mb-8">
                    <div className="flex items-center gap-3 mb-3">
                      <Video className="w-5 h-5 text-primary" />
                      <span className="font-medium">{meeting?.title}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <CalendarDays className="w-5 h-5 text-primary" />
                      <span>
                        {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <span>{selectedTime} IST</span>
                    </div>
                  </div>
                  <Button onClick={() => { setStep(1); setSelectedDate(undefined); setSelectedTime(""); setFormData({ firstName: "", lastName: "", email: "", company: "", notes: "" }); }}>
                    Book Another Call
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left: Selection */}
                <div>
                  {step === 1 && (
                    <Card className="bg-card/50 backdrop-blur border-border/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Video className="w-5 h-5 text-primary" />
                          Select Meeting Type
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <RadioGroup
                          value={meetingType}
                          onValueChange={setMeetingType}
                          className="space-y-3"
                        >
                          {meetingTypes.map((type) => (
                            <div key={type.id} className="relative">
                              <RadioGroupItem
                                value={type.id}
                                id={type.id}
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor={type.id}
                                className="flex flex-col p-4 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium">{type.title}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {type.duration} min
                                  </span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {type.description}
                                </span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        <Button
                          className="w-full mt-6"
                          onClick={() => setStep(2)}
                        >
                          Continue
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {step === 2 && (
                    <Card className="bg-card/50 backdrop-blur border-border/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CalendarDays className="w-5 h-5 text-primary" />
                          Select Date & Time
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={disabledDays}
                          fromDate={new Date()}
                          toDate={addDays(new Date(), 60)}
                          className="rounded-md border border-border/50 mx-auto"
                        />

                        {selectedDate && (
                          <div>
                            <Label className="mb-3 block">Available Times (IST)</Label>
                            <div className="grid grid-cols-3 gap-2">
                              {timeSlots.map((time) => (
                                <Button
                                  key={time}
                                  variant={selectedTime === time ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setSelectedTime(time)}
                                  className={cn(
                                    selectedTime === time && "glow-primary"
                                  )}
                                >
                                  {time}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-3">
                          <Button variant="outline" onClick={() => setStep(1)}>
                            Back
                          </Button>
                          <Button
                            className="flex-1"
                            onClick={() => setStep(3)}
                            disabled={!selectedDate || !selectedTime}
                          >
                            Continue
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {step === 3 && (
                    <Card className="bg-card/50 backdrop-blur border-border/50">
                      <CardHeader>
                        <CardTitle>Your Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">First Name</Label>
                              <Input 
                                id="firstName" 
                                required 
                                placeholder="John"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input 
                                id="lastName" 
                                required 
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              required
                              placeholder="john@example.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="company">Company (Optional)</Label>
                            <Input 
                              id="company" 
                              placeholder="Your Company"
                              value={formData.company}
                              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="notes">Additional Notes</Label>
                            <Textarea
                              id="notes"
                              placeholder="Anything you'd like us to know before the call..."
                              rows={3}
                              value={formData.notes}
                              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                          </div>
                          <div className="flex gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setStep(2)}
                            >
                              Back
                            </Button>
                            <Button
                              type="submit"
                              className="flex-1 glow-primary"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Booking...
                                </>
                              ) : (
                                "Confirm Booking"
                              )}
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Right: Summary */}
                <div>
                  <Card className="bg-card/50 backdrop-blur border-border/50 sticky top-24">
                    <CardHeader>
                      <CardTitle>Booking Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Video className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">{meeting?.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {meeting?.duration} min
                          </div>
                        </div>
                      </div>

                      {selectedDate && (
                        <div className="flex items-center gap-3">
                          <CalendarDays className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-medium">
                              {format(selectedDate, "EEEE, MMMM d, yyyy")}
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedTime && (
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-medium">{selectedTime} IST</div>
                          </div>
                        </div>
                      )}

                      <div className="border-t border-border pt-4 mt-4">
                        <p className="text-sm text-muted-foreground">
                          You'll receive a Google Meet link via email after booking.
                          Free to reschedule or cancel up to 24 hours before.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>
    </Layout>
  );
}