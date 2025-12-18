-- Verify and Fix Admin Role
-- Run this in Supabase SQL Editor to ensure admin role is assigned

-- Step 1: Check current role status
SELECT 
  u.email,
  u.id as user_id,
  ur.role,
  ur.created_at as role_created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'thefreelancer2076@gmail.com';

-- Step 2: Assign admin role (run this if role is missing)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'thefreelancer2076@gmail.com'
ON CONFLICT (user_id, role) DO UPDATE SET role = 'admin';

-- Step 3: Verify it worked
SELECT 
  u.email,
  ur.role,
  CASE 
    WHEN ur.role = 'admin' THEN '✅ Admin role assigned'
    WHEN ur.role IS NULL THEN '❌ No role assigned'
    ELSE '⚠️ Role: ' || ur.role
  END as status
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'thefreelancer2076@gmail.com';

-- Step 4: Check all user roles
SELECT 
  u.email,
  ur.role,
  p.full_name
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY ur.role NULLS LAST, u.email;
