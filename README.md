<div align="center">

<img src="assets/Banner.png" alt="Dubiqo Banner" />

# DUBIQO

_Empowering Innovation, Accelerating Success Every Step_

<img src="https://img.shields.io/github/last-commit/bhataakib02/Dubiqo?style=flat&logo=git&logoColor=white&color=4c4c4c" />
<img src="https://img.shields.io/badge/TypeScript-97.4%25-3178C6?style=flat&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Languages-6-0A66C2?style=flat&logo=codefactor&logoColor=white" />
<img src="https://img.shields.io/badge/Framework-React-61DAFB?style=flat&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Build-Vite-646CFF?style=flat&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/Platform-Web-22C55E?style=flat&logo=googlechrome&logoColor=white" />
<img src="https://img.shields.io/badge/Status-Production%20Ready-16A34A?style=flat&logo=vercel&logoColor=white" />

<br/>

### Built with the tools and technologies

<img src="https://skillicons.dev/icons?i=markdown,npm,js,ts,react,vite,css,docker,githubactions,vitest,nodejs,postgres,git&theme=light" />
<img src="https://img.shields.io/badge/PostCSS-DD3A0A?style=flat&logo=postcss&logoColor=white" />
<img src="https://img.shields.io/badge/Autoprefixer-DD3735?style=flat&logo=autoprefixer&logoColor=white" />
<img src="https://img.shields.io/badge/React_Hook_Form-EC5990?style=flat&logo=react-hook-form&logoColor=white" />

</div>

# Dubiqo Digital Solutions - Enterprise Platform

**Tagline:** "We build websites that build your business."

Complete, production-ready, enterprise-grade platform built with React + Vite + TypeScript + Tailwind CSS + Supabase.

## 🚀 Features

# Dubiqo Digital Solutions - Enterprise Platform

**Tagline:** "We build websites that build your business."

Complete, production-ready, enterprise-grade platform built with React + Vite + TypeScript + Tailwind CSS + Supabase.

## 🚀 Features

### Frontend

- ✅ Modern React 18 + Vite + TypeScript
- ✅ Tailwind CSS with custom design system
- ✅ Shadcn UI components
- ✅ Responsive design throughout
- ✅ SEO optimized
- ✅ PWA support ready

### Backend (Supabase)

- ✅ Authentication (Email/Password, OAuth - Google/GitHub)
- ✅ PostgreSQL database with RLS policies
- ✅ File storage
- ✅ Edge Functions (serverless)
- ✅ Real-time subscriptions
- ✅ Role-Based Access Control (RBAC)

### Public Pages

- Home / Landing
- Services (Websites, Portfolios, Billing Systems, Dashboards, Troubleshooting, Maintenance)
- Portfolio & Case Studies
- Pricing
- About
- Blog
- Contact & Support
- FAQ
- Quote Calculator
- Booking System
- Downloads
- Legal (Privacy, Terms, Refund, SLA)

### Authentication System

- Unified login (no role selection)
- Auto-redirect based on user role:
  - `admin`/`staff` → `/admin/dashboard`
  - `client` → `/client-portal`
- OAuth support (Google, GitHub)
- Email auto-confirm enabled for development

### Hidden Admin Portal

**Path:** `/admin/*` (NO public links anywhere)

- Blocked in robots.txt
- Protected by RLS policies
- Requires admin/staff role
- Features:
  - Dashboard with statistics
  - User management
  - Project management
  - Quote management
  - Booking management
  - Invoice management
  - Ticket system
  - Audit logs
  - Analytics

### Database Schema

Comprehensive schema with:

- `profiles` - User profiles
- `user_roles` - RBAC (admin, staff, client)
- `projects` - Client projects
- `quotes` - Quote requests
- `bookings` - Consultation bookings
- `invoices` & `payments` - Billing
- `tickets` & `ticket_messages` - Support system
- `blog_posts` - Content management
- `case_studies` - Portfolio
- `downloads` - File management
- `audit_logs` - Security tracking
- `telemetry_events` - Analytics
- `feature_flags` - Feature toggles
- `consent_logs` - GDPR compliance

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

Configure your Supabase project:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon/public key
- `VITE_SUPABASE_PROJECT_ID` - Your Supabase project ID

Create a `.env` file with these variables.

### First Run

1. The app will run on `http://localhost:5173`
2. Sign up to create your first account (becomes a client by default)
3. To create an admin user, manually update the `user_roles` table in Supabase

## 🔐 Security

### Authentication

- Email/password with secure hashing
- OAuth providers (Google, GitHub)
- Session management with Supabase
- Auto-redirect based on role

### Authorization (RLS)

- Row Level Security on all tables
- Role-based policies (admin, staff, client)
- Clients can only see their own data
- Staff/Admin have appropriate elevated access
- Public content (blog, case studies) accessible to all when published

### Admin Access

- Hidden admin portal (no public links)
- Blocked from search engines (robots.txt)
- Protected routes with role checking
- Audit logging for all admin actions

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/              # Layout components
│   ├── ui/                  # Shadcn UI components
│   ├── ChatWidget.tsx       # Support chat
│   └── ProtectedRoute.tsx   # Auth wrapper
├── pages/
│   ├── admin/               # Hidden admin portal
│   ├── services/            # Service pages
│   ├── legal/               # Legal pages
│   └── ...                  # Public pages
├── integrations/
│   └── supabase/            # Supabase client
├── utils/
│   └── emailService.ts      # EmailJS integration
└── hooks/                   # Custom React hooks
```

## 🔧 Key Technologies

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **UI:** Shadcn UI, Lucide Icons
- **Routing:** React Router v6
- **Backend:** Supabase
- **Auth:** Supabase Auth
- **Database:** PostgreSQL with RLS
- **Storage:** Supabase Storage
- **Functions:** Edge Functions (TypeScript)
- **Email:** EmailJS (optional integration)

## 🚢 Deployment

### Frontend

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Deploy to:

- Vercel (recommended)
- Netlify
- Any static hosting

### Backend

Deploy to Supabase:

- Database migrations (via Supabase CLI or Dashboard)
- Edge Functions (via Supabase CLI)
- Storage buckets (via Supabase Dashboard)
- RLS policies (via migrations)

## 📊 Admin Features

### Dashboard

- User statistics
- Project overview
- Quote requests
- Booking calendar
- Invoice tracking
- Ticket status
- Real-time updates

### User Management

- View all users
- Manage roles
- Activity tracking
- Profile management

### Project Management

- All client projects
- Status tracking
- Assignment
- Timeline view

### Analytics

- Usage statistics
- Performance metrics
- User behavior
- Revenue tracking

## 🔒 RBAC System

### Roles

1. **client** (default)
   - Own data access only
   - View own projects, quotes, invoices
   - Create tickets
   - Access client portal

2. **staff**
   - View all data
   - Manage projects, quotes, bookings
   - Respond to tickets
   - Access admin portal

3. **admin**
   - Full system access
   - User management
   - Role assignment
   - System configuration
   - Audit log access

## 📝 Important Notes

### Careers Module

**REMOVED ENTIRELY** as per requirements. No career pages, application system, or related functionality.

### Hidden Admin Portal

- Never appears in public navigation
- Not linked from any public page
- Blocked in robots.txt
- Meta tags: `noindex, nofollow`
- Access only via direct URL for authenticated admin/staff

### Auto-Confirm Email

Enabled for development. In production, disable and configure proper email service.

### Sample Data

Includes seed data for:

- Blog posts (5)
- Case studies (3)
- Downloads (3)
- Feature flags

## 🤝 Contributing

This is a private project for Dubiqo Digital Solutions.

## 📄 License

Private & Proprietary - Dubiqo Digital Solutions

## 🆘 Support

For internal support:

- Check documentation in `/docs`
- Review backend in Supabase Dashboard
- Check audit logs for admin actions

---

**Built with ❤️ by Dubiqo Digital Solutions**
