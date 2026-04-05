import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Lightweight health check for uptime monitors (e.g. UptimeRobot, cron-job.org).
 * Optional: pings Supabase REST so the project sees activity (helps free-tier pause rules).
 * Set the same vars you use for the app in Vercel → Settings → Environment Variables.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.status(405).end();
    return;
  }

  const base = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const key =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (base && key) {
    try {
      await fetch(`${base.replace(/\/$/, '')}/rest/v1/`, {
        method: 'GET',
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      });
    } catch {
      // Still respond OK so your monitor does not flap if Supabase is briefly unreachable.
    }
  }

  res.status(200).setHeader('Cache-Control', 'no-store').json({ ok: true });
}
