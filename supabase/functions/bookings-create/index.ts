import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BookingRequest {
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  service_type: string;
  booking_date: string;
  booking_time: string;
  timezone?: string;
  notes?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: BookingRequest = await req.json();
    console.log('Booking request:', body);

    // Validate booking date and time
    const bookingDateTime = new Date(`${body.booking_date}T${body.booking_time}`);
    if (isNaN(bookingDateTime.getTime())) {
      throw new Error('Invalid booking date or time');
    }

    // Check if booking is in the past
    if (bookingDateTime < new Date()) {
      throw new Error('Booking date cannot be in the past');
    }

    // Check for existing bookings at the same time (prevent double-booking)
    const { data: existingBookings, error: checkError } = await supabase
      .from('bookings')
      .select('id')
      .eq('booking_date', body.booking_date)
      .eq('booking_time', body.booking_time)
      .eq('status', 'confirmed')
      .limit(1);

    if (checkError) {
      console.error('Error checking existing bookings:', checkError);
      throw checkError;
    }

    if (existingBookings && existingBookings.length > 0) {
      return new Response(
        JSON.stringify({
          error: 'This time slot is already booked. Please choose another time.',
          available: false,
        }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: body.user_id || null,
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        service_type: body.service_type,
        booking_date: body.booking_date,
        booking_time: body.booking_time,
        timezone: body.timezone || 'UTC',
        status: 'pending',
        notes: body.notes || null,
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Error creating booking:', bookingError);
      throw bookingError;
    }

    console.log('Booking created:', booking);

    // Generate ICS file for calendar
    const icsContent = generateICS(booking, body);

    // TODO: Send confirmation email via SendGrid
    // TODO: Send notification to staff

    return new Response(
      JSON.stringify({
        success: true,
        booking,
        ics_content: icsContent,
        message:
          'Booking request submitted successfully. You will receive a confirmation email shortly.',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in bookings-create:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateICS(booking: any, request: BookingRequest): string {
  const startDate = new Date(`${request.booking_date}T${request.booking_time}`);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Dubiqo//Booking System//EN',
    'BEGIN:VEVENT',
    `UID:${booking.id}@dubiqo.com`,
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:${request.service_type} Consultation`,
    `DESCRIPTION:Booking with ${request.name}\\nService: ${request.service_type}\\n${request.notes || ''}`,
    `LOCATION:Online/Office`,
    `ORGANIZER;CN=Dubiqo Digital Solutions:mailto:info@dubiqo.com`,
    `ATTENDEE;CN=${request.name}:mailto:${request.email}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return ics;
}
