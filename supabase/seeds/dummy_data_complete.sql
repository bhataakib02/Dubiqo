-- ============================================================================
-- COMPLETE DUMMY DATA - 5 Clients + 5 Staff + Full Test Data
-- ============================================================================
-- This creates comprehensive test data for all pages and functions
-- Run this AFTER running COMPLETE_RESET.sql
-- ============================================================================

-- ============================================================================
-- STEP 1: Create Profiles and Assign Roles for Existing Users
-- ============================================================================
-- NOTE: Users must be created in Supabase Dashboard first:
-- Create these users in Authentication → Users:
-- Clients: client1@test.com through client5@test.com (Password: Test123!)
-- Staff: staff1@test.com through staff5@test.com (Password: Test123!)

-- Create client profiles
INSERT INTO public.profiles (id, email, full_name, company_name, phone, client_code)
SELECT 
  u.id,
  u.email,
  CASE 
    WHEN u.email = 'client1@test.com' THEN 'John Smith'
    WHEN u.email = 'client2@test.com' THEN 'Sarah Johnson'
    WHEN u.email = 'client3@test.com' THEN 'Michael Brown'
    WHEN u.email = 'client4@test.com' THEN 'Emily Davis'
    WHEN u.email = 'client5@test.com' THEN 'David Wilson'
    ELSE 'Client User'
  END as full_name,
  CASE 
    WHEN u.email = 'client1@test.com' THEN 'Tech Solutions Inc'
    WHEN u.email = 'client2@test.com' THEN 'Digital Marketing Pro'
    WHEN u.email = 'client3@test.com' THEN 'Creative Design Studio'
    WHEN u.email = 'client4@test.com' THEN 'Business Consulting Group'
    WHEN u.email = 'client5@test.com' THEN 'E-commerce Ventures'
    ELSE 'Client Company'
  END as company_name,
  CASE 
    WHEN u.email = 'client1@test.com' THEN '+1-555-0101'
    WHEN u.email = 'client2@test.com' THEN '+1-555-0102'
    WHEN u.email = 'client3@test.com' THEN '+1-555-0103'
    WHEN u.email = 'client4@test.com' THEN '+1-555-0104'
    WHEN u.email = 'client5@test.com' THEN '+1-555-0105'
    ELSE NULL
  END as phone,
  CASE 
    WHEN u.email = 'client1@test.com' THEN 'CLI001'
    WHEN u.email = 'client2@test.com' THEN 'CLI002'
    WHEN u.email = 'client3@test.com' THEN 'CLI003'
    WHEN u.email = 'client4@test.com' THEN 'CLI004'
    WHEN u.email = 'client5@test.com' THEN 'CLI005'
    ELSE NULL
  END as client_code
FROM auth.users u
WHERE u.email LIKE 'client%@test.com'
ON CONFLICT (id) DO UPDATE SET 
  email = EXCLUDED.email,
  full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
  company_name = COALESCE(EXCLUDED.company_name, profiles.company_name),
  phone = COALESCE(EXCLUDED.phone, profiles.phone),
  client_code = COALESCE(EXCLUDED.client_code, profiles.client_code);

-- Assign client roles
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'client'
FROM auth.users u
WHERE u.email LIKE 'client%@test.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = u.id AND ur.role = 'client'
  )
ON CONFLICT (user_id, role) DO NOTHING;

-- Create staff profiles
INSERT INTO public.profiles (id, email, full_name, company_name, phone)
SELECT 
  u.id,
  u.email,
  CASE 
    WHEN u.email = 'staff1@test.com' THEN 'Alex Thompson'
    WHEN u.email = 'staff2@test.com' THEN 'Jessica Martinez'
    WHEN u.email = 'staff3@test.com' THEN 'Ryan Anderson'
    WHEN u.email = 'staff4@test.com' THEN 'Lisa Chen'
    WHEN u.email = 'staff5@test.com' THEN 'Chris Taylor'
    ELSE 'Staff User'
  END as full_name,
  'Dubiqo' as company_name,
  CASE 
    WHEN u.email = 'staff1@test.com' THEN '+1-555-0201'
    WHEN u.email = 'staff2@test.com' THEN '+1-555-0202'
    WHEN u.email = 'staff3@test.com' THEN '+1-555-0203'
    WHEN u.email = 'staff4@test.com' THEN '+1-555-0204'
    WHEN u.email = 'staff5@test.com' THEN '+1-555-0205'
    ELSE NULL
  END as phone
FROM auth.users u
WHERE u.email LIKE 'staff%@test.com'
ON CONFLICT (id) DO UPDATE SET 
  email = EXCLUDED.email,
  full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
  company_name = COALESCE(EXCLUDED.company_name, profiles.company_name),
  phone = COALESCE(EXCLUDED.phone, profiles.phone);

-- Assign staff roles
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'staff'
FROM auth.users u
WHERE u.email LIKE 'staff%@test.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = u.id AND ur.role = 'staff'
  )
ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================================================
-- STEP 2: Create Dummy Projects
-- ============================================================================

INSERT INTO public.projects (client_id, title, description, project_type, status, start_date, end_date, budget, metadata)
SELECT 
  p.id,
  CASE 
    WHEN p.email = 'client1@test.com' THEN 'E-commerce Website Redesign'
    WHEN p.email = 'client2@test.com' THEN 'Social Media Marketing Campaign'
    WHEN p.email = 'client3@test.com' THEN 'Brand Identity Design'
    WHEN p.email = 'client4@test.com' THEN 'Business Process Automation'
    WHEN p.email = 'client5@test.com' THEN 'Mobile App Development'
    ELSE 'Sample Project'
  END as title,
  CASE 
    WHEN p.email = 'client1@test.com' THEN 'Complete redesign of e-commerce platform with modern UI/UX and improved checkout flow.'
    WHEN p.email = 'client2@test.com' THEN 'Comprehensive social media strategy and content creation for multiple platforms.'
    WHEN p.email = 'client3@test.com' THEN 'Full brand identity package including logo, color scheme, and brand guidelines.'
    WHEN p.email = 'client4@test.com' THEN 'Automation of business processes using custom software solutions.'
    WHEN p.email = 'client5@test.com' THEN 'Native mobile app development for iOS and Android platforms.'
    ELSE 'Sample project description'
  END as description,
  CASE 
    WHEN p.email = 'client1@test.com' THEN 'website'
    WHEN p.email = 'client2@test.com' THEN 'marketing'
    WHEN p.email = 'client3@test.com' THEN 'design'
    WHEN p.email = 'client4@test.com' THEN 'automation'
    WHEN p.email = 'client5@test.com' THEN 'mobile_app'
    ELSE 'website'
  END as project_type,
  CASE (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id)) % 4
    WHEN 0 THEN 'completed'
    WHEN 1 THEN 'in_progress'
    WHEN 2 THEN 'review'
    ELSE 'discovery'
  END as status,
  CURRENT_DATE - INTERVAL '30 days' * (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id)) as start_date,
  CURRENT_DATE + INTERVAL '60 days' * (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id)) as end_date,
  CASE 
    WHEN p.email = 'client1@test.com' THEN 50000.00
    WHEN p.email = 'client2@test.com' THEN 25000.00
    WHEN p.email = 'client3@test.com' THEN 15000.00
    WHEN p.email = 'client4@test.com' THEN 75000.00
    WHEN p.email = 'client5@test.com' THEN 100000.00
    ELSE 30000.00
  END as budget,
  jsonb_build_object(
    'priority', CASE (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id)) % 3
      WHEN 0 THEN 'high'
      WHEN 1 THEN 'medium'
      ELSE 'low'
    END,
    'tags', ARRAY['web', 'design', 'development']
  ) as metadata
FROM public.profiles p
WHERE p.email LIKE 'client%@test.com'
LIMIT 5;

-- ============================================================================
-- STEP 3: Create Dummy Quotes
-- ============================================================================

INSERT INTO public.quotes (client_id, service_type, project_details, estimated_cost, status, valid_until, metadata)
SELECT 
  p.id,
  CASE 
    WHEN p.email = 'client1@test.com' THEN 'website'
    WHEN p.email = 'client2@test.com' THEN 'marketing'
    WHEN p.email = 'client3@test.com' THEN 'design'
    WHEN p.email = 'client4@test.com' THEN 'automation'
    WHEN p.email = 'client5@test.com' THEN 'mobile_app'
    ELSE 'website'
  END as service_type,
  jsonb_build_object(
    'name', p.full_name,
    'email', p.email,
    'features', ARRAY['Feature 1', 'Feature 2', 'Feature 3'],
    'pages', 10,
    'timeline', '3 months',
    'details', 'Comprehensive project with all features included'
  ) as project_details,
  CASE 
    WHEN p.email = 'client1@test.com' THEN 50000.00
    WHEN p.email = 'client2@test.com' THEN 25000.00
    WHEN p.email = 'client3@test.com' THEN 15000.00
    WHEN p.email = 'client4@test.com' THEN 75000.00
    WHEN p.email = 'client5@test.com' THEN 100000.00
    ELSE 30000.00
  END as estimated_cost,
  CASE (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id)) % 3
    WHEN 0 THEN 'accepted'
    WHEN 1 THEN 'pending'
    ELSE 'rejected'
  END as status,
  CURRENT_DATE + INTERVAL '30 days' as valid_until,
  jsonb_build_object('source', 'website', 'referral', false) as metadata
FROM public.profiles p
WHERE p.email LIKE 'client%@test.com'
LIMIT 5;

-- ============================================================================
-- STEP 4: Create Dummy Invoices
-- ============================================================================

INSERT INTO public.invoices (client_id, project_id, invoice_number, items, subtotal, tax, total_amount, status, due_date)
SELECT 
  p.id,
  pr.id,
  'INV-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(ROW_NUMBER() OVER()::text, 4, '0') as invoice_number,
  jsonb_build_array(
    jsonb_build_object('description', 'Project Development', 'quantity', 1, 'unit_price', pr.budget * 0.8),
    jsonb_build_object('description', 'Design Services', 'quantity', 1, 'unit_price', pr.budget * 0.2)
  ) as items,
  pr.budget * 0.8 as subtotal,
  pr.budget * 0.16 as tax,
  pr.budget as total_amount,
  CASE (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id)) % 4
    WHEN 0 THEN 'paid'
    WHEN 1 THEN 'pending'
    WHEN 2 THEN 'sent'
    ELSE 'overdue'
  END as status,
  CURRENT_DATE + INTERVAL '30 days' as due_date
FROM public.profiles p
JOIN public.projects pr ON pr.client_id = p.id
WHERE p.email LIKE 'client%@test.com'
LIMIT 5;

-- ============================================================================
-- STEP 5: Create Dummy Payments
-- ============================================================================

INSERT INTO public.payments (invoice_id, amount, currency, status, payment_method, stripe_payment_intent_id)
SELECT 
  i.id,
  i.total_amount,
  'USD' as currency,
  CASE 
    WHEN i.status = 'paid' THEN 'completed'
    WHEN i.status = 'pending' THEN 'pending'
    ELSE 'failed'
  END as status,
  CASE (ROW_NUMBER() OVER (PARTITION BY i.id ORDER BY i.id)) % 3
    WHEN 0 THEN 'credit_card'
    WHEN 1 THEN 'bank_transfer'
    ELSE 'paypal'
  END as payment_method,
  'pi_test_' || gen_random_uuid()::text as stripe_payment_intent_id
FROM public.invoices i
WHERE i.status = 'paid'
LIMIT 3;

-- ============================================================================
-- STEP 6: Create Dummy Tickets
-- ============================================================================

INSERT INTO public.tickets (client_id, project_id, title, description, status, priority, category, assigned_to, metadata)
WITH staff_ids AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY email) - 1 as idx
  FROM public.profiles
  WHERE email LIKE 'staff%@test.com'
),
client_data AS (
  SELECT 
    p.id as client_id,
    pr.id as project_id,
    CASE 
      WHEN p.email = 'client1@test.com' THEN 'Website loading slowly'
      WHEN p.email = 'client2@test.com' THEN 'Need help with social media setup'
      WHEN p.email = 'client3@test.com' THEN 'Logo design revision request'
      WHEN p.email = 'client4@test.com' THEN 'Automation script not working'
      WHEN p.email = 'client5@test.com' THEN 'App crash on iOS devices'
      ELSE 'General support request'
    END as title,
    CASE 
      WHEN p.email = 'client1@test.com' THEN 'The website is taking too long to load. Can you check the server performance?'
      WHEN p.email = 'client2@test.com' THEN 'I need assistance setting up my social media accounts and scheduling posts.'
      WHEN p.email = 'client3@test.com' THEN 'I would like to request some changes to the logo design we discussed.'
      WHEN p.email = 'client4@test.com' THEN 'The automation script is throwing errors. Please investigate.'
      WHEN p.email = 'client5@test.com' THEN 'The mobile app crashes when opening on iOS devices. Need urgent fix.'
      ELSE 'General support inquiry'
    END as description,
    ROW_NUMBER() OVER (ORDER BY p.email) - 1 as row_num
  FROM public.profiles p
  LEFT JOIN public.projects pr ON pr.client_id = p.id
  WHERE p.email LIKE 'client%@test.com'
  LIMIT 5
)
SELECT 
  cd.client_id,
  cd.project_id,
  cd.title,
  cd.description,
  CASE cd.row_num % 4
    WHEN 0 THEN 'resolved'
    WHEN 1 THEN 'open'
    WHEN 2 THEN 'in_progress'
    ELSE 'pending'
  END as status,
  CASE cd.row_num % 3
    WHEN 0 THEN 'high'
    WHEN 1 THEN 'medium'
    ELSE 'low'
  END as priority,
  CASE cd.row_num % 4
    WHEN 0 THEN 'technical'
    WHEN 1 THEN 'design'
    WHEN 2 THEN 'billing'
    ELSE 'general'
  END as category,
  (SELECT id FROM staff_ids WHERE idx = (cd.row_num % 5)) as assigned_to,
  jsonb_build_object('source', 'web', 'tags', ARRAY['support', 'urgent']) as metadata
FROM client_data cd;

-- ============================================================================
-- STEP 7: Create Dummy Ticket Messages
-- ============================================================================

INSERT INTO public.ticket_messages (ticket_id, user_id, message, is_internal, attachments)
WITH ticket_data AS (
  SELECT 
    t.id,
    t.client_id,
    t.assigned_to,
    ROW_NUMBER() OVER (ORDER BY t.id) - 1 as ticket_row,
    generate_series(0, 1) as msg_num
  FROM public.tickets t
  WHERE t.client_id IN (SELECT id FROM public.profiles WHERE email LIKE 'client%@test.com')
  LIMIT 5
)
SELECT 
  td.id as ticket_id,
  CASE 
    WHEN td.msg_num % 2 = 0 
    THEN td.client_id
    ELSE td.assigned_to
  END as user_id,
  CASE 
    WHEN td.msg_num % 2 = 0 
    THEN 'Thank you for looking into this issue. I appreciate your help!'
    ELSE 'I have reviewed the issue and will work on a solution. Expected resolution time: 2-3 business days.'
  END as message,
  CASE 
    WHEN td.msg_num % 2 = 0 
    THEN false
    ELSE true
  END as is_internal,
  jsonb_build_array() as attachments
FROM ticket_data td
WHERE td.assigned_to IS NOT NULL;

-- ============================================================================
-- STEP 8: Create Dummy Bookings
-- ============================================================================

INSERT INTO public.bookings (client_id, booking_type, scheduled_at, duration_minutes, status, notes, metadata)
SELECT 
  p.id,
  CASE (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id)) % 3
    WHEN 0 THEN 'consultation'
    WHEN 1 THEN 'review'
    ELSE 'support'
  END as booking_type,
  CURRENT_TIMESTAMP + INTERVAL '1 day' * (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id)) as scheduled_at,
  60 as duration_minutes,
  CASE (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id)) % 3
    WHEN 0 THEN 'confirmed'
    WHEN 1 THEN 'pending'
    ELSE 'cancelled'
  END as status,
  CASE 
    WHEN p.email = 'client1@test.com' THEN 'Discussion about website performance optimization'
    WHEN p.email = 'client2@test.com' THEN 'Review of social media strategy'
    WHEN p.email = 'client3@test.com' THEN 'Brand design consultation'
    WHEN p.email = 'client4@test.com' THEN 'Automation requirements discussion'
    WHEN p.email = 'client5@test.com' THEN 'Mobile app feature review'
    ELSE 'General consultation'
  END as notes,
  jsonb_build_object('timezone', 'UTC', 'reminder_sent', false) as metadata
FROM public.profiles p
WHERE p.email LIKE 'client%@test.com'
LIMIT 5;

-- ============================================================================
-- STEP 9: Create Dummy Blog Posts
-- ============================================================================

INSERT INTO public.blog_posts (author_id, title, slug, content, excerpt, featured_image, category, tags, published, published_at, metadata)
WITH staff_ids AS (
  SELECT array_agg(id ORDER BY email) AS ids
  FROM public.profiles
  WHERE email LIKE 'staff%@test.com'
)
SELECT 
  staff_ids.ids[((gs - 1) % array_length(staff_ids.ids, 1)) + 1] as author_id,
  CASE gs
    WHEN 1 THEN '10 Tips for Better Web Design in 2025'
    WHEN 2 THEN 'How to Choose the Right Digital Marketing Strategy'
    WHEN 3 THEN 'The Future of Mobile App Development'
    WHEN 4 THEN 'Automation Tools That Will Transform Your Business'
    WHEN 5 THEN 'Brand Identity: Creating a Memorable Presence'
    ELSE 'Sample Blog Post'
  END as title,
  CASE gs
    WHEN 1 THEN '10-tips-better-web-design-2025'
    WHEN 2 THEN 'choose-right-digital-marketing-strategy'
    WHEN 3 THEN 'future-mobile-app-development'
    WHEN 4 THEN 'automation-tools-transform-business'
    WHEN 5 THEN 'brand-identity-memorable-presence'
    ELSE 'sample-blog-post'
  END as slug,
  'This is a comprehensive blog post content. ' || REPEAT('Lorem ipsum dolor sit amet, consectetur adipiscing elit. ', 50) as content,
  CASE gs
    WHEN 1 THEN 'Discover the latest web design trends and best practices for 2025.'
    WHEN 2 THEN 'Learn how to select the perfect digital marketing approach for your business.'
    WHEN 3 THEN 'Explore emerging technologies shaping the mobile app landscape.'
    WHEN 4 THEN 'Discover automation solutions that can revolutionize your workflow.'
    WHEN 5 THEN 'Learn how to build a strong brand identity that resonates with customers.'
    ELSE 'Sample blog post excerpt'
  END as excerpt,
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800' as featured_image,
  CASE (gs % 4)
    WHEN 0 THEN 'design'
    WHEN 1 THEN 'marketing'
    WHEN 2 THEN 'development'
    ELSE 'business'
  END as category,
  ARRAY['web design', 'tips', '2025']::text[] as tags,
  (gs % 2 = 0) as published,
  CASE 
    WHEN gs % 2 = 0 
    THEN CURRENT_TIMESTAMP - INTERVAL '1 day' * gs
    ELSE NULL
  END as published_at,
  jsonb_build_object('views', 0, 'likes', 0) as metadata
FROM staff_ids, generate_series(1, 5) gs;

-- ============================================================================
-- STEP 10: Create Dummy Portfolio Items
-- ============================================================================

INSERT INTO public.portfolio_items (title, category, description, image, technologies, link, published)
VALUES
  ('E-commerce Platform', 'web', 'Modern e-commerce solution with advanced features', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', ARRAY['React', 'Node.js', 'PostgreSQL'], 'https://example.com/project1', true),
  ('Mobile Banking App', 'mobile', 'Secure mobile banking application', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', ARRAY['React Native', 'Firebase'], 'https://example.com/project2', true),
  ('Brand Identity Design', 'design', 'Complete brand identity package', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800', ARRAY['Illustrator', 'Photoshop'], 'https://example.com/project3', true),
  ('Marketing Dashboard', 'web', 'Analytics and reporting dashboard', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', ARRAY['Vue.js', 'D3.js'], 'https://example.com/project4', true),
  ('Automation System', 'automation', 'Business process automation solution', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800', ARRAY['Python', 'Django'], 'https://example.com/project5', true);

-- ============================================================================
-- STEP 11: Create Dummy Case Studies
-- ============================================================================

INSERT INTO public.case_studies (slug, title, client, category, image, excerpt, content, stats, published)
VALUES
  ('tech-solutions-success', 'Tech Solutions Inc: 300% Growth', 'Tech Solutions Inc', 'web', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 'How we helped Tech Solutions achieve 300% growth through digital transformation.', 'Complete case study content...', jsonb_build_array(jsonb_build_object('metric', 'Growth', 'value', '300%'), jsonb_build_object('metric', 'Revenue', 'value', '$2M')), true),
  ('digital-marketing-roi', 'Digital Marketing Pro: 500% ROI', 'Digital Marketing Pro', 'marketing', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', 'Comprehensive marketing strategy that delivered exceptional ROI.', 'Complete case study content...', jsonb_build_array(jsonb_build_object('metric', 'ROI', 'value', '500%'), jsonb_build_object('metric', 'Leads', 'value', '10K')), true),
  ('creative-design-impact', 'Creative Design Studio: Brand Transformation', 'Creative Design Studio', 'design', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800', 'Complete brand redesign that increased brand recognition by 250%.', 'Complete case study content...', jsonb_build_array(jsonb_build_object('metric', 'Recognition', 'value', '250%'), jsonb_build_object('metric', 'Engagement', 'value', '180%')), true),
  ('automation-efficiency', 'Business Consulting: 80% Time Savings', 'Business Consulting Group', 'automation', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800', 'Automation solution that saved 80% of manual processing time.', 'Complete case study content...', jsonb_build_array(jsonb_build_object('metric', 'Time Saved', 'value', '80%'), jsonb_build_object('metric', 'Efficiency', 'value', '400%')), true),
  ('mobile-app-success', 'E-commerce Ventures: 1M Downloads', 'E-commerce Ventures', 'mobile', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', 'Mobile app that reached 1 million downloads in 6 months.', 'Complete case study content...', jsonb_build_array(jsonb_build_object('metric', 'Downloads', 'value', '1M'), jsonb_build_object('metric', 'Rating', 'value', '4.8')), true);

-- ============================================================================
-- STEP 12: Create Dummy Pricing Plans
-- ============================================================================

INSERT INTO public.pricing_plans (name, price_cents, interval, currency, features, active)
VALUES
  ('Starter', 9900, 'month', 'USD', ARRAY['5 Projects', 'Basic Support', '10GB Storage'], true),
  ('Professional', 29900, 'month', 'USD', ARRAY['Unlimited Projects', 'Priority Support', '100GB Storage', 'Advanced Analytics'], true),
  ('Enterprise', 99900, 'month', 'USD', ARRAY['Unlimited Everything', '24/7 Support', 'Unlimited Storage', 'Custom Integrations', 'Dedicated Account Manager'], true),
  ('Basic', 4900, 'month', 'USD', ARRAY['3 Projects', 'Email Support', '5GB Storage'], true),
  ('Premium', 49900, 'month', 'USD', ARRAY['20 Projects', 'Phone Support', '500GB Storage', 'API Access'], true);

-- ============================================================================
-- STEP 13: Create Dummy Downloads
-- ============================================================================

INSERT INTO public.downloads (title, description, file_url, file_size, file_type)
VALUES
  ('Company Brochure', 'Download our latest company brochure', 'https://example.com/files/brochure.pdf', 2048000, 'application/pdf'),
  ('Service Catalog', 'Complete catalog of our services', 'https://example.com/files/catalog.pdf', 3072000, 'application/pdf'),
  ('Case Study Template', 'Template for creating case studies', 'https://example.com/files/template.docx', 512000, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
  ('Brand Guidelines', 'Complete brand identity guidelines', 'https://example.com/files/guidelines.pdf', 4096000, 'application/pdf'),
  ('API Documentation', 'Complete API reference documentation', 'https://example.com/files/api-docs.pdf', 1024000, 'application/pdf');

-- ============================================================================
-- STEP 14: Create Dummy Feature Flags
-- ============================================================================

INSERT INTO public.feature_flags (key, enabled, description)
VALUES
  ('new_dashboard', true, 'Enable new dashboard design'),
  ('ai_assistant', false, 'Enable AI-powered assistant'),
  ('dark_mode', true, 'Enable dark mode theme'),
  ('advanced_analytics', true, 'Enable advanced analytics features'),
  ('beta_features', false, 'Enable beta features for testing');

-- ============================================================================
-- STEP 15: Create Dummy Audit Logs
-- ============================================================================

INSERT INTO public.audit_logs (entity_type, entity_id, action, reason, changes, user_id, user_agent, ip_address)
WITH staff_ids AS (
  SELECT array_agg(id ORDER BY email) AS ids
  FROM public.profiles
  WHERE email LIKE 'staff%@test.com'
),
project_data AS (
  SELECT 
    pr.id,
    pr.status,
    ROW_NUMBER() OVER (ORDER BY pr.id) - 1 as row_num
  FROM public.projects pr
  LIMIT 10
)
SELECT 
  'project' as entity_type,
  pd.id::text as entity_id,
  CASE (pd.row_num % 3)
    WHEN 0 THEN 'created'
    WHEN 1 THEN 'updated'
    ELSE 'viewed'
  END as action,
  'System action' as reason,
  jsonb_build_object('status', pd.status) as changes,
  staff_ids.ids[((pd.row_num % array_length(staff_ids.ids, 1)) + 1)] as user_id,
  'Mozilla/5.0' as user_agent,
  '192.168.1.' || ((pd.row_num % 255) + 1)::text as ip_address
FROM project_data pd, staff_ids;

-- ============================================================================
-- Verification: Check Data Created
-- ============================================================================

SELECT 
  'Data Summary' as info,
  (SELECT COUNT(*) FROM public.profiles WHERE email LIKE 'client%@test.com') as clients,
  (SELECT COUNT(*) FROM public.profiles WHERE email LIKE 'staff%@test.com') as staff,
  (SELECT COUNT(*) FROM public.projects) as projects,
  (SELECT COUNT(*) FROM public.quotes) as quotes,
  (SELECT COUNT(*) FROM public.invoices) as invoices,
  (SELECT COUNT(*) FROM public.payments) as payments,
  (SELECT COUNT(*) FROM public.tickets) as tickets,
  (SELECT COUNT(*) FROM public.ticket_messages) as ticket_messages,
  (SELECT COUNT(*) FROM public.bookings) as bookings,
  (SELECT COUNT(*) FROM public.blog_posts) as blog_posts,
  (SELECT COUNT(*) FROM public.portfolio_items) as portfolio_items,
  (SELECT COUNT(*) FROM public.case_studies) as case_studies,
  (SELECT COUNT(*) FROM public.pricing_plans) as pricing_plans,
  (SELECT COUNT(*) FROM public.downloads) as downloads,
  (SELECT COUNT(*) FROM public.feature_flags) as feature_flags,
  (SELECT COUNT(*) FROM public.audit_logs) as audit_logs;

SELECT '✅ All dummy data created successfully! You can now test all pages and functions.' as status;

