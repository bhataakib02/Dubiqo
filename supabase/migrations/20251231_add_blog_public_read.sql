-- Add public read access to published blog posts
-- This allows the public blog page to display published posts

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Public can view published blog posts" ON public.blog_posts;

-- Create public read policy for published blog posts
CREATE POLICY "Public can view published blog posts"
  ON public.blog_posts FOR SELECT
  USING (published = true);

-- Add public read access to published case studies
-- This allows the public case studies page to display published studies

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Public can view published case studies" ON public.case_studies;

-- Create public read policy for published case studies
CREATE POLICY "Public can view published case studies"
  ON public.case_studies FOR SELECT
  USING (published = true);

