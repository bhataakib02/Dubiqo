-- Add public read access to active pricing plans
-- This allows the public pricing page to display active plans

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Public can view active pricing plans" ON public.pricing_plans;

-- Create public read policy for active pricing plans
CREATE POLICY "Public can view active pricing plans"
  ON public.pricing_plans FOR SELECT
  USING (active = true);

