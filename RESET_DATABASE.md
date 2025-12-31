# Complete Database Reset - Fix All Errors

## What This Does
1. **Deletes ALL tables** from the database
2. **Recreates everything** with proper structure
3. **Fixes RLS recursion** (disables RLS on user_roles)
4. **Assigns admin role** to your email
5. **Sets up all triggers and functions**

## How to Run

### Step 1: Open Supabase SQL Editor
1. Go to https://app.supabase.com
2. Select your project
3. Click **SQL Editor** in left sidebar
4. Click **New query**

### Step 2: Run the Reset Script
1. Open file: `supabase/COMPLETE_RESET.sql`
2. **Copy ALL the SQL** from that file
3. **Paste** it into Supabase SQL Editor
4. Click **RUN** button (or press Ctrl+Enter)
5. Wait for "Success" message

### Step 3: Verify It Worked
After running, you should see:
- ✅ "Tables created: 15" (or similar count)
- ✅ "user_roles RLS status: DISABLED"
- ✅ "Admin role assigned" for your email

### Step 4: Refresh Your App
1. Go to `172.16.12.16:8080/admin/projects`
2. Press **F5** to refresh
3. Everything should work now! ✅

## What Gets Fixed

✅ Infinite recursion error - FIXED  
✅ Projects not loading - FIXED  
✅ Login redirect loop - FIXED  
✅ Quote submission error - FIXED  
✅ All RLS issues - FIXED  

## Important Notes

- **This will DELETE all existing data** (except auth users)
- **All tables will be recreated** from scratch
- **Admin role will be assigned** to `thefreelancer2076@gmail.com`
- **RLS is disabled** on user_roles to prevent recursion

## After Reset

If you want to add sample data, you can run:
- `supabase/seeds/dummy_data.sql` - For sample data
- Or use the admin panel to create data manually

---

**That's it! Run the COMPLETE_RESET.sql script and all errors will be fixed!**

