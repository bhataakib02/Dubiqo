# Seed Data - Dummy Data for Testing

## Files

- `dummy_data_complete.sql` - Complete test data (5 clients, 5 staff, all tables)

## Quick Start

### Step 1: Create Users in Supabase Dashboard

Go to **Authentication → Users → Add user** and create:

**5 Clients:**
- `client1@test.com` - Password: `Test123!`
- `client2@test.com` - Password: `Test123!`
- `client3@test.com` - Password: `Test123!`
- `client4@test.com` - Password: `Test123!`
- `client5@test.com` - Password: `Test123!`

**5 Staff:**
- `staff1@test.com` - Password: `Test123!`
- `staff2@test.com` - Password: `Test123!`
- `staff3@test.com` - Password: `Test123!`
- `staff4@test.com` - Password: `Test123!`
- `staff5@test.com` - Password: `Test123!`

For each user:
- ✅ Check **"Auto Confirm User"**
- Click **"Create user"**

### Step 2: Run Seed Script

1. Open Supabase SQL Editor
2. Copy and paste `dummy_data_complete.sql`
3. Click **Run**

### Step 3: Verify

The script will show a summary of all data created.

## What Gets Created

✅ **5 Client Profiles** with company info  
✅ **5 Staff Profiles**  
✅ **5 Projects** (one per client, different statuses)  
✅ **5 Quotes** (different statuses)  
✅ **5 Invoices** (different statuses)  
✅ **3 Payments** (for paid invoices)  
✅ **5 Tickets** (different statuses and priorities)  
✅ **10 Ticket Messages** (conversations)  
✅ **5 Bookings** (consultations)  
✅ **5 Blog Posts** (some published)  
✅ **5 Portfolio Items** (all published)  
✅ **5 Case Studies** (all published)  
✅ **5 Pricing Plans** (all active)  
✅ **5 Downloads** (resources)  
✅ **5 Feature Flags** (some enabled)  
✅ **10 Audit Logs** (activity records)  

## Test Data Details

### Clients
- John Smith - Tech Solutions Inc
- Sarah Johnson - Digital Marketing Pro
- Michael Brown - Creative Design Studio
- Emily Davis - Business Consulting Group
- David Wilson - E-commerce Ventures

### Staff
- Alex Thompson
- Jessica Martinez
- Ryan Anderson
- Lisa Chen
- Chris Taylor

### Projects Status Distribution
- Discovery: 1
- In Progress: 1
- Review: 1
- Completed: 1

### Quotes Status Distribution
- Pending: 2
- Accepted: 2
- Rejected: 1

### Invoices Status Distribution
- Paid: 1
- Pending: 1
- Sent: 1
- Overdue: 1

## Login Credentials

All test users use password: `Test123!`

**Clients:**
- client1@test.com
- client2@test.com
- client3@test.com
- client4@test.com
- client5@test.com

**Staff:**
- staff1@test.com
- staff2@test.com
- staff3@test.com
- staff4@test.com
- staff5@test.com

## Testing All Pages

With this data, you can test:

✅ **Admin Dashboard** - View all data  
✅ **Projects Page** - See projects with different statuses  
✅ **Quotes Page** - See quotes in various states  
✅ **Invoices Page** - See invoices and payments  
✅ **Tickets Page** - See tickets and messages  
✅ **Bookings Page** - See scheduled consultations  
✅ **Users Page** - See all clients and staff  
✅ **Blog Page** - See published posts  
✅ **Portfolio Page** - See portfolio items  
✅ **Case Studies Page** - See case studies  
✅ **Pricing Page** - See pricing plans  
✅ **Downloads Page** - See downloadable resources  

## Notes

- All data is interconnected (projects linked to clients, invoices linked to projects, etc.)
- Some data is published (visible to public), some is not
- Different statuses allow testing of filters and status changes
- Safe to run multiple times (uses ON CONFLICT)

