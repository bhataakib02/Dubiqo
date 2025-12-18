# Database Reset and Seed Instructions

This guide explains how to reset your Supabase database and populate it with dummy data.

## ⚠️ WARNING

**Running the reset script will DELETE ALL EXISTING DATA** in the following tables:

- ticket_messages
- tickets
- bookings
- payments
- invoices
- quotes
- projects
- downloads
- feature_flags
- case_studies
- portfolio_items
- audit_logs
- user_roles
- profiles

**Back up your data before proceeding!**

## Step 1: Run the Reset Script

The reset script will:

1. Drop all existing tables (in dependency order)
2. Recreate the schema from scratch
3. Set up triggers for profile creation on signup
4. Configure RLS policies

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file: `supabase/migrations/20251208_reset_schema.sql`
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **Run** or press `Ctrl+Enter`

### Option B: Using Supabase CLI

```bash
# Make sure you're connected to your Supabase project
supabase db reset

# Or run the migration directly
supabase db push --file supabase/migrations/20251208_reset_schema.sql
```

## Step 2: Create Test Users (Required for Seed Data)

Before running the seed script, you need to create users in Supabase Auth. The seed script references these users.

### Create Users via Supabase Dashboard:

1. Go to **Authentication** → **Users**
2. Click **Add User** → **Create New User**
3. Create the following users:

| Email                       | Password      | Role   |
| --------------------------- | ------------- | ------ |
| thefreelancer2076@gmail.com | Blackbird@12. | admin  |
| staff@dubiqo.com            | 123           | staff  |
| client1@example.com         | 123           | client |
| client2@example.com         | 123           | client |
| client3@example.com         | 123           | client |

**Important:** After creating each user, note down their User ID (UUID) from the Users table.

### Update Seed File with Actual User IDs:

1. Open `supabase/seeds/dummy_data.sql`
2. Find the section with placeholder UUIDs:
   ```sql
   admin_user_id uuid := '00000000-0000-0000-0000-000000000001';
   ```
3. Replace each UUID with the actual User ID from Supabase Auth
4. Save the file

### Alternative: Get User IDs via SQL

Run this in Supabase SQL Editor to get all user IDs:

```sql
SELECT id, email FROM auth.users ORDER BY created_at;
```

Then update the seed file with the actual UUIDs.

## Step 3: Run the Seed Script

### Option A: Using Supabase Dashboard

1. Go to **SQL Editor**
2. Open the file: `supabase/seeds/dummy_data.sql`
3. Copy the entire contents
4. Paste into the SQL Editor
5. Click **Run** or press `Ctrl+Enter`

### Option B: Using Supabase CLI

```bash
supabase db seed --file supabase/seeds/dummy_data.sql
```

## Step 4: Verify Data

After running both scripts, verify the data was created:

```sql
-- Check profiles
SELECT id, email, full_name, company_name FROM public.profiles;

-- Check user roles
SELECT ur.user_id, ur.role, p.email
FROM public.user_roles ur
JOIN public.profiles p ON ur.user_id = p.id;

-- Check projects
SELECT id, title, status, budget FROM public.projects LIMIT 5;

-- Check invoices
SELECT invoice_number, total_amount, status FROM public.invoices LIMIT 5;

-- Check tickets
SELECT title, status, priority FROM public.tickets LIMIT 5;
```

## What Gets Created

The seed script creates:

- **5 Profiles** (1 admin, 1 staff, 3 clients)
- **5 User Roles** (admin, staff, 3 clients)
- **6 Projects** (various statuses and types)
- **5 Quotes** (some approved, some pending)
- **5 Bookings** (various dates and statuses)
- **6 Invoices** (paid, pending, overdue)
- **Payments** (for paid invoices)
- **8 Tickets** (various statuses and priorities)
- **12 Ticket Messages** (initial messages and replies)
- **6 Downloads** (resource files)
- **8 Feature Flags** (various settings)
- **8 Portfolio Items** (sample projects)
- **5 Case Studies** (success stories)
- **6 Audit Logs** (sample activity)

## Signup Flow

When a new user signs up through the app:

1. User signs up via `Auth.tsx` using `supabase.auth.signUp()`
2. Supabase Auth creates the user in `auth.users`
3. The `handle_new_user()` trigger automatically:
   - Creates a profile in `public.profiles` with email and full_name
   - Assigns default 'client' role in `public.user_roles`
4. User is redirected based on their role

**No manual profile creation needed** - it's all automatic!

## Troubleshooting

### Error: "relation does not exist"

- Make sure you ran the reset script first
- Check that all tables were created successfully

### Error: "foreign key constraint violation"

- Ensure users exist in `auth.users` before running seed
- Verify user IDs in seed file match actual user IDs

### Error: "duplicate key value"

- The seed script uses `ON CONFLICT DO NOTHING` - safe to run multiple times
- If you see this, data already exists (which is fine)

### Users not getting profiles on signup

- Check that the `handle_new_user()` trigger exists:
  ```sql
  SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
  ```
- Verify the trigger function:
  ```sql
  SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
  ```

## Next Steps

After resetting and seeding:

1. Test signup flow - create a new user and verify profile is created
2. Test login - verify role-based redirects work
3. Test admin portal - login as thefreelancer2076@gmail.com
4. Test client portal - login as client1@example.com
5. Verify all dummy data appears correctly in admin dashboard

## Production Notes

**DO NOT run these scripts in production** without:

1. Full database backup
2. Maintenance window
3. Testing in staging first
4. Approval from team lead

For production, use proper migration tools and seed only through controlled processes.
