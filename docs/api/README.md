# API Documentation

## Edge Functions

### Quote Creation

- **Endpoint:** `/functions/v1/quote-create`
- **Method:** POST
- **Description:** Creates a new quote request

### Booking Creation

- **Endpoint:** `/functions/v1/bookings-create`
- **Method:** POST
- **Description:** Creates a new booking

### Ticket Creation

- **Endpoint:** `/functions/v1/ticket-create`
- **Method:** POST
- **Description:** Creates a support ticket

### Ticket Reply

- **Endpoint:** `/functions/v1/ticket-reply`
- **Method:** POST
- **Description:** Adds a reply to a support ticket

### Stripe Webhooks

- **Endpoint:** `/functions/v1/webhooks-stripe`
- **Method:** POST
- **Description:** Handles Stripe webhook events

### AI Insights

- **Endpoint:** `/functions/v1/ai-insights`
- **Method:** POST
- **Description:** Generates AI-powered analytics insights

### Presign Upload

- **Endpoint:** `/functions/v1/presign-upload`
- **Method:** POST
- **Description:** Generates presigned URL for file uploads

## Database API

All database operations go through Supabase client with RLS policies.

See [Database Schema](../database/schema.md) for table structures.
