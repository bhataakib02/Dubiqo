# Supabase Database Scripts

This folder contains SQL scripts for database setup and management.

## 📋 Scripts Overview

### 🚀 `COMPLETE_RESET.sql` - Full Database Setup
**When to use:**
- Setting up database for the first time
- Need to completely reset and recreate everything
- Want all tables, functions, triggers, and policies in one script

**What it does:**
- Drops all existing tables, functions, and triggers
- Creates all tables with proper structure
- Creates all functions and triggers
- Enables RLS and creates all security policies
- Assigns admin role to thefreelancer2076@gmail.com

**⚠️ Warning:** This will DELETE ALL DATA in public schema!

---

### 👤 `ASSIGN_ADMIN_ROLE.sql` - Quick Admin Assignment
**When to use:**
- Database already exists, just need to add admin role
- Want to assign admin to an existing user
- Don't want to run full database reset

**What it does:**
- Assigns 'admin' role to specified user
- Creates/updates user profile
- Verifies admin role was assigned

**⚠️ Note:** User must exist in auth.users first (create in Dashboard)

---

### 🔒 `policies/complete_rls_policies.sql` - RLS Policies Only
**When to use:**
- Tables already exist
- Only need to apply/update RLS policies
- Don't want to recreate everything

**What it does:**
- Enables RLS on all tables (except user_roles)
- Creates all security policies
- Safe to run multiple times

---

## 📖 Usage Guide

### First Time Setup
1. Create user in Supabase Dashboard (Authentication → Users)
2. Run `COMPLETE_RESET.sql` - This sets up everything

### Add Another Admin User
1. Create user in Supabase Dashboard
2. Run `ASSIGN_ADMIN_ROLE.sql` (modify email in script)

### Update Only Policies
1. Run `policies/complete_rls_policies.sql`

---

## 🔄 File Relationships

```
COMPLETE_RESET.sql
├── Creates all tables
├── Creates all functions/triggers
└── Includes all RLS policies (same as policies/complete_rls_policies.sql)

ASSIGN_ADMIN_ROLE.sql
└── Standalone script (doesn't depend on other files)

policies/complete_rls_policies.sql
└── Extracted from COMPLETE_RESET.sql (for reuse)
```

---

## ⚠️ Important Notes

- **user_roles table**: RLS is DISABLED to prevent infinite recursion
- All scripts are idempotent (safe to run multiple times)
- Always create users in Dashboard before assigning roles
- Use service_role key for admin operations

---

## 🆘 Troubleshooting

**"User not found" error:**
- Create user in Supabase Dashboard first
- Then run the script

**"Permission denied" error:**
- Check if RLS policies are applied
- Run `policies/complete_rls_policies.sql`

**"Infinite recursion" error:**
- Make sure user_roles table has RLS disabled
- Check COMPLETE_RESET.sql was run correctly
