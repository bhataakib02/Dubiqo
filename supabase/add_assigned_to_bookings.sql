-- ============================================================================
-- ADD ASSIGNED_TO COLUMN TO BOOKINGS TABLE
-- ============================================================================
-- This script adds the assigned_to column to bookings table for staff assignment
-- ============================================================================

-- Add assigned_to column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'bookings' 
    AND column_name = 'assigned_to'
  ) THEN
    ALTER TABLE public.bookings 
    ADD COLUMN assigned_to uuid REFERENCES public.profiles(id) ON DELETE SET NULL;
    
    -- Add index for better query performance
    CREATE INDEX IF NOT EXISTS idx_bookings_assigned_to ON public.bookings(assigned_to);
    
    RAISE NOTICE '✅ Added assigned_to column to bookings table';
  ELSE
    RAISE NOTICE 'ℹ️ assigned_to column already exists in bookings table';
  END IF;
END $$;

-- Verify the column was added
SELECT 
  'Verification' as status,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'bookings' 
      AND column_name = 'assigned_to'
    ) THEN '✅ assigned_to column exists'
    ELSE '❌ assigned_to column NOT found'
  END as result;

