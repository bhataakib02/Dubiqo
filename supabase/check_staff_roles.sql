-- ============================================================================
-- CHECK STAFF ROLES - Verify Staff Users Have Proper Roles
-- ============================================================================
-- This script helps debug why staff might not be showing up
-- ============================================================================

-- Check all user roles
SELECT 
  'User Roles' as check_type,
  ur.user_id,
  ur.role,
  p.email,
  p.full_name
FROM public.user_roles ur
LEFT JOIN public.profiles p ON p.id = ur.user_id
ORDER BY ur.role, p.email;

-- Check specifically for staff and admin roles
SELECT 
  'Staff and Admin Roles' as check_type,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE ur.role = 'staff') as staff_count,
  COUNT(*) FILTER (WHERE ur.role = 'admin') as admin_count
FROM public.user_roles ur
WHERE ur.role IN ('staff', 'admin');

-- Check staff profiles
SELECT 
  'Staff Profiles' as check_type,
  p.id,
  p.email,
  p.full_name,
  ur.role as base_role
FROM public.profiles p
INNER JOIN public.user_roles ur ON p.id = ur.user_id
WHERE ur.role IN ('staff', 'admin')
ORDER BY p.email;

-- Summary
SELECT 
  'SUMMARY' as report_type,
  (SELECT COUNT(*) FROM public.profiles WHERE email LIKE 'staff%@example.com') as staff_profiles_count,
  (SELECT COUNT(*) 
   FROM public.user_roles ur 
   INNER JOIN public.profiles p ON p.id = ur.user_id 
   WHERE p.email LIKE 'staff%@example.com' AND ur.role IN ('staff', 'admin')) as staff_with_roles_count;

