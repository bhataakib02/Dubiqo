-- ============================================================================
-- ASSIGN ADMIN ROLE - Quick Admin Role Assignment
-- ============================================================================
--
-- PURPOSE: Assign admin role to an existing user
-- USE THIS WHEN:
--   - You need to make an existing user an admin
--   - You don't want to run the full database reset
--   - You want to assign admin role to multiple users (modify email)
--
-- WHAT THIS DOES:
--   1. Assigns 'admin' role to specified user in user_roles table
--   2. Creates/updates user profile if it doesn't exist
--   3. Verifies the admin role was assigned
--
-- IMPORTANT NOTES:
--   - User MUST exist in auth.users first (create in Supabase Dashboard)
--   - This script is for ONE user at a time
--   - To assign to different user, change the email in WHERE clause
--   - Safe to run multiple times (uses ON CONFLICT)
--
-- WHEN TO USE THIS vs COMPLETE_RESET.sql:
--   - Use THIS: When database already exists, just need to add admin
--   - Use COMPLETE_RESET.sql: When setting up from scratch or resetting
--
-- STEPS:
--   1. Create user in Supabase Dashboard:
--      - Go to: Authentication → Users → "Add user"
--      - Email: thefreelancer2076@gmail.com
--      - Password: Blackbird@12
--      - Check "Auto Confirm User"
--      - Click "Create user"
--   2. Run this script to assign admin role
--
-- ============================================================================

-- CRITICAL: Ensure RLS is disabled on user_roles (prevents recursion)
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Assign admin role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'thefreelancer2076@gmail.com'
ON CONFLICT (user_id, role) DO UPDATE SET role = 'admin';

-- Ensure profile exists
INSERT INTO public.profiles (id, email, full_name)
SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', 'Admin User')
FROM auth.users 
WHERE email = 'thefreelancer2076@gmail.com'
ON CONFLICT (id) DO UPDATE SET 
  email = 'thefreelancer2076@gmail.com',
  full_name = COALESCE(EXCLUDED.full_name, profiles.full_name);

-- Verify admin role was assigned
SELECT 
  u.email,
  ur.role,
  CASE WHEN ur.role = 'admin' THEN '✅ Admin role assigned successfully!' 
       ELSE '❌ Admin role NOT assigned' 
  END as status
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'thefreelancer2076@gmail.com';

