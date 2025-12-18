# Deployment Guide

## Frontend Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify

1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

### Docker

```bash
docker build -t dubiqo-frontend .
docker run -p 80:80 dubiqo-frontend
```

## Edge Functions Deployment

Deploy using Supabase CLI:

```bash
supabase functions deploy <function-name> --project-ref <project-ref>
```

Or use GitHub Actions (see `.github/workflows/deploy.yml`)

## Environment Variables

Required variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

Optional:

- `VITE_SENTRY_DSN`
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

## Database Migrations

Run migrations before deployment:

```bash
npm run migrate
```

## Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] RLS policies enabled
- [ ] Error monitoring configured (Sentry)
- [ ] Analytics configured
- [ ] SSL certificate configured
- [ ] CDN configured (optional)
- [ ] Backup strategy in place
