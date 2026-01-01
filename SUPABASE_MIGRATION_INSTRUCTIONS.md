# Database Migration Instructions

## Fix Pricing Plans and Discount Banners

To fix the pricing plans `published` column error and ensure discount banners work correctly, run the following migration:

### Option 1: Using Supabase CLI (Recommended)

```bash
# If you have Supabase CLI installed
supabase db push supabase/fix_pricing_and_discount_banners.sql
```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/fix_pricing_and_discount_banners.sql`
4. Click "Run" to execute the migration

### Option 3: Using psql (if you have direct database access)

```bash
psql -h <your-db-host> -U postgres -d postgres -f supabase/fix_pricing_and_discount_banners.sql
```

## What This Migration Does

1. **Adds `published` column to `pricing_plans` table**
   - Adds the missing `published` boolean column
   - Sets default value to `false`
   - Updates existing active plans to be published by default

2. **Creates/ensures `feature_flags` table exists**
   - Creates the table with proper structure (id, name, description, enabled, config, timestamps)
   - Adds indexes for performance
   - Sets up Row Level Security (RLS) policies:
     - Public users can read enabled feature flags (for discount banners on public pages)
     - Authenticated users can read all feature flags
     - Admins can manage all feature flags
   - Adds trigger to automatically update `updated_at` timestamp

## After Running the Migration

1. Refresh your Supabase schema cache (if using Supabase Dashboard, it should auto-refresh)
2. If your pricing plans are not showing, run the additional fix: `supabase/fix_publish_existing_plans.sql`
   - This will publish all existing active plans
   - Or go to Admin → Pricing and manually publish each plan
3. Restart your development server if needed
4. The pricing plans update should now work without errors
5. Discount banners should display correctly on the pricing page

## Quick Fix for Plans Not Showing

If pricing plans are not showing on the public page, run this quick fix:

```sql
-- Publish all existing active plans
UPDATE pricing_plans 
SET published = true 
WHERE active = true AND (published IS NULL OR published = false);
```

Or use the file: `supabase/fix_publish_existing_plans.sql`

## Troubleshooting

If you encounter any issues:

1. Check that you're running the migration with appropriate database privileges
2. Verify the migration ran successfully by checking:
   - `pricing_plans` table has a `published` column
   - `feature_flags` table exists
3. If RLS policies cause issues, you may need to adjust them based on your security requirements

