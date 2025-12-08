-- Migration: add blog_posts and pricing_plans tables
-- Run this migration in your Supabase database to create missing tables used by admin pages.

-- Blog posts table
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id) on delete set null,
  title text not null,
  slug text not null unique,
  content text not null,
  excerpt text,
  featured_image text,
  category text,
  tags text[] default '{}',
  metadata jsonb default '{}'::jsonb,
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Pricing plans table
create table if not exists public.pricing_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price_cents bigint,
  interval text,
  currency text default 'INR',
  features text[] default '{}',
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger to update updated_at
create or replace function public.update_timestamp_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_blog_posts_updated_at before update on public.blog_posts for each row execute function public.update_timestamp_column();
create trigger update_pricing_plans_updated_at before update on public.pricing_plans for each row execute function public.update_timestamp_column();

-- Enable RLS and add admin/staff full access policies
alter table public.blog_posts enable row level security;
drop policy if exists admin_staff_full_access_blog_posts on public.blog_posts;
create policy admin_staff_full_access_blog_posts
  on public.blog_posts for all
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'staff'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'staff'));

alter table public.pricing_plans enable row level security;
drop policy if exists admin_staff_full_access_pricing on public.pricing_plans;
create policy admin_staff_full_access_pricing
  on public.pricing_plans for all
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'staff'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'staff'));
