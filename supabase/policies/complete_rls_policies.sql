-- ============================================================================
-- COMPLETE RLS POLICIES FOR ALL TABLES
-- ============================================================================
-- This file contains all Row Level Security (RLS) policies for the application
-- Run this after creating tables to enable security
-- ============================================================================

-- ============================================================================
-- CRITICAL: Disable RLS on user_roles to prevent infinite recursion
-- ============================================================================
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Enable RLS on all tables
-- ============================================================================
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
-- Verification: Check RLS Status
-- ============================================================================
SELECT 
  tablename,
  CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'user_roles', 'profiles', 'projects', 'invoices', 'quotes', 
    'tickets', 'bookings', 'payments', 'ticket_messages',
    'blog_posts', 'pricing_plans', 'downloads', 'feature_flags',
    'audit_logs', 'portfolio_items', 'case_studies'
  )
ORDER BY tablename;

SELECT '✅ All RLS policies created successfully!' as status;

