-- Row Level Security (RLS) Policies
-- This file documents all RLS policies applied to tables
-- Note: Policies are also defined in migrations, this is for reference

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Projects policies
-- Clients can view their own projects
CREATE POLICY "Clients can view own projects"
  ON public.projects FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Clients can create their own projects
CREATE POLICY "Clients can create own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Staff/Admin can update any project
CREATE POLICY "Staff can update projects"
  ON public.projects FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Quotes policies
-- Users can view their own quotes
CREATE POLICY "Users can view own quotes"
  ON public.quotes FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Anyone can create quotes (public form)
CREATE POLICY "Anyone can create quotes"
  ON public.quotes FOR INSERT
  WITH CHECK (true);

-- Bookings policies
-- Similar pattern for bookings, invoices, tickets, etc.
-- (Policies should be defined in migrations, this is for documentation)

-- Blog posts - public read for published posts
CREATE POLICY "Public can view published blog posts"
  ON public.blog_posts FOR SELECT
  USING (published = true);

-- Case studies - public read for published studies
CREATE POLICY "Public can view published case studies"
  ON public.case_studies FOR SELECT
  USING (published = true);

-- Downloads - public read
CREATE POLICY "Public can view downloads"
  ON public.downloads FOR SELECT
  USING (true);

-- Audit logs - admin only
CREATE POLICY "Admin can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Feature flags - public read
CREATE POLICY "Public can view feature flags"
  ON public.feature_flags FOR SELECT
  USING (true);
