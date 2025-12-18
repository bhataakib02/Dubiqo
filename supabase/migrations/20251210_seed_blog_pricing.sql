-- Seed migration: insert sample blog post and pricing plan
-- Run this in your Supabase SQL editor to add sample rows used by the admin pages.

-- Sample blog post (author_id left NULL — replace with a profile UUID if desired)
INSERT INTO public.blog_posts (author_id, title, slug, content, excerpt, category, tags, featured_image, published, published_at)
SELECT * FROM (
  SELECT
    NULL::uuid AS author_id,
    'Welcome to Dubiqo'::text AS title,
    'welcome-to-dubiqo'::text AS slug,
    '<p>This is a sample blog post created to verify the admin UI.</p>'::text AS content,
    'Sample post to verify admin blog list'::text AS excerpt,
    'Announcements'::text AS category,
    ARRAY['sample','seed']::text[] AS tags,
    'https://via.placeholder.com/800x300.png?text=Blog+Sample'::text AS featured_image,
    true AS published,
    now()::timestamptz AS published_at
) AS vals
WHERE NOT EXISTS (
  SELECT 1 FROM public.blog_posts bp WHERE bp.slug = 'welcome-to-dubiqo'
);

-- Sample pricing plan
INSERT INTO public.pricing_plans (name, price_cents, interval, currency, features, active)
SELECT * FROM (
  SELECT
    'Starter'::text AS name,
    49900::bigint AS price_cents,
    'monthly'::text AS interval,
    'INR'::text AS currency,
    ARRAY['1 project','Email support','Basic analytics']::text[] AS features,
    true AS active
) AS vals
WHERE NOT EXISTS (
  SELECT 1 FROM public.pricing_plans pp WHERE pp.name = 'Starter'
);

-- Optional: grant admin role to a specific user (replace <USER_UUID> and run separately)
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('<USER_UUID>', 'admin')
-- ON CONFLICT (user_id, role) DO NOTHING;

-- Notes:
-- 1) Run this file in Supabase SQL editor (Primary Database, Role: postgres) or paste the statements manually.
-- 2) If your admin UI still shows 'Failed to load', check the browser console and the Network tab for the PostgREST response.
-- 3) If your app uses strict RLS policies, ensure the authenticated user has an 'admin' or 'staff' role in public.user_roles.
