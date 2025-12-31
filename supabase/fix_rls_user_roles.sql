-- ============================================================================
-- FIX RLS ON USER_ROLES TABLE
-- ============================================================================
--
-- PURPOSE: Disable Row-Level Security on user_roles table
-- USE THIS WHEN:
--   - You get "row-level security policy" errors when updating user roles
--   - RLS is blocking inserts/updates to user_roles table
--   - You need to allow admin/staff to manage user roles
--
-- WHAT THIS DOES:
--   1. Disables RLS on user_roles table (required to prevent recursion)
--   2. Verifies RLS is disabled
--
-- IMPORTANT NOTES:
--   - RLS MUST be disabled on user_roles to prevent infinite recursion
--   - This is safe because user_roles is managed by admins/staff only
--   - The user_roles table should never have RLS enabled
--
-- ============================================================================

-- Disable RLS on user_roles table
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled (should return 'DISABLED')
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'user_roles';

-- If the above query shows rls_enabled = false, RLS is successfully disabled
-- If it shows rls_enabled = true, RLS is still enabled (this shouldn't happen)

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- After running this script, try updating a user's role in the admin panel.
-- The error should be gone and role updates should work.
-- ============================================================================

