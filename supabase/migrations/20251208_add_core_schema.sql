-- Core schema for Supabase (migration from Lovable)
-- Adjust as needed; RLS is off by default here.

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  company_name text,
  phone text,
  client_code text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User roles
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('admin','staff','client')),
  created_at timestamptz default now(),
  unique(user_id, role)
);

-- Helper: check if a user has a role
create or replace function public.has_role(uid uuid, role_name text)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.user_roles ur
    where ur.user_id = uid and ur.role = role_name
  );
$$;

create index if not exists idx_user_roles_user_role on public.user_roles(user_id, role);

-- Projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  project_type text not null,
  status text not null default 'discovery',
  start_date date,
  end_date date,
  budget numeric(12,2),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Invoices
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.profiles(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete set null,
  invoice_number text not null unique,
  items jsonb default '[]'::jsonb,
  subtotal numeric(12,2),
  tax numeric(12,2),
  total_amount numeric(12,2) not null,
  status text not null default 'pending',
  due_date date,
  paid_at timestamptz,
  pdf_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Payments
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid references public.invoices(id) on delete cascade not null,
  amount numeric(12,2) not null,
  currency text default 'INR',
  status text not null,
  payment_method text,
  stripe_payment_intent_id text,
  created_at timestamptz default now()
);

-- Quotes
create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.profiles(id) on delete cascade,
  service_type text not null,
  project_details jsonb not null default '{}'::jsonb,
  estimated_cost numeric(12,2),
  status text not null default 'pending',
  valid_until date,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Bookings
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  date date not null,
  time_slot text not null,
  service_type text,
  notes text,
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- Tickets
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.profiles(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  description text not null,
  status text not null default 'open',
  priority text not null default 'medium',
  category text,
  assigned_to uuid references public.profiles(id) on delete set null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Ticket messages
create table if not exists public.ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references public.tickets(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  message text not null,
  is_internal boolean default false,
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- Downloads (for admin downloads page)
create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  file_url text not null,
  created_at timestamptz default now()
);

-- Feature flags (optional)
create table if not exists public.feature_flags (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  enabled boolean not null default false,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Portfolio items
create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  description text,
  image text,
  technologies text[] default '{}',
  link text,
  created_at timestamptz default now()
);

-- Case studies
create table if not exists public.case_studies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  client text,
  category text,
  image text,
  excerpt text,
  stats jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- Simple audit log (optional)
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  entity_type text,
  entity_id text,
  action text,
  reason text,
  changes jsonb,
  user_id uuid,
  user_agent text,
  ip_address text,
  created_at timestamptz default now()
);

-- Disable RLS by default; enable and add policies as needed
alter table public.profiles disable row level security;
alter table public.user_roles disable row level security;
alter table public.projects disable row level security;
alter table public.invoices disable row level security;
alter table public.payments disable row level security;
alter table public.quotes disable row level security;
alter table public.bookings disable row level security;
alter table public.tickets disable row level security;
alter table public.ticket_messages disable row level security;
alter table public.downloads disable row level security;
alter table public.feature_flags disable row level security;
alter table public.portfolio_items disable row level security;
alter table public.case_studies disable row level security;
alter table public.audit_logs disable row level security;

-- Enable RLS with simple admin/staff policy (example)
-- Comment out if you prefer to keep RLS off.
alter table public.portfolio_items enable row level security;
alter table public.case_studies enable row level security;

create policy "admin_staff_full_access_portfolio"
  on public.portfolio_items
  for all
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'staff'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'staff'));

create policy "admin_staff_full_access_case_studies"
  on public.case_studies
  for all
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'staff'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'staff'));

