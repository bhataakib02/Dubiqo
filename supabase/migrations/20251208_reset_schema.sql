-- WARNING: This will drop existing tables in public. Back up first.
-- Drop in dependency order
drop table if exists public.ticket_messages cascade;
drop table if exists public.tickets cascade;
drop table if exists public.bookings cascade;
drop table if exists public.payments cascade;
drop table if exists public.invoices cascade;
drop table if exists public.quotes cascade;
drop table if exists public.projects cascade;
drop table if exists public.downloads cascade;
drop table if exists public.feature_flags cascade;
drop table if exists public.case_studies cascade;
drop table if exists public.portfolio_items cascade;
drop table if exists public.audit_logs cascade;
drop table if exists public.user_roles cascade;
drop table if exists public.profiles cascade;

-- Drop existing functions and triggers
drop function if exists public.handle_new_user() cascade;
drop function if exists public.has_role(uuid, text) cascade;
drop function if exists public.update_updated_at() cascade;

-- Recreate schema
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  company_name text,
  phone text,
  client_code text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('admin','staff','client')),
  created_at timestamptz default now(),
  unique(user_id, role)
);

-- helper function for RLS
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

create table public.projects (
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

create table public.invoices (
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

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid references public.invoices(id) on delete cascade not null,
  amount numeric(12,2) not null,
  currency text default 'INR',
  status text not null,
  payment_method text,
  stripe_payment_intent_id text,
  created_at timestamptz default now()
);

create table public.quotes (
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

create table public.bookings (
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

create table public.tickets (
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

create table public.ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references public.tickets(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  message text not null,
  is_internal boolean default false,
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

create table public.downloads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  file_url text not null,
  created_at timestamptz default now()
);

create table public.feature_flags (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  enabled boolean not null default false,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  description text,
  image text,
  technologies text[] default '{}',
  link text,
  created_at timestamptz default now()
);

create table public.case_studies (
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

create table public.audit_logs (
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

-- Updated_at trigger function
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply updated_at triggers
create trigger update_profiles_updated_at before update on public.profiles for each row execute function public.update_updated_at();
create trigger update_projects_updated_at before update on public.projects for each row execute function public.update_updated_at();
create trigger update_invoices_updated_at before update on public.invoices for each row execute function public.update_updated_at();
create trigger update_quotes_updated_at before update on public.quotes for each row execute function public.update_updated_at();
create trigger update_tickets_updated_at before update on public.tickets for each row execute function public.update_updated_at();
create trigger update_feature_flags_updated_at before update on public.feature_flags for each row execute function public.update_updated_at();

-- Create profile on user signup (ensures email is stored)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  
  -- Assign default 'client' role
  insert into public.user_roles (user_id, role)
  values (new.id, 'client')
  on conflict (user_id, role) do nothing;
  
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS: enable only on portfolio_items and case_studies with admin/staff access
alter table public.portfolio_items enable row level security;
alter table public.case_studies enable row level security;

drop policy if exists "admin_staff_full_access_portfolio" on public.portfolio_items;
create policy "admin_staff_full_access_portfolio"
  on public.portfolio_items
  for all
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'staff'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'staff'));

drop policy if exists "admin_staff_full_access_case_studies" on public.case_studies;
create policy "admin_staff_full_access_case_studies"
  on public.case_studies
  for all
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'staff'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'staff'));

-- Leave other tables RLS OFF for now
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
alter table public.audit_logs disable row level security;
