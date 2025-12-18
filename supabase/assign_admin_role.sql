-- Assign Admin Role to thefreelancer2076@gmail.com
-- Run this in Supabase SQL Editor

-- Step 1: Check if user exists
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'thefreelancer2076@gmail.com';

-- Step 2: Assign admin role (run this after confirming user exists)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'thefreelancer2076@gmail.com'
ON CONFLICT (user_id, role) DO UPDATE SET role = 'admin';

-- Step 3: Verify the role was assigned
SELECT 
  u.email,
  ur.role,
  p.full_name,
  p.company_name
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'thefreelancer2076@gmail.com';

-- Step 4: If user doesn't exist, you need to create them first via:
-- Supabase Dashboard → Authentication → Users → Add User
-- Email: thefreelancer2076@gmail.com
-- Password: Blackbird@12.
-- Then run Step 2 again

-- Quick one-liner to assign admin role:
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'thefreelancer2076@gmail.com'
ON CONFLICT (user_id, role) DO UPDATE SET role = 'admin';
