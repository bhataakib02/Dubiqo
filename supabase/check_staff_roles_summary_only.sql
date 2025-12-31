-- ============================================================================
-- SUMMARY QUERY ONLY - Check Staff Roles
-- ============================================================================
-- Run this if you only want the summary statistics
-- ============================================================================

SELECT 
  'SUMMARY' as report_type,
  (SELECT COUNT(*) FROM public.profiles WHERE email LIKE 'staff%@example.com') as staff_profiles_count,
  (SELECT COUNT(*) 
   FROM public.user_roles ur 
   INNER JOIN public.profiles p ON p.id = ur.user_id 
   WHERE p.email LIKE 'staff%@example.com' AND ur.role IN ('staff', 'admin')) as staff_with_roles_count;

