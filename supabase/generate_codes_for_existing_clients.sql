-- ============================================================================
-- GENERATE CLIENT CODES FOR EXISTING CLIENTS
-- ============================================================================
--
-- PURPOSE: Generate client codes for existing clients who don't have codes yet
-- USE THIS WHEN:
--   - You have existing clients without client codes
--   - You want to backfill client codes for all existing clients
--   - You want to test the client code generation system
--
-- WHAT THIS DOES:
--   1. Finds all clients (users with 'client' role) without client codes
--   2. Generates unique client codes for each of them
--   3. Verifies that staff/admin don't get codes
--   4. Shows a summary of what was done
--
-- IMPORTANT NOTES:
--   - Only generates codes for users with 'client' role
--   - Staff and admin users will NOT get codes
--   - Format: CLIENT01, CLIENT02, CLIENT03, etc.
--
-- ============================================================================

-- First, ensure the generate_client_code function exists
-- (This should already exist if you ran auto_generate_client_code.sql)
-- If not, the script will fail with a helpful error

-- Generate codes for existing clients without codes
DO $$
DECLARE
  client_record RECORD;
  new_code text;
  updated_count integer := 0;
BEGIN
  -- Loop through all clients without codes
  FOR client_record IN
    SELECT p.id, p.email, p.full_name
    FROM public.profiles p
    INNER JOIN public.user_roles ur ON p.id = ur.user_id
    WHERE ur.role = 'client'
      AND p.client_code IS NULL
    ORDER BY p.created_at ASC
  LOOP
    -- Generate a unique client code
    new_code := public.generate_client_code();
    
    -- Update the profile with the generated code
    UPDATE public.profiles
    SET client_code = new_code
    WHERE id = client_record.id;
    
    updated_count := updated_count + 1;
    
    RAISE NOTICE 'Generated code % for client: % (%)', new_code, client_record.email, COALESCE(client_record.full_name, 'No name');
  END LOOP;
  
  RAISE NOTICE '✅ Successfully generated client codes for % clients', updated_count;
END $$;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Show all clients with their codes
SELECT 
  'CLIENTS' as user_type,
  p.email,
  p.full_name,
  p.client_code,
  ur.role,
  p.created_at
FROM public.profiles p
INNER JOIN public.user_roles ur ON p.id = ur.user_id
WHERE ur.role = 'client'
ORDER BY p.client_code NULLS LAST, p.created_at;

-- Show all staff/admin (should NOT have client codes)
SELECT 
  'STAFF/ADMIN' as user_type,
  p.email,
  p.full_name,
  p.client_code,
  ur.role,
  p.created_at
FROM public.profiles p
INNER JOIN public.user_roles ur ON p.id = ur.user_id
WHERE ur.role IN ('staff', 'admin')
ORDER BY ur.role, p.created_at;

-- Summary count
SELECT 
  'SUMMARY' as report_type,
  COUNT(*) FILTER (WHERE ur.role = 'client' AND p.client_code IS NOT NULL) as clients_with_codes,
  COUNT(*) FILTER (WHERE ur.role = 'client' AND p.client_code IS NULL) as clients_without_codes,
  COUNT(*) FILTER (WHERE ur.role IN ('staff', 'admin')) as staff_admin_count,
  COUNT(*) FILTER (WHERE ur.role IN ('staff', 'admin') AND p.client_code IS NOT NULL) as staff_admin_with_codes
FROM public.profiles p
INNER JOIN public.user_roles ur ON p.id = ur.user_id;

-- ============================================================================
-- EXPECTED RESULTS
-- ============================================================================
-- After running this script:
-- ✅ All 5 clients should have client codes (CLIENT01, CLIENT02, etc.)
-- ✅ All 5 staff members should NOT have client codes
-- ✅ The summary should show: 5 clients with codes, 0 clients without codes
-- ============================================================================

