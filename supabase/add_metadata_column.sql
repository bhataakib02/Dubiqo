-- ============================================================================
-- ADD METADATA COLUMN TO PROFILES
-- ============================================================================
-- This script adds the metadata column to profiles table for storing
-- descriptive roles (e.g., "backend developer", "ui/ux designer")
-- ============================================================================

-- Add metadata column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'metadata'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN metadata jsonb DEFAULT '{}'::jsonb;
    RAISE NOTICE '✅ Added metadata column to profiles table';
  ELSE
    RAISE NOTICE 'ℹ️ metadata column already exists in profiles table';
  END IF;
END $$;

-- Verify the column was added
SELECT 
  'Verification' as status,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'metadata'
    ) THEN '✅ metadata column exists'
    ELSE '❌ metadata column NOT found'
  END as result;

