-- Simple fix: Ensure RLS is disabled on user_roles table
-- Run this in Supabase SQL Editor

-- Disable RLS completely on user_roles
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Drop all policies if any exist
DROP POLICY IF EXISTS "user_can_read_own_roles" ON public.user_roles;
DROP POLICY IF EXISTS "user_can_insert_own_roles" ON public.user_roles;
DROP POLICY IF EXISTS "user_can_update_own_roles" ON public.user_roles;
DROP POLICY IF EXISTS "users_can_manage_own_roles" ON public.user_roles;
DROP POLICY IF EXISTS "trigger_can_insert_roles" ON public.user_roles;

-- Verify RLS is disabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'user_roles' AND schemaname = 'public';
