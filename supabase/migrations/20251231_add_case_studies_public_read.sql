-- Add public read access to case studies
-- This allows the public case studies page to display studies

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Public can view published case studies" ON public.case_studies;
DROP POLICY IF EXISTS "Public can view case studies" ON public.case_studies;

-- Create public read policy for case studies
-- Show all case studies (published field filtering is handled in application code)
CREATE POLICY "Public can view case studies"
  ON public.case_studies FOR SELECT
  USING (true);

