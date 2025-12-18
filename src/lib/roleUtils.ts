import { supabase } from '@/integrations/supabase/client';

/**
 * Get the list of admin emails from environment variables
 */
export function getAdminEmails(): string[] {
  const adminEmailsEnv = import.meta.env.VITE_ADMIN_EMAILS || '';
  console.log('[roleUtils] Admin emails env:', adminEmailsEnv);

  const emails = adminEmailsEnv
    .split(',')
    .map((email: string) => email.trim())
    .filter((email: string) => email.length > 0);

  console.log('[roleUtils] Parsed admin emails:', emails);
  return emails;
}

/**
 * Check if an email is an admin email
 */
export function isAdminEmail(email: string): boolean {
  const adminEmails = getAdminEmails();
  const isAdmin = adminEmails.includes(email.toLowerCase());
  console.log('[roleUtils] Is admin check:', { email, isAdmin, adminEmails });
  return isAdmin;
}

/**
 * Ensure a user has the correct role based on their email
 */
export async function ensureUserRole(userId: string, userEmail: string): Promise<string> {
  console.log('[roleUtils] ensureUserRole called:', { userId, userEmail });

  if (!supabase) {
    console.error('[roleUtils] Supabase client not available');
    return 'client';
  }

  try {
    // Fetch user's actual roles from database
    console.log('[roleUtils] Fetching user roles from database...');
    const { data: roleData, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    if (error) {
      console.error('[roleUtils] Error fetching user roles:', error);
      console.log('[roleUtils] Error code:', error.code);

      // If RLS is blocking the query, try with admin email as fallback
      const adminEmail = isAdminEmail(userEmail);
      if (adminEmail) {
        console.log('[roleUtils] RLS error but email is admin - returning admin');
        return 'admin';
      }

      return 'client'; // Default to client on error
    }

    console.log('[roleUtils] User roles from database:', roleData);

    // Determine the primary role
    if (roleData?.some((r) => r.role === 'admin')) {
      console.log('[roleUtils] User is admin');
      return 'admin';
    }
    if (roleData?.some((r) => r.role === 'staff')) {
      console.log('[roleUtils] User is staff');
      return 'staff';
    }

    console.log('[roleUtils] User is client');
    return 'client';
  } catch (error) {
    console.error('[roleUtils] Unexpected error in ensureUserRole:', error);

    // Fallback: if admin email, treat as admin
    if (isAdminEmail(userEmail)) {
      console.log('[roleUtils] Exception caught but email is admin - returning admin');
      return 'admin';
    }

    return 'client';
  }
}

/**
 * Get the redirect path based on user role
 */
export function getRedirectPath(role: string): string {
  console.log('[roleUtils] getRedirectPath:', role);

  if (role === 'admin') {
    console.log('[roleUtils] Redirecting admin to admin dashboard');
    return '/admin/dashboard';
  }

  if (role === 'staff') {
    console.log('[roleUtils] Redirecting staff to staff workspace');
    return '/staff';
  }

  console.log('[roleUtils] Redirecting to client portal');
  return '/client-portal';
}
