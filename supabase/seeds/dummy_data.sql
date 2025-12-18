-- Comprehensive dummy data for all tables
-- This seed file populates all tables with realistic test data

-- Note: Users must be created through Supabase Auth first
-- These UUIDs are placeholders - replace with actual user IDs from auth.users after signup
-- For testing, you can create users via Supabase Dashboard or Auth API

-- Sample admin user (create this user first via Supabase Auth)
-- Email: thefreelancer2076@gmail.com
-- Password: Blackbird@12.
-- Then update the UUID below with the actual user ID

-- Sample staff user (create this user first via Supabase Auth)
-- Email: staff@dubiqo.com
-- Password: 123
-- Then update the UUID below with the actual user ID

-- Sample client users (create these users first via Supabase Auth)
-- Email: client1@example.com, client2@example.com, client3@example.com
-- Password: 123
-- Then update the UUIDs below with the actual user IDs

-- IMPORTANT: Replace these UUIDs with actual user IDs from auth.users table
-- You can get them by running: SELECT id, email FROM auth.users;

-- For now, using placeholder UUIDs - replace after creating users
DO $$
DECLARE
  admin_user_id uuid := 'e6b7c7c2-bb62-4be5-8bf8-bc5cfabf336c';
  staff_user_id uuid := 'de96e5f6-ac30-4327-a169-cb4cbe0edc64';
  client1_user_id uuid := 'e4ba84dd-a949-48ca-a51b-604e8ba50f56';
  client2_user_id uuid := '15f53b22-a4b0-4b02-bae9-c739fe87d226';
  client3_user_id uuid := 'b43cf253-d1e0-4ca0-a4dd-5deab4cc41ef';
BEGIN
  -- Insert profiles (only if users exist)
  INSERT INTO public.profiles (id, email, full_name, company_name, phone, client_code)
  VALUES 
    (admin_user_id, 'thefreelancer2076@gmail.com', 'Admin User', 'Dubiqo Digital Solutions', '+1-555-0100', 'ADMIN001')
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    company_name = EXCLUDED.company_name,
    phone = EXCLUDED.phone;
  
  INSERT INTO public.profiles (id, email, full_name, company_name, phone, client_code)
  VALUES 
    (staff_user_id, 'staff@dubiqo.com', 'Staff Member', 'Dubiqo Digital Solutions', '+1-555-0101', 'STAFF001')
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    company_name = EXCLUDED.company_name,
    phone = EXCLUDED.phone;
  
  INSERT INTO public.profiles (id, email, full_name, company_name, phone, client_code)
  VALUES 
    (client1_user_id, 'client1@example.com', 'Aakib', 'TechCorp Inc', '+1-555-0200', 'CLI001'),
    (client2_user_id, 'client2@example.com', 'Shayam', 'Design Studio', '+1-555-0201', 'CLI002'),
    (client3_user_id, 'client3@example.com', 'Akeem', 'StartupXYZ', '+1-555-0202', 'CLI003')
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    company_name = EXCLUDED.company_name,
    phone = EXCLUDED.phone;

  -- Insert user roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES 
    (admin_user_id, 'admin'),
    (staff_user_id, 'staff'),
    (client1_user_id, 'client'),
    (client2_user_id, 'client'),
    (client3_user_id, 'client')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Insert projects
  INSERT INTO public.projects (client_id, title, description, project_type, status, start_date, end_date, budget, metadata)
  VALUES 
    (client1_user_id, 'E-commerce Platform', 'Modern e-commerce platform with payment integration and inventory management', 'website', 'in_progress', '2024-01-15', '2024-06-30', 25000.00, '{"team_size": 3, "technologies": ["React", "Node.js", "PostgreSQL"]}'),
    (client1_user_id, 'Mobile App Development', 'iOS and Android mobile application for customer engagement', 'mobile', 'discovery', '2024-02-01', '2024-08-01', 35000.00, '{"platforms": ["iOS", "Android"]}'),
    (client2_user_id, 'Portfolio Website', 'Creative portfolio website showcasing design work', 'website', 'completed', '2024-01-10', '2024-03-15', 8000.00, '{"pages": 12, "features": ["Gallery", "Blog", "Contact Form"]}'),
    (client2_user_id, 'Brand Identity Design', 'Complete brand identity package including logo and guidelines', 'design', 'in_progress', '2024-03-01', '2024-04-30', 5000.00, '{"deliverables": ["Logo", "Color Palette", "Typography"]}'),
    (client3_user_id, 'Dashboard Application', 'Analytics dashboard for business metrics and reporting', 'dashboard', 'review', '2024-02-15', '2024-05-15', 18000.00, '{"integrations": ["Stripe", "Google Analytics"]}'),
    (client3_user_id, 'API Development', 'RESTful API for third-party integrations', 'api', 'in_progress', '2024-03-10', '2024-07-10', 15000.00, '{"endpoints": 25, "authentication": "JWT"}')
  ON CONFLICT DO NOTHING;

  -- Insert quotes
  INSERT INTO public.quotes (client_id, service_type, project_details, estimated_cost, status, valid_until, metadata)
  VALUES 
    (client1_user_id, 'website', '{"pages": 20, "features": ["E-commerce", "CMS", "SEO"]}', 22000.00, 'approved', '2024-12-31', '{"timeline": "4-6 months"}'),
    (client2_user_id, 'design', '{"services": ["Logo Design", "Brand Guidelines", "Business Cards"]}', 4500.00, 'pending', '2024-12-31', '{"revisions": 3}'),
    (NULL, 'website', '{"pages": 10, "features": ["Portfolio", "Contact Form"]}', 6000.00, 'pending', '2024-12-31', '{"timeline": "2-3 months"}'),
    (client3_user_id, 'dashboard', '{"features": ["Analytics", "Reports", "Export"]}', 16000.00, 'approved', '2024-12-31', '{"timeline": "3-4 months"}'),
    (NULL, 'maintenance', '{"plan": "Professional", "duration": "12 months"}', 3600.00, 'pending', '2024-12-31', '{"includes": ["Updates", "Backups", "Support"]}')
  ON CONFLICT DO NOTHING;

  -- Insert bookings
  INSERT INTO public.bookings (user_id, name, email, phone, date, time_slot, service_type, notes, status)
  VALUES 
    (client1_user_id, 'John Smith', 'client1@example.com', '+1-555-0200', CURRENT_DATE + interval '7 days', '10:00-11:00', 'consultation', 'Initial consultation for new project', 'confirmed'),
    (client2_user_id, 'Sarah Johnson', 'client2@example.com', '+1-555-0201', CURRENT_DATE + interval '10 days', '14:00-15:00', 'consultation', 'Discussing brand identity project', 'pending'),
    (NULL, 'Alice Williams', 'alice@example.com', '+1-555-0300', CURRENT_DATE + interval '14 days', '11:00-12:00', 'consultation', 'Interested in portfolio website', 'pending'),
    (client3_user_id, 'Michael Brown', 'client3@example.com', '+1-555-0202', CURRENT_DATE + interval '5 days', '15:00-16:00', 'consultation', 'API development discussion', 'confirmed'),
    (NULL, 'Bob Davis', 'bob@startup.com', '+1-555-0400', CURRENT_DATE + interval '21 days', '09:00-10:00', 'consultation', 'Mobile app consultation', 'pending')
  ON CONFLICT DO NOTHING;

  -- Insert invoices (reference projects created above)
  INSERT INTO public.invoices (client_id, project_id, invoice_number, items, subtotal, tax, total_amount, status, due_date, paid_at)
  SELECT 
    p.client_id,
    p.id,
    'INV-2024-' || LPAD(ROW_NUMBER() OVER ()::text, 3, '0'),
    jsonb_build_array(
      jsonb_build_object(
        'description', 'Project Development',
        'quantity', 1,
        'rate', p.budget,
        'amount', p.budget
      )
    ),
    p.budget,
    ROUND(p.budget * 0.18, 2),
    ROUND(p.budget * 1.18, 2),
    CASE WHEN ROW_NUMBER() OVER () % 3 = 0 THEN 'paid' WHEN ROW_NUMBER() OVER () % 3 = 1 THEN 'pending' ELSE 'overdue' END,
    CURRENT_DATE + interval '30 days',
    CASE WHEN ROW_NUMBER() OVER () % 3 = 0 THEN CURRENT_DATE - interval '5 days' ELSE NULL END
  FROM public.projects p
  LIMIT 6
  ON CONFLICT (invoice_number) DO NOTHING;

  -- Insert payments (reference invoices created above)
  INSERT INTO public.payments (invoice_id, amount, currency, status, payment_method, stripe_payment_intent_id)
  SELECT 
    i.id,
    i.total_amount,
    'INR',
    CASE WHEN i.status = 'paid' THEN 'completed' ELSE 'pending' END,
    CASE WHEN i.status = 'paid' THEN 'card' ELSE NULL END,
    CASE WHEN i.status = 'paid' THEN 'pi_' || substr(md5(random()::text), 1, 24) ELSE NULL END
  FROM public.invoices i
  WHERE i.status = 'paid'
  ON CONFLICT DO NOTHING;

  -- Insert tickets (reference projects and clients)
  INSERT INTO public.tickets (client_id, project_id, title, description, status, priority, category, assigned_to, metadata)
  SELECT 
    p.client_id,
    p.id,
    'Issue with ' || p.title,
    'Need assistance with ' || p.title || '. ' || p.description,
    CASE WHEN ROW_NUMBER() OVER () % 4 = 0 THEN 'resolved' WHEN ROW_NUMBER() OVER () % 4 = 1 THEN 'open' WHEN ROW_NUMBER() OVER () % 4 = 2 THEN 'in_progress' ELSE 'closed' END,
    CASE WHEN ROW_NUMBER() OVER () % 3 = 0 THEN 'high' WHEN ROW_NUMBER() OVER () % 3 = 1 THEN 'medium' ELSE 'low' END,
    'technical',
    CASE WHEN ROW_NUMBER() OVER () % 2 = 0 THEN staff_user_id ELSE NULL END,
    '{}'::jsonb
  FROM public.projects p
  LIMIT 8
  ON CONFLICT DO NOTHING;

  -- Insert ticket messages (reference tickets created above)
  INSERT INTO public.ticket_messages (ticket_id, user_id, message, is_internal, attachments)
  SELECT 
    t.id,
    t.client_id,
    'Initial message regarding ' || t.title,
    false,
    '[]'::jsonb
  FROM public.tickets t
  LIMIT 8
  ON CONFLICT DO NOTHING;

  -- Insert additional ticket messages (staff replies)
  INSERT INTO public.ticket_messages (ticket_id, user_id, message, is_internal, attachments)
  SELECT 
    t.id,
    staff_user_id,
    'Thank you for contacting us. We are looking into this issue and will update you soon.',
    false,
    '[]'::jsonb
  FROM public.tickets t
  WHERE t.assigned_to = staff_user_id
  LIMIT 4
  ON CONFLICT DO NOTHING;

  -- Insert downloads
  INSERT INTO public.downloads (title, description, file_url)
  VALUES 
    ('Web Design Checklist', 'Comprehensive checklist for web design projects', '/downloads/web-design-checklist.pdf'),
    ('SEO Best Practices Guide', 'Essential SEO tips for your website', '/downloads/seo-guide.pdf'),
    ('Brand Guidelines Template', 'Template for creating brand guidelines', '/downloads/brand-guidelines-template.pdf'),
    ('Project Planning Worksheet', 'Worksheet for planning your project', '/downloads/project-planning-worksheet.pdf'),
    ('Content Strategy Guide', 'Guide to developing content strategy', '/downloads/content-strategy-guide.pdf'),
    ('Social Media Kit', 'Resources for social media marketing', '/downloads/social-media-kit.zip')
  ON CONFLICT DO NOTHING;

  -- Insert feature flags
  INSERT INTO public.feature_flags (key, enabled, description)
  VALUES 
    ('enable_ai_chat', true, 'Enable AI chat widget'),
    ('enable_analytics', true, 'Enable analytics tracking'),
    ('maintenance_mode', false, 'Enable maintenance mode'),
    ('beta_features', true, 'Enable beta features'),
    ('new_dashboard', false, 'Enable new dashboard design'),
    ('payment_gateway_stripe', true, 'Enable Stripe payment gateway'),
    ('email_notifications', true, 'Enable email notifications'),
    ('two_factor_auth', false, 'Enable two-factor authentication')
  ON CONFLICT (key) DO UPDATE SET
    enabled = EXCLUDED.enabled,
    description = EXCLUDED.description;

  -- Insert portfolio items
  INSERT INTO public.portfolio_items (title, category, description, image, technologies, link)
  VALUES 
    ('E-commerce Platform', 'website', 'Modern e-commerce platform with advanced features', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800', ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe'], 'https://example.com/ecommerce'),
    ('Mobile Banking App', 'mobile', 'Secure mobile banking application', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', ARRAY['React Native', 'Firebase', 'Stripe'], 'https://example.com/banking'),
    ('Analytics Dashboard', 'dashboard', 'Real-time analytics dashboard', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', ARRAY['React', 'D3.js', 'Python'], 'https://example.com/dashboard'),
    ('Portfolio Website', 'website', 'Creative portfolio website', 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800', ARRAY['Next.js', 'Tailwind CSS', 'Framer Motion'], 'https://example.com/portfolio'),
    ('SaaS Platform', 'website', 'Complete SaaS platform with subscription management', 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800', ARRAY['Vue.js', 'Laravel', 'MySQL'], 'https://example.com/saas'),
    ('Food Delivery App', 'mobile', 'Food delivery mobile application', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', ARRAY['Flutter', 'Firebase', 'Maps API'], 'https://example.com/food'),
    ('Corporate Website', 'website', 'Professional corporate website', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', ARRAY['WordPress', 'PHP', 'MySQL'], 'https://example.com/corporate'),
    ('Fitness Tracking App', 'mobile', 'Fitness and health tracking application', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', ARRAY['Swift', 'HealthKit', 'Core Data'], 'https://example.com/fitness')
  ON CONFLICT DO NOTHING;

  -- Insert case studies
  INSERT INTO public.case_studies (slug, title, client, category, image, excerpt, stats)
  VALUES 
    ('ecommerce-success-story', 'E-commerce Success Story', 'TechCorp Inc', 'ecommerce', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800', 'How we helped increase online sales by 300%', '[{"label": "Sales Increase", "value": "300%"}, {"label": "Page Load Time", "value": "1.2s"}, {"label": "Conversion Rate", "value": "4.5%"}]'),
    ('portfolio-transformation', 'Portfolio Website Transformation', 'Design Studio', 'website', 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800', 'Redesigning a creative portfolio for maximum impact', '[{"label": "Traffic Increase", "value": "250%"}, {"label": "Bounce Rate", "value": "25%"}, {"label": "Engagement", "value": "85%"}]'),
    ('mobile-app-launch', 'Mobile App Launch Success', 'StartupXYZ', 'mobile', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', 'Launching a successful mobile app from concept to market', '[{"label": "Downloads", "value": "50K+"}, {"label": "Rating", "value": "4.8/5"}, {"label": "Retention", "value": "65%"}]'),
    ('dashboard-analytics', 'Analytics Dashboard Implementation', 'Enterprise Corp', 'dashboard', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', 'Building a comprehensive analytics dashboard', '[{"label": "Data Points", "value": "1M+"}, {"label": "Real-time Updates", "value": "Yes"}, {"label": "User Satisfaction", "value": "95%"}]'),
    ('brand-identity-design', 'Complete Brand Identity Design', 'New Brand Co', 'design', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800', 'Creating a complete brand identity from scratch', '[{"label": "Brand Recognition", "value": "80%"}, {"label": "Logo Variations", "value": "12"}, {"label": "Brand Guidelines", "value": "50 pages"}]')
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    client = EXCLUDED.client,
    category = EXCLUDED.category,
    image = EXCLUDED.image,
    excerpt = EXCLUDED.excerpt,
    stats = EXCLUDED.stats;

  -- Insert audit logs
  INSERT INTO public.audit_logs (entity_type, entity_id, action, reason, changes, user_id, user_agent, ip_address)
  VALUES 
    ('project', (SELECT id::text FROM public.projects LIMIT 1), 'created', 'New project created', jsonb_build_object('status', 'discovery'), client1_user_id, 'Mozilla/5.0', '192.168.1.100'),
    ('invoice', (SELECT id::text FROM public.invoices LIMIT 1), 'created', 'Invoice generated', jsonb_build_object('status', 'pending'), admin_user_id, 'Mozilla/5.0', '192.168.1.101'),
    ('ticket', (SELECT id::text FROM public.tickets LIMIT 1), 'created', 'Support ticket opened', jsonb_build_object('status', 'open'), client1_user_id, 'Mozilla/5.0', '192.168.1.102'),
    ('project', (SELECT id::text FROM public.projects LIMIT 1 OFFSET 1), 'updated', 'Project status updated', jsonb_build_object('status', 'in_progress'), staff_user_id, 'Mozilla/5.0', '192.168.1.103'),
    ('invoice', (SELECT id::text FROM public.invoices LIMIT 1 OFFSET 1), 'paid', 'Payment received', jsonb_build_object('status', 'paid'), client2_user_id, 'Mozilla/5.0', '192.168.1.104'),
    ('ticket', (SELECT id::text FROM public.tickets LIMIT 1 OFFSET 1), 'assigned', 'Ticket assigned to staff', jsonb_build_object('assigned_to', staff_user_id::text), admin_user_id, 'Mozilla/5.0', '192.168.1.105')
  ON CONFLICT DO NOTHING;

END $$;
