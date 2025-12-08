-- Complete Setup Script for Dubiqo
-- This script helps set up users and assign roles
-- Run this in Supabase SQL Editor

-- IMPORTANT: Users must be created in Supabase Auth FIRST
-- Go to: Authentication → Users → Add User
-- Create these users:
-- 1. thefreelancer2076@gmail.com / Blackbird@12. (admin)
-- 2. staff@dubiqo.com / 123 (staff)
-- 3. client1@example.com / 123 (client)
-- 4. client2@example.com / 123 (client)
-- 5. client3@example.com / 123 (client)

-- Step 1: Check which users exist
SELECT id, email, created_at 
FROM auth.users 
WHERE email IN (
  'thefreelancer2076@gmail.com',
  'staff@dubiqo.com',
  'client1@example.com',
  'client2@example.com',
  'client3@example.com'
)
ORDER BY email;

-- Step 2: Assign admin role to thefreelancer2076@gmail.com
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'thefreelancer2076@gmail.com'
ON CONFLICT (user_id, role) DO UPDATE SET role = 'admin';

-- Step 3: Assign staff role to staff@dubiqo.com
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'staff' 
FROM auth.users 
WHERE email = 'staff@dubiqo.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 4: Assign client roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'client' 
FROM auth.users 
WHERE email IN ('client1@example.com', 'client2@example.com', 'client3@example.com')
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 5: Verify roles were assigned
SELECT 
  u.email,
  ur.role,
  p.full_name,
  p.company_name
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email IN (
  'thefreelancer2076@gmail.com',
  'staff@dubiqo.com',
  'client1@example.com',
  'client2@example.com',
  'client3@example.com'
)
ORDER BY ur.role, u.email;

-- Step 6: After running the seed script (dummy_data.sql), verify all data
-- Check profiles
SELECT COUNT(*) as profile_count FROM public.profiles;

-- Check user roles
SELECT role, COUNT(*) as count 
FROM public.user_roles 
GROUP BY role;

-- Check projects
SELECT COUNT(*) as project_count FROM public.projects;

-- Check invoices
SELECT COUNT(*) as invoice_count FROM public.invoices;

-- Check tickets
SELECT COUNT(*) as ticket_count FROM public.tickets;
