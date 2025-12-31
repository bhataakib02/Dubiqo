-- ============================================================================
-- COMPLETE DATABASE RESET - Full Database Setup
-- ============================================================================
-- 
-- PURPOSE: Complete database setup from scratch
-- USE THIS WHEN:
--   - Setting up database for the first time
--   - Need to completely reset and recreate everything
--   - Want all tables, functions, triggers, and policies in one script
--
-- WHAT THIS DOES:
--   1. Drops all existing tables, functions, and triggers
--   2. Creates all tables with proper structure
--   3. Creates all functions and triggers
--   4. Enables RLS and creates all security policies
--   5. Assigns admin role to thefreelancer2076@gmail.com
--
-- IMPORTANT NOTES:
--   - This will DELETE ALL DATA in public schema
--   - Run this ONLY when you want a fresh start
--   - User must exist in auth.users before running (create in Dashboard)
--   - After running, you can use ASSIGN_ADMIN_ROLE.sql for other users
--
-- ALTERNATIVE: If tables already exist and you only need policies,
--   use: supabase/policies/complete_rls_policies.sql instead
--
-- ============================================================================

-- ============================================================================
-- STEP 1: Drop ALL existing tables, functions, and triggers
-- ============================================================================
DROP TABLE IF EXISTS public.ticket_messages CASCADE;
DROP TABLE IF EXISTS public.tickets CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.invoices CASCADE;
DROP TABLE IF EXISTS public.quotes CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.downloads CASCADE;
DROP TABLE IF EXISTS public.feature_flags CASCADE;
DROP TABLE IF EXISTS public.case_studies CASCADE;
DROP TABLE IF EXISTS public.portfolio_items CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.pricing_plans CASCADE;

-- Drop functions and triggers
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.has_role(uuid, text) CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.update_timestamp_column() CASCADE;

-- ============================================================================
-- STEP 2: Recreate all tables with proper structure
-- ============================================================================

-- Profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  company_name text,
  phone text,
  client_code text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User roles table (CRITICAL: RLS will be DISABLED to prevent recursion)
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin','staff','client')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Helper function for RLS (but won't be used on user_roles)
CREATE OR REPLACE FUNCTION public.has_role(uid uuid, role_name text)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = uid AND ur.role = role_name
  );
$$;

CREATE INDEX IF NOT EXISTS idx_user_roles_user_role ON public.user_roles(user_id, role);

-- Projects table
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  project_type text NOT NULL,
  status text NOT NULL DEFAULT 'discovery',
  start_date date,
  end_date date,
  budget numeric(12,2),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Invoices table
CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  invoice_number text NOT NULL UNIQUE,
  items jsonb DEFAULT '[]'::jsonb,
  subtotal numeric(12,2),
  tax numeric(12,2),
  total_amount numeric(12,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  due_date date,
  paid_at timestamptz,
  pdf_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payments table
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  amount numeric(12,2) NOT NULL,
  currency text DEFAULT 'INR',
  status text NOT NULL,
  payment_method text,
  stripe_payment_intent_id text,
  created_at timestamptz DEFAULT now()
);

-- Quotes table
CREATE TABLE public.quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_type text NOT NULL,
  project_details jsonb NOT NULL DEFAULT '{}'::jsonb,
  estimated_cost numeric(12,2),
  status text NOT NULL DEFAULT 'pending',
  valid_until date,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bookings table
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  booking_type text NOT NULL,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 30,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Tickets table
CREATE TABLE public.tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  priority text NOT NULL DEFAULT 'medium',
  category text,
  assigned_to uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ticket messages table
CREATE TABLE public.ticket_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  is_internal boolean DEFAULT false,
  attachments jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Downloads table
CREATE TABLE public.downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_size bigint,
  file_type text,
  created_at timestamptz DEFAULT now()
);

-- Feature flags table
CREATE TABLE public.feature_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  enabled boolean NOT NULL DEFAULT false,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Portfolio items table
CREATE TABLE public.portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text,
  description text,
  image text,
  technologies text[] DEFAULT '{}',
  link text,
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Case studies table
CREATE TABLE public.case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  client text,
  category text,
  image text,
  excerpt text,
  content text,
  stats jsonb DEFAULT '[]'::jsonb,
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Blog posts table
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL,
  excerpt text,
  featured_image text,
  category text,
  tags text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}'::jsonb,
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Pricing plans table
CREATE TABLE public.pricing_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price_cents bigint,
  interval text,
  currency text DEFAULT 'INR',
  features text[] DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Audit logs table
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text,
  entity_id text,
  action text,
  reason text,
  changes jsonb,
  user_id uuid,
  user_agent text,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- STEP 3: Create triggers and functions
-- ============================================================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON public.quotes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_feature_flags_updated_at BEFORE UPDATE ON public.feature_flags FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_pricing_plans_updated_at BEFORE UPDATE ON public.pricing_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Handle new user trigger (creates profile and assigns client role)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  -- Assign default 'client' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- STEP 4: Configure RLS (Row Level Security)
-- ============================================================================

-- CRITICAL: Disable RLS on user_roles to prevent infinite recursion
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Enable RLS on all other tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES: Profiles
-- ============================================================================
DROP POLICY IF EXISTS "users_can_view_own_profile" ON public.profiles;
CREATE POLICY "users_can_view_own_profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "users_can_update_own_profile" ON public.profiles;
CREATE POLICY "users_can_update_own_profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "admin_staff_view_all_profiles" ON public.profiles;
CREATE POLICY "admin_staff_view_all_profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

DROP POLICY IF EXISTS "admin_staff_manage_all_profiles" ON public.profiles;
CREATE POLICY "admin_staff_manage_all_profiles"
  ON public.profiles FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- ============================================================================
-- RLS POLICIES: Projects
-- ============================================================================
DROP POLICY IF EXISTS "clients_view_own_projects" ON public.projects;
CREATE POLICY "clients_view_own_projects"
  ON public.projects FOR SELECT
  USING (client_id = auth.uid());

DROP POLICY IF EXISTS "admin_staff_view_all_projects" ON public.projects;
CREATE POLICY "admin_staff_view_all_projects"
  ON public.projects FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

DROP POLICY IF EXISTS "admin_staff_manage_projects" ON public.projects;
CREATE POLICY "admin_staff_manage_projects"
  ON public.projects FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- ============================================================================
-- RLS POLICIES: Invoices
-- ============================================================================
DROP POLICY IF EXISTS "clients_view_own_invoices" ON public.invoices;
CREATE POLICY "clients_view_own_invoices"
  ON public.invoices FOR SELECT
  USING (client_id = auth.uid());

DROP POLICY IF EXISTS "admin_staff_view_all_invoices" ON public.invoices;
CREATE POLICY "admin_staff_view_all_invoices"
  ON public.invoices FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

DROP POLICY IF EXISTS "admin_staff_manage_invoices" ON public.invoices;
CREATE POLICY "admin_staff_manage_invoices"
  ON public.invoices FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- ============================================================================
-- RLS POLICIES: Quotes
-- ============================================================================
DROP POLICY IF EXISTS "clients_view_own_quotes" ON public.quotes;
CREATE POLICY "clients_view_own_quotes"
  ON public.quotes FOR SELECT
  USING (client_id = auth.uid() OR client_id IS NULL);

DROP POLICY IF EXISTS "anyone_can_create_quotes" ON public.quotes;
CREATE POLICY "anyone_can_create_quotes"
  ON public.quotes FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_staff_view_all_quotes" ON public.quotes;
CREATE POLICY "admin_staff_view_all_quotes"
  ON public.quotes FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

DROP POLICY IF EXISTS "admin_staff_manage_quotes" ON public.quotes;
CREATE POLICY "admin_staff_manage_quotes"
  ON public.quotes FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- ============================================================================
-- RLS POLICIES: Tickets
-- ============================================================================
DROP POLICY IF EXISTS "clients_view_own_tickets" ON public.tickets;
CREATE POLICY "clients_view_own_tickets"
  ON public.tickets FOR SELECT
  USING (client_id = auth.uid());

DROP POLICY IF EXISTS "clients_create_own_tickets" ON public.tickets;
CREATE POLICY "clients_create_own_tickets"
  ON public.tickets FOR INSERT
  WITH CHECK (client_id = auth.uid());

DROP POLICY IF EXISTS "admin_staff_view_all_tickets" ON public.tickets;
CREATE POLICY "admin_staff_view_all_tickets"
  ON public.tickets FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

DROP POLICY IF EXISTS "admin_staff_manage_tickets" ON public.tickets;
CREATE POLICY "admin_staff_manage_tickets"
  ON public.tickets FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- ============================================================================
-- RLS POLICIES: Ticket Messages
-- ============================================================================
DROP POLICY IF EXISTS "users_view_ticket_messages" ON public.ticket_messages;
CREATE POLICY "users_view_ticket_messages"
  ON public.ticket_messages FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.tickets t
      WHERE t.id = ticket_messages.ticket_id
      AND (t.client_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
    )
  );

DROP POLICY IF EXISTS "users_create_ticket_messages" ON public.ticket_messages;
CREATE POLICY "users_create_ticket_messages"
  ON public.ticket_messages FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.tickets t
      WHERE t.id = ticket_id
      AND (t.client_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
    )
  );

-- ============================================================================
-- RLS POLICIES: Bookings
-- ============================================================================
DROP POLICY IF EXISTS "clients_view_own_bookings" ON public.bookings;
CREATE POLICY "clients_view_own_bookings"
  ON public.bookings FOR SELECT
  USING (client_id = auth.uid() OR client_id IS NULL);

DROP POLICY IF EXISTS "anyone_can_create_bookings" ON public.bookings;
CREATE POLICY "anyone_can_create_bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_staff_view_all_bookings" ON public.bookings;
CREATE POLICY "admin_staff_view_all_bookings"
  ON public.bookings FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

DROP POLICY IF EXISTS "admin_staff_manage_bookings" ON public.bookings;
CREATE POLICY "admin_staff_manage_bookings"
  ON public.bookings FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- ============================================================================
-- RLS POLICIES: Payments
-- ============================================================================
DROP POLICY IF EXISTS "clients_view_own_payments" ON public.payments;
CREATE POLICY "clients_view_own_payments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.invoices i
      WHERE i.id = payments.invoice_id
      AND i.client_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "admin_staff_view_all_payments" ON public.payments;
CREATE POLICY "admin_staff_view_all_payments"
  ON public.payments FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

DROP POLICY IF EXISTS "admin_staff_manage_payments" ON public.payments;
CREATE POLICY "admin_staff_manage_payments"
  ON public.payments FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- ============================================================================
-- RLS POLICIES: Blog Posts
-- ============================================================================
DROP POLICY IF EXISTS "public_read_published_blog_posts" ON public.blog_posts;
CREATE POLICY "public_read_published_blog_posts"
  ON public.blog_posts FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "admin_staff_full_access_blog_posts" ON public.blog_posts;
CREATE POLICY "admin_staff_full_access_blog_posts"
  ON public.blog_posts FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- ============================================================================
-- RLS POLICIES: Pricing Plans
-- ============================================================================
DROP POLICY IF EXISTS "public_read_pricing_plans" ON public.pricing_plans;
CREATE POLICY "public_read_pricing_plans"
  ON public.pricing_plans FOR SELECT
  USING (active = true);

DROP POLICY IF EXISTS "admin_staff_manage_pricing_plans" ON public.pricing_plans;
CREATE POLICY "admin_staff_manage_pricing_plans"
  ON public.pricing_plans FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- ============================================================================
-- RLS POLICIES: Portfolio Items
-- ============================================================================
DROP POLICY IF EXISTS "public_read_published_portfolio" ON public.portfolio_items;
CREATE POLICY "public_read_published_portfolio"
  ON public.portfolio_items FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "admin_staff_full_access_portfolio" ON public.portfolio_items;
CREATE POLICY "admin_staff_full_access_portfolio"
  ON public.portfolio_items FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- ============================================================================
-- RLS POLICIES: Case Studies
-- ============================================================================
DROP POLICY IF EXISTS "public_read_published_case_studies" ON public.case_studies;
CREATE POLICY "public_read_published_case_studies"
  ON public.case_studies FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "admin_staff_full_access_case_studies" ON public.case_studies;
CREATE POLICY "admin_staff_full_access_case_studies"
  ON public.case_studies FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- ============================================================================
-- RLS POLICIES: Downloads
-- ============================================================================
DROP POLICY IF EXISTS "public_read_downloads" ON public.downloads;
CREATE POLICY "public_read_downloads"
  ON public.downloads FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "admin_staff_manage_downloads" ON public.downloads;
CREATE POLICY "admin_staff_manage_downloads"
  ON public.downloads FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- ============================================================================
-- RLS POLICIES: Feature Flags
-- ============================================================================
DROP POLICY IF EXISTS "admin_only_feature_flags" ON public.feature_flags;
CREATE POLICY "admin_only_feature_flags"
  ON public.feature_flags FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- RLS POLICIES: Audit Logs
-- ============================================================================
DROP POLICY IF EXISTS "admin_only_audit_logs" ON public.audit_logs;
CREATE POLICY "admin_only_audit_logs"
  ON public.audit_logs FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- STEP 5: Assign admin role to your email
-- ============================================================================

-- IMPORTANT: User must be created in Supabase Auth Dashboard first!
-- Go to: Authentication → Users → Add user
-- Email: thefreelancer2076@gmail.com
-- Password: Blackbird@12
-- Auto Confirm: ✅ (checked)
-- Then run this script

-- Assign admin role (if user exists)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'thefreelancer2076@gmail.com'
ON CONFLICT (user_id, role) DO UPDATE SET role = 'admin';

-- Ensure profile exists for admin user
INSERT INTO public.profiles (id, email, full_name)
SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', 'Admin User')
FROM auth.users 
WHERE email = 'thefreelancer2076@gmail.com'
ON CONFLICT (id) DO UPDATE SET email = 'thefreelancer2076@gmail.com';

-- ============================================================================
-- STEP 6: Verify setup
-- ============================================================================

-- Check tables created
SELECT 
  'Tables created:' as info,
  COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE';

-- Check RLS status
SELECT 
  tablename,
  CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('user_roles', 'profiles', 'projects', 'invoices', 'quotes', 'tickets')
ORDER BY tablename;

-- Check admin role
SELECT 
  u.email,
  ur.role,
  CASE WHEN ur.role = 'admin' THEN '✅ Admin role assigned' ELSE '❌ No admin role' END as status
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'thefreelancer2076@gmail.com';

SELECT '✅ Database reset complete! All errors should be fixed.' as status;

