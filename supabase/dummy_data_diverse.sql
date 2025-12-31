-- ============================================================================
-- DIVERSE DUMMY DATA - 5 Clients + 5 Staff (Unique Data for Each)
-- ============================================================================
-- This creates unique and varied test data for each client and staff member
-- Each client and staff will have different projects, tickets, invoices, etc.
-- Run this AFTER users are created in Supabase Dashboard
-- ============================================================================

-- ============================================================================
-- STEP 1: Update Client Profiles with Diverse Information
-- ============================================================================

-- Client 1: Tech Startup
UPDATE public.profiles
SET 
  full_name = 'James Anderson',
  company_name = 'InnovateTech Solutions',
  phone = '+1-555-2001',
  client_code = 'Client01'
WHERE email = 'client1@example.com';

-- Client 2: Retail Business
UPDATE public.profiles
SET 
  full_name = 'Maria Rodriguez',
  company_name = 'Urban Fashion Retail',
  phone = '+1-555-2002',
  client_code = 'Client02'
WHERE email = 'client2@example.com';

-- Client 3: Healthcare Provider
UPDATE public.profiles
SET 
  full_name = 'Dr. Robert Chen',
  company_name = 'MedCare Wellness Center',
  phone = '+1-555-2003',
  client_code = 'Client03'
WHERE email = 'client3@example.com';

-- Client 4: Restaurant Chain
UPDATE public.profiles
SET 
  full_name = 'Sophie Laurent',
  company_name = 'Bistro Paris Restaurants',
  phone = '+1-555-2004',
  client_code = 'Client04'
WHERE email = 'client4@example.com';

-- Client 5: Real Estate Agency
UPDATE public.profiles
SET 
  full_name = 'Michael Thompson',
  company_name = 'Premier Properties Group',
  phone = '+1-555-2005',
  client_code = 'Client05'
WHERE email = 'client5@example.com';

-- ============================================================================
-- STEP 2: Update Staff Profiles with Diverse Information
-- ============================================================================

-- Staff 1: Lead Developer
UPDATE public.profiles
SET 
  full_name = 'Alexandra Park',
  phone = '+1-555-3001'
WHERE email = 'staff1@example.com';

-- Staff 2: Marketing Specialist
UPDATE public.profiles
SET 
  full_name = 'David Kim',
  phone = '+1-555-3002'
WHERE email = 'staff2@example.com';

-- Staff 3: UI/UX Designer
UPDATE public.profiles
SET 
  full_name = 'Emma Watson',
  phone = '+1-555-3003'
WHERE email = 'staff3@example.com';

-- Staff 4: Project Manager
UPDATE public.profiles
SET 
  full_name = 'James Mitchell',
  phone = '+1-555-3004'
WHERE email = 'staff4@example.com';

-- Staff 5: Customer Support Lead
UPDATE public.profiles
SET 
  full_name = 'Olivia Brown',
  phone = '+1-555-3005'
WHERE email = 'staff5@example.com';

-- ============================================================================
-- STEP 3: Create Diverse Projects for Each Client
-- ============================================================================

-- Delete existing projects first (if any)
DELETE FROM public.projects WHERE client_id IN (
  SELECT id FROM public.profiles WHERE email LIKE 'client%@example.com'
);

-- Client 1: Multiple Tech Projects
INSERT INTO public.projects (client_id, title, description, project_type, status, start_date, end_date, budget, metadata)
SELECT 
  (SELECT id FROM public.profiles WHERE email = 'client1@example.com'),
  'Cloud Infrastructure Migration',
  'Migrating entire infrastructure to AWS cloud platform with zero downtime.',
  'automation',
  'in_progress',
  CURRENT_DATE - INTERVAL '15 days',
  CURRENT_DATE + INTERVAL '45 days',
  85000.00,
  jsonb_build_object('priority', 'high', 'tags', ARRAY['cloud', 'migration', 'aws'])
UNION ALL
SELECT 
  (SELECT id FROM public.profiles WHERE email = 'client1@example.com'),
  'Mobile App for Customer Portal',
  'Native iOS and Android app for customer self-service portal.',
  'mobile_app',
  'discovery',
  CURRENT_DATE + INTERVAL '5 days',
  CURRENT_DATE + INTERVAL '90 days',
  65000.00,
  jsonb_build_object('priority', 'medium', 'tags', ARRAY['mobile', 'ios', 'android']);

-- Client 2: Marketing and E-commerce Projects
INSERT INTO public.projects (client_id, title, description, project_type, status, start_date, end_date, budget, metadata)
SELECT 
  (SELECT id FROM public.profiles WHERE email = 'client2@example.com'),
  'E-commerce Website Redesign',
  'Complete redesign of online store with modern checkout and payment integration.',
  'website',
  'review',
  CURRENT_DATE - INTERVAL '30 days',
  CURRENT_DATE + INTERVAL '20 days',
  45000.00,
  jsonb_build_object('priority', 'high', 'tags', ARRAY['ecommerce', 'design', 'payment'])
UNION ALL
SELECT 
  (SELECT id FROM public.profiles WHERE email = 'client2@example.com'),
  'Social Media Marketing Campaign',
  '6-month social media strategy and content creation across all platforms.',
  'marketing',
  'in_progress',
  CURRENT_DATE - INTERVAL '10 days',
  CURRENT_DATE + INTERVAL '170 days',
  32000.00,
  jsonb_build_object('priority', 'medium', 'tags', ARRAY['social media', 'content', 'ads']);

-- Client 3: Healthcare Digital Transformation
INSERT INTO public.projects (client_id, title, description, project_type, status, start_date, end_date, budget, metadata)
SELECT 
  (SELECT id FROM public.profiles WHERE email = 'client3@example.com'),
  'Patient Portal System',
  'HIPAA-compliant patient portal with appointment scheduling and medical records access.',
  'website',
  'completed',
  CURRENT_DATE - INTERVAL '120 days',
  CURRENT_DATE - INTERVAL '20 days',
  125000.00,
  jsonb_build_object('priority', 'high', 'tags', ARRAY['healthcare', 'hipaa', 'portal', 'compliant'])
UNION ALL
SELECT 
  (SELECT id FROM public.profiles WHERE email = 'client3@example.com'),
  'Telemedicine Platform',
  'Video consultation platform integrated with existing patient management system.',
  'website',
  'in_progress',
  CURRENT_DATE - INTERVAL '45 days',
  CURRENT_DATE + INTERVAL '60 days',
  95000.00,
  jsonb_build_object('priority', 'critical', 'tags', ARRAY['telemedicine', 'video', 'healthcare']);

-- Client 4: Restaurant Digital Presence
INSERT INTO public.projects (client_id, title, description, project_type, status, start_date, end_date, budget, metadata)
SELECT 
  (SELECT id FROM public.profiles WHERE email = 'client4@example.com'),
  'Restaurant Website with Online Ordering',
  'Beautiful website with integrated online ordering and delivery tracking system.',
  'website',
  'in_progress',
  CURRENT_DATE - INTERVAL '20 days',
  CURRENT_DATE + INTERVAL '40 days',
  28000.00,
  jsonb_build_object('priority', 'medium', 'tags', ARRAY['restaurant', 'ordering', 'delivery'])
UNION ALL
SELECT 
  (SELECT id FROM public.profiles WHERE email = 'client4@example.com'),
  'Brand Identity Refresh',
  'Complete rebranding including logo, menu design, and marketing materials.',
  'design',
  'discovery',
  CURRENT_DATE + INTERVAL '10 days',
  CURRENT_DATE + INTERVAL '75 days',
  18000.00,
  jsonb_build_object('priority', 'low', 'tags', ARRAY['branding', 'design', 'print']);

-- Client 5: Real Estate Technology Platform
INSERT INTO public.projects (client_id, title, description, project_type, status, start_date, end_date, budget, metadata)
SELECT 
  (SELECT id FROM public.profiles WHERE email = 'client5@example.com'),
  'Property Listing Platform',
  'Advanced property search platform with virtual tours and mortgage calculator.',
  'website',
  'review',
  CURRENT_DATE - INTERVAL '60 days',
  CURRENT_DATE + INTERVAL '30 days',
  75000.00,
  jsonb_build_object('priority', 'high', 'tags', ARRAY['real estate', 'search', 'virtual tours'])
UNION ALL
SELECT 
  (SELECT id FROM public.profiles WHERE email = 'client5@example.com'),
  'CRM System for Agents',
  'Custom CRM system for managing leads, properties, and client communications.',
  'automation',
  'in_progress',
  CURRENT_DATE - INTERVAL '25 days',
  CURRENT_DATE + INTERVAL '65 days',
  55000.00,
  jsonb_build_object('priority', 'high', 'tags', ARRAY['crm', 'automation', 'real estate']);

-- ============================================================================
-- STEP 4: Create Diverse Quotes for Each Client
-- ============================================================================

DELETE FROM public.quotes WHERE client_id IN (
  SELECT id FROM public.profiles WHERE email LIKE 'client%@example.com'
);

-- Client 1 Quotes
INSERT INTO public.quotes (client_id, service_type, project_details, estimated_cost, status, valid_until, metadata)
VALUES
  ((SELECT id FROM public.profiles WHERE email = 'client1@example.com'),
   'automation',
   jsonb_build_object(
     'name', 'James Anderson',
     'email', 'client1@example.com',
     'features', ARRAY['AWS Migration', 'CI/CD Pipeline', 'Auto-scaling', 'Monitoring'],
     'timeline', '2 months',
     'details', 'Complete cloud migration with DevOps automation'
   ),
   85000.00,
   'accepted',
   CURRENT_DATE + INTERVAL '45 days',
   jsonb_build_object('source', 'referral', 'referral', true));

-- Client 2 Quotes
INSERT INTO public.quotes (client_id, service_type, project_details, estimated_cost, status, valid_until, metadata)
VALUES
  ((SELECT id FROM public.profiles WHERE email = 'client2@example.com'),
   'website',
   jsonb_build_object(
     'name', 'Maria Rodriguez',
     'email', 'client2@example.com',
     'features', ARRAY['Responsive Design', 'Payment Gateway', 'Inventory Management', 'Admin Dashboard'],
     'pages', 25,
     'timeline', '3 months',
     'details', 'Full e-commerce solution with modern design'
   ),
   45000.00,
   'pending',
   CURRENT_DATE + INTERVAL '30 days',
   jsonb_build_object('source', 'website', 'referral', false));

-- Client 3 Quotes
INSERT INTO public.quotes (client_id, service_type, project_details, estimated_cost, status, valid_until, metadata)
VALUES
  ((SELECT id FROM public.profiles WHERE email = 'client3@example.com'),
   'website',
   jsonb_build_object(
     'name', 'Dr. Robert Chen',
     'email', 'client3@example.com',
     'features', ARRAY['HIPAA Compliance', 'Appointment Booking', 'Patient Records', 'Secure Messaging'],
     'timeline', '4 months',
     'details', 'Healthcare-compliant patient portal system'
   ),
   125000.00,
   'accepted',
   CURRENT_DATE + INTERVAL '60 days',
   jsonb_build_object('source', 'referral', 'referral', true));

-- Client 4 Quotes
INSERT INTO public.quotes (client_id, service_type, project_details, estimated_cost, status, valid_until, metadata)
VALUES
  ((SELECT id FROM public.profiles WHERE email = 'client4@example.com'),
   'website',
   jsonb_build_object(
     'name', 'Sophie Laurent',
     'email', 'client4@example.com',
     'features', ARRAY['Online Ordering', 'Delivery Tracking', 'Menu Management', 'Customer Accounts'],
     'pages', 12,
     'timeline', '2 months',
     'details', 'Restaurant website with online ordering system'
   ),
   28000.00,
   'pending',
   CURRENT_DATE + INTERVAL '20 days',
   jsonb_build_object('source', 'website', 'referral', false));

-- Client 5 Quotes
INSERT INTO public.quotes (client_id, service_type, project_details, estimated_cost, status, valid_until, metadata)
VALUES
  ((SELECT id FROM public.profiles WHERE email = 'client5@example.com'),
   'website',
   jsonb_build_object(
     'name', 'Michael Thompson',
     'email', 'client5@example.com',
     'features', ARRAY['Property Search', 'Virtual Tours', 'Mortgage Calculator', 'Agent CRM'],
     'pages', 30,
     'timeline', '4 months',
     'details', 'Comprehensive real estate platform'
   ),
   75000.00,
   'rejected',
   CURRENT_DATE - INTERVAL '10 days',
   jsonb_build_object('source', 'referral', 'referral', true));

-- ============================================================================
-- STEP 5: Create Diverse Invoices for Each Client
-- ============================================================================

DELETE FROM public.invoices WHERE client_id IN (
  SELECT id FROM public.profiles WHERE email LIKE 'client%@example.com'
);

-- Client 1 Invoices
INSERT INTO public.invoices (client_id, project_id, invoice_number, items, subtotal, tax, total_amount, status, due_date)
SELECT 
  (SELECT id FROM public.profiles WHERE email = 'client1@example.com'),
  (SELECT id FROM public.projects WHERE client_id = (SELECT id FROM public.profiles WHERE email = 'client1@example.com') LIMIT 1),
  'INV-2025-001',
  jsonb_build_array(
    jsonb_build_object('description', 'Cloud Migration - Phase 1', 'quantity', 1, 'unit_price', 42500.00),
    jsonb_build_object('description', 'DevOps Setup', 'quantity', 1, 'unit_price', 12750.00)
  ),
  55250.00,
  8840.00,
  64090.00,
  'paid',
  CURRENT_DATE - INTERVAL '5 days';

-- Client 2 Invoices
INSERT INTO public.invoices (client_id, project_id, invoice_number, items, subtotal, tax, total_amount, status, due_date)
SELECT 
  (SELECT id FROM public.profiles WHERE email = 'client2@example.com'),
  (SELECT id FROM public.projects WHERE client_id = (SELECT id FROM public.profiles WHERE email = 'client2@example.com') LIMIT 1),
  'INV-2025-002',
  jsonb_build_array(
    jsonb_build_object('description', 'Website Design & Development', 'quantity', 1, 'unit_price', 36000.00),
    jsonb_build_object('description', 'Payment Gateway Integration', 'quantity', 1, 'unit_price', 3600.00)
  ),
  39600.00,
  6336.00,
  45936.00,
  'pending',
  CURRENT_DATE + INTERVAL '25 days';

-- Client 3 Invoices
INSERT INTO public.invoices (client_id, project_id, invoice_number, items, subtotal, tax, total_amount, status, due_date)
SELECT 
  (SELECT id FROM public.profiles WHERE email = 'client3@example.com'),
  (SELECT id FROM public.projects WHERE client_id = (SELECT id FROM public.profiles WHERE email = 'client3@example.com') AND status = 'completed' LIMIT 1),
  'INV-2025-003',
  jsonb_build_array(
    jsonb_build_object('description', 'Patient Portal Development', 'quantity', 1, 'unit_price', 100000.00),
    jsonb_build_object('description', 'HIPAA Compliance Audit', 'quantity', 1, 'unit_price', 10000.00)
  ),
  110000.00,
  17600.00,
  127600.00,
  'paid',
  CURRENT_DATE - INTERVAL '15 days';

-- Client 4 Invoices
INSERT INTO public.invoices (client_id, project_id, invoice_number, items, subtotal, tax, total_amount, status, due_date)
SELECT 
  (SELECT id FROM public.profiles WHERE email = 'client4@example.com'),
  (SELECT id FROM public.projects WHERE client_id = (SELECT id FROM public.profiles WHERE email = 'client4@example.com') LIMIT 1),
  'INV-2025-004',
  jsonb_build_array(
    jsonb_build_object('description', 'Website Development - 50% Progress', 'quantity', 1, 'unit_price', 11200.00),
    jsonb_build_object('description', 'Online Ordering System', 'quantity', 1, 'unit_price', 2800.00)
  ),
  14000.00,
  2240.00,
  16240.00,
  'sent',
  CURRENT_DATE + INTERVAL '15 days';

-- Client 5 Invoices
INSERT INTO public.invoices (client_id, project_id, invoice_number, items, subtotal, tax, total_amount, status, due_date)
SELECT 
  (SELECT id FROM public.profiles WHERE email = 'client5@example.com'),
  (SELECT id FROM public.projects WHERE client_id = (SELECT id FROM public.profiles WHERE email = 'client5@example.com') LIMIT 1),
  'INV-2025-005',
  jsonb_build_array(
    jsonb_build_object('description', 'Property Platform - Phase 1', 'quantity', 1, 'unit_price', 37500.00),
    jsonb_build_object('description', 'Virtual Tour Integration', 'quantity', 1, 'unit_price', 7500.00)
  ),
  45000.00,
  7200.00,
  52200.00,
  'overdue',
  CURRENT_DATE - INTERVAL '10 days';

-- ============================================================================
-- STEP 6: Create Diverse Payments
-- ============================================================================

DELETE FROM public.payments WHERE invoice_id IN (
  SELECT id FROM public.invoices WHERE client_id IN (
    SELECT id FROM public.profiles WHERE email LIKE 'client%@example.com'
  )
);

-- Payments for paid invoices
INSERT INTO public.payments (invoice_id, amount, currency, status, payment_method, stripe_payment_intent_id)
SELECT 
  i.id,
  i.total_amount,
  'USD',
  'completed',
  CASE 
    WHEN i.invoice_number = 'INV-2025-001' THEN 'bank_transfer'
    WHEN i.invoice_number = 'INV-2025-003' THEN 'credit_card'
    ELSE 'credit_card'
  END,
  'pi_test_' || gen_random_uuid()::text
FROM public.invoices i
WHERE i.status = 'paid';

-- ============================================================================
-- STEP 7: Create Diverse Tickets (Each Assigned to Different Staff)
-- ============================================================================

DELETE FROM public.tickets WHERE client_id IN (
  SELECT id FROM public.profiles WHERE email LIKE 'client%@example.com'
);

-- Client 1 Ticket - Assigned to Staff 1 (Alexandra)
INSERT INTO public.tickets (client_id, project_id, title, description, status, priority, category, assigned_to, metadata)
SELECT 
  (SELECT id FROM public.profiles WHERE email = 'client1@example.com'),
  (SELECT id FROM public.projects WHERE client_id = (SELECT id FROM public.profiles WHERE email = 'client1@example.com') LIMIT 1),
  'Cloud Migration: Database Connection Issues',
  'We are experiencing intermittent database connection failures during the migration process. The errors occur during peak hours. Need immediate investigation.',
  'in_progress',
  'high',
  'technical',
  (SELECT id FROM public.profiles WHERE email = 'staff1@example.com'),
  jsonb_build_object('source', 'email', 'tags', ARRAY['migration', 'database', 'urgent']);

-- Client 2 Ticket - Assigned to Staff 2 (David)
INSERT INTO public.tickets (client_id, project_id, title, description, status, priority, category, assigned_to, metadata)
SELECT 
  (SELECT id FROM public.profiles WHERE email = 'client2@example.com'),
  (SELECT id FROM public.projects WHERE client_id = (SELECT id FROM public.profiles WHERE email = 'client2@example.com') AND project_type = 'marketing' LIMIT 1),
  'Social Media Content Approval Needed',
  'We have prepared 20 social media posts for the next month. Can you review and approve them before we schedule them?',
  'open',
  'medium',
  'design',
  (SELECT id FROM public.profiles WHERE email = 'staff2@example.com'),
  jsonb_build_object('source', 'portal', 'tags', ARRAY['content', 'approval', 'marketing']);

-- Client 3 Ticket - Assigned to Staff 3 (Emma)
INSERT INTO public.tickets (client_id, project_id, title, description, status, priority, category, assigned_to, metadata)
SELECT 
  (SELECT id FROM public.profiles WHERE email = 'client3@example.com'),
  (SELECT id FROM public.projects WHERE client_id = (SELECT id FROM public.profiles WHERE email = 'client3@example.com') LIMIT 1),
  'Patient Portal UI/UX Improvements Request',
  'Several patients have provided feedback about the appointment booking interface. They find it confusing. Can we simplify the design?',
  'pending',
  'medium',
  'design',
  (SELECT id FROM public.profiles WHERE email = 'staff3@example.com'),
  jsonb_build_object('source', 'feedback', 'tags', ARRAY['ui', 'ux', 'patient portal']);

-- Client 4 Ticket - Assigned to Staff 4 (James)
INSERT INTO public.tickets (client_id, project_id, title, description, status, priority, category, assigned_to, metadata)
SELECT 
  (SELECT id FROM public.profiles WHERE email = 'client4@example.com'),
  (SELECT id FROM public.projects WHERE client_id = (SELECT id FROM public.profiles WHERE email = 'client4@example.com') LIMIT 1),
  'Project Timeline Update Request',
  'We need to launch the website before our grand opening event. Can we move the deadline up by 2 weeks?',
  'open',
  'high',
  'general',
  (SELECT id FROM public.profiles WHERE email = 'staff4@example.com'),
  jsonb_build_object('source', 'phone', 'tags', ARRAY['timeline', 'deadline', 'urgent']);

-- Client 5 Ticket - Assigned to Staff 5 (Olivia)
INSERT INTO public.tickets (client_id, project_id, title, description, status, priority, category, assigned_to, metadata)
SELECT 
  (SELECT id FROM public.profiles WHERE email = 'client5@example.com'),
  (SELECT id FROM public.projects WHERE client_id = (SELECT id FROM public.profiles WHERE email = 'client5@example.com') LIMIT 1),
  'Billing Question: Invoice INV-2025-005',
  'I received invoice INV-2025-005 but I believe there is a discrepancy in the charges. Can someone review this with me?',
  'resolved',
  'low',
  'billing',
  (SELECT id FROM public.profiles WHERE email = 'staff5@example.com'),
  jsonb_build_object('source', 'email', 'tags', ARRAY['billing', 'invoice', 'clarification']);

-- Additional tickets for variety
-- Client 1 - Second ticket assigned to Staff 2
INSERT INTO public.tickets (client_id, project_id, title, description, status, priority, category, assigned_to, metadata)
SELECT 
  (SELECT id FROM public.profiles WHERE email = 'client1@example.com'),
  NULL,
  'Feature Request: Mobile App Push Notifications',
  'Can we add push notification support to the mobile app? This is important for user engagement.',
  'pending',
  'medium',
  'general',
  (SELECT id FROM public.profiles WHERE email = 'staff2@example.com'),
  jsonb_build_object('source', 'portal', 'tags', ARRAY['feature', 'mobile', 'notifications']);

-- Client 3 - Second ticket assigned to Staff 1
INSERT INTO public.tickets (client_id, project_id, title, description, status, priority, category, assigned_to, metadata)
SELECT 
  (SELECT id FROM public.profiles WHERE email = 'client3@example.com'),
  (SELECT id FROM public.projects WHERE client_id = (SELECT id FROM public.profiles WHERE email = 'client3@example.com') AND status = 'in_progress' LIMIT 1),
  'Telemedicine Platform: Video Quality Issues',
  'During telemedicine consultations, video quality degrades after 10 minutes. This is affecting patient experience.',
  'in_progress',
  'high',
  'technical',
  (SELECT id FROM public.profiles WHERE email = 'staff1@example.com'),
  jsonb_build_object('source', 'portal', 'tags', ARRAY['video', 'quality', 'telemedicine', 'technical']);

-- ============================================================================
-- STEP 8: Create Diverse Ticket Messages
-- ============================================================================

DELETE FROM public.ticket_messages WHERE ticket_id IN (
  SELECT id FROM public.tickets WHERE client_id IN (
    SELECT id FROM public.profiles WHERE email LIKE 'client%@example.com'
  )
);

-- Messages for Client 1's first ticket (Technical)
INSERT INTO public.ticket_messages (ticket_id, user_id, message, is_internal, attachments)
SELECT 
  t.id,
  t.client_id,
  'We noticed these database connection issues starting yesterday. Here are the error logs we collected.',
  false,
  jsonb_build_array(jsonb_build_object('name', 'error_logs.txt', 'url', 'https://example.com/logs/error_logs.txt'))
FROM public.tickets t
WHERE t.title LIKE '%Database Connection%'
LIMIT 1;

INSERT INTO public.ticket_messages (ticket_id, user_id, message, is_internal, attachments)
SELECT 
  t.id,
  t.assigned_to,
  'Thank you for reporting this. I have identified the issue - it appears to be related to connection pooling during high traffic. I am implementing a fix and will update you once deployed.',
  true,
  jsonb_build_array()
FROM public.tickets t
WHERE t.title LIKE '%Database Connection%'
LIMIT 1;

-- Messages for Client 2's ticket (Marketing)
INSERT INTO public.ticket_messages (ticket_id, user_id, message, is_internal, attachments)
SELECT 
  t.id,
  t.client_id,
  'All 20 posts are ready for review in the shared folder. Looking forward to your feedback!',
  false,
  jsonb_build_array()
FROM public.tickets t
WHERE t.title LIKE '%Social Media Content%'
LIMIT 1;

-- Messages for Client 5's ticket (Billing - Resolved)
INSERT INTO public.ticket_messages (ticket_id, user_id, message, is_internal, attachments)
SELECT 
  t.id,
  t.client_id,
  'I reviewed invoice INV-2025-005 and noticed the virtual tour integration cost seems higher than what we discussed.',
  false,
  jsonb_build_array()
FROM public.tickets t
WHERE t.title LIKE '%Billing Question%'
LIMIT 1;

INSERT INTO public.ticket_messages (ticket_id, user_id, message, is_internal, attachments)
SELECT 
  t.id,
  t.assigned_to,
  'I have reviewed the invoice and you are correct. There was an error in the pricing calculation. I have issued a credit note for $1,500. The corrected invoice will be sent shortly. My apologies for the confusion.',
  false,
  jsonb_build_array()
FROM public.tickets t
WHERE t.title LIKE '%Billing Question%'
LIMIT 1;

-- ============================================================================
-- STEP 9: Create Diverse Bookings for Each Client
-- ============================================================================

DELETE FROM public.bookings WHERE client_id IN (
  SELECT id FROM public.profiles WHERE email LIKE 'client%@example.com'
);

-- Client 1: Technical Consultation
INSERT INTO public.bookings (client_id, booking_type, scheduled_at, duration_minutes, status, notes, metadata)
VALUES
  ((SELECT id FROM public.profiles WHERE email = 'client1@example.com'),
   'consultation',
   CURRENT_TIMESTAMP + INTERVAL '3 days' + INTERVAL '14 hours',
   90,
   'confirmed',
   'Discussion about cloud migration architecture and best practices for scaling.',
   jsonb_build_object('timezone', 'America/New_York', 'reminder_sent', true, 'meeting_type', 'video_call'));

-- Client 2: Review Meeting
INSERT INTO public.bookings (client_id, booking_type, scheduled_at, duration_minutes, status, notes, metadata)
VALUES
  ((SELECT id FROM public.profiles WHERE email = 'client2@example.com'),
   'review',
   CURRENT_TIMESTAMP + INTERVAL '5 days' + INTERVAL '10 hours',
   60,
   'confirmed',
   'Review of website design mockups and discuss color scheme preferences.',
   jsonb_build_object('timezone', 'America/New_York', 'reminder_sent', false, 'meeting_type', 'in_person'));

-- Client 3: Support Session
INSERT INTO public.bookings (client_id, booking_type, scheduled_at, duration_minutes, status, notes, metadata)
VALUES
  ((SELECT id FROM public.profiles WHERE email = 'client3@example.com'),
   'support',
   CURRENT_TIMESTAMP + INTERVAL '2 days' + INTERVAL '16 hours',
   45,
   'pending',
   'Training session on patient portal features for new staff members.',
   jsonb_build_object('timezone', 'America/New_York', 'reminder_sent', false, 'meeting_type', 'video_call'));

-- Client 4: Consultation
INSERT INTO public.bookings (client_id, booking_type, scheduled_at, duration_minutes, status, notes, metadata)
VALUES
  ((SELECT id FROM public.profiles WHERE email = 'client4@example.com'),
   'consultation',
   CURRENT_TIMESTAMP + INTERVAL '7 days' + INTERVAL '11 hours',
   60,
   'confirmed',
   'Discuss brand identity refresh and review initial logo concepts.',
   jsonb_build_object('timezone', 'America/New_York', 'reminder_sent', true, 'meeting_type', 'video_call'));

-- Client 5: Review Meeting (Cancelled)
INSERT INTO public.bookings (client_id, booking_type, scheduled_at, duration_minutes, status, notes, metadata)
VALUES
  ((SELECT id FROM public.profiles WHERE email = 'client5@example.com'),
   'review',
   CURRENT_TIMESTAMP + INTERVAL '4 days' + INTERVAL '9 hours',
   60,
   'cancelled',
   'CANCELLED: Need to reschedule due to client conflict.',
   jsonb_build_object('timezone', 'America/New_York', 'reminder_sent', false, 'meeting_type', 'video_call', 'cancelled_reason', 'client_request'));

-- ============================================================================
-- Verification: Show Summary of Created Data
-- ============================================================================

SELECT 
  '✅ DIVERSE DATA SUMMARY' as info,
  (SELECT COUNT(*) FROM public.profiles WHERE email LIKE 'client%@example.com') as clients_updated,
  (SELECT COUNT(*) FROM public.profiles WHERE email LIKE 'staff%@example.com') as staff_updated,
  (SELECT COUNT(*) FROM public.projects WHERE client_id IN (SELECT id FROM public.profiles WHERE email LIKE 'client%@example.com')) as projects_created,
  (SELECT COUNT(*) FROM public.quotes WHERE client_id IN (SELECT id FROM public.profiles WHERE email LIKE 'client%@example.com')) as quotes_created,
  (SELECT COUNT(*) FROM public.invoices WHERE client_id IN (SELECT id FROM public.profiles WHERE email LIKE 'client%@example.com')) as invoices_created,
  (SELECT COUNT(*) FROM public.payments) as payments_created,
  (SELECT COUNT(*) FROM public.tickets WHERE client_id IN (SELECT id FROM public.profiles WHERE email LIKE 'client%@example.com')) as tickets_created,
  (SELECT COUNT(*) FROM public.ticket_messages WHERE ticket_id IN (SELECT id FROM public.tickets WHERE client_id IN (SELECT id FROM public.profiles WHERE email LIKE 'client%@example.com'))) as ticket_messages_created,
  (SELECT COUNT(*) FROM public.bookings WHERE client_id IN (SELECT id FROM public.profiles WHERE email LIKE 'client%@example.com')) as bookings_created;

-- Show ticket assignments per staff
SELECT 
  'TICKET ASSIGNMENTS BY STAFF' as report_type,
  p.full_name as staff_name,
  p.email as staff_email,
  COUNT(t.id) as tickets_assigned,
  STRING_AGG(DISTINCT t.status, ', ') as ticket_statuses
FROM public.profiles p
LEFT JOIN public.tickets t ON t.assigned_to = p.id
WHERE p.email LIKE 'staff%@example.com'
GROUP BY p.id, p.full_name, p.email
ORDER BY p.email;

-- Show data per client
SELECT 
  'DATA PER CLIENT' as report_type,
  p.full_name as client_name,
  p.company_name,
  p.email as client_email,
  (SELECT COUNT(*) FROM public.projects WHERE client_id = p.id) as project_count,
  (SELECT COUNT(*) FROM public.quotes WHERE client_id = p.id) as quote_count,
  (SELECT COUNT(*) FROM public.invoices WHERE client_id = p.id) as invoice_count,
  (SELECT COUNT(*) FROM public.tickets WHERE client_id = p.id) as ticket_count,
  (SELECT COUNT(*) FROM public.bookings WHERE client_id = p.id) as booking_count
FROM public.profiles p
WHERE p.email LIKE 'client%@example.com'
ORDER BY p.email;

SELECT '✅ Diverse dummy data created successfully! Each client and staff member now has unique data.' as status;

