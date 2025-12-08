-- Migration: helper functions to grant/revoke admin role by email
-- Purpose: provide a convenient, auditable way to assign the 'admin' role
-- to an existing profile using an email address. This avoids needing to
-- look up UUIDs manually and can be run from the Supabase SQL editor.

-- Create function to grant admin role to the profile matching email
create or replace function public.grant_admin_by_email(p_email text)
returns uuid
language plpgsql
security definer
as $$
declare
  v_user uuid;
begin
  select id into v_user from public.profiles where lower(email) = lower(p_email) limit 1;
  if v_user is null then
    raise notice 'grant_admin_by_email: no profile found for %', p_email;
    return null;
  end if;

  insert into public.user_roles (user_id, role)
  values (v_user, 'admin')
  on conflict (user_id, role) do nothing;

  return v_user;
end;
$$;

-- Create function to revoke admin role by email
create or replace function public.revoke_admin_by_email(p_email text)
returns uuid
language plpgsql
security definer
as $$
declare
  v_user uuid;
begin
  select id into v_user from public.profiles where lower(email) = lower(p_email) limit 1;
  if v_user is null then
    raise notice 'revoke_admin_by_email: no profile found for %', p_email;
    return null;
  end if;

  delete from public.user_roles where user_id = v_user and role = 'admin';

  return v_user;
end;
$$;

-- Usage examples (run in SQL editor):
-- SELECT public.grant_admin_by_email('you@example.com');
-- SELECT public.revoke_admin_by_email('you@example.com');

-- Notes:
-- 1) These are security-definer functions that insert into public.user_roles.
--    Run them from the Supabase SQL editor (Role: postgres) or call them
--    as an authenticated DB admin user. Keep usage audited.
-- 2) After granting the role, reload your app and the admin pages should
--    be accessible (RLS policies check public.has_role(auth.uid(), 'admin')).
