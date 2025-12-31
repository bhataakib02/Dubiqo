import { useEffect, useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { isAdminEmail } from '@/lib/roleUtils';
import type { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['app_role'];

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole[];
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const checkAuth = useCallback(async () => {
    if (!supabase) {
      setIsLoading(false);
      setIsAuthorized(false);
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      // If no role required, just check if user is authenticated
      if (!requiredRole || requiredRole.length === 0) {
        setIsAuthorized(true);
        setIsLoading(false);
        return;
      }

      // Check user role
      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id);

      let userRole: UserRole = 'client'; // Default to client

      if (error) {
        console.error('Error fetching user roles:', error);
        // If RLS error or no role found, check admin email as fallback
        const userEmail = session.user.email;
        if (userEmail && isAdminEmail(userEmail)) {
          userRole = 'admin';
        }
      } else if (roleData && roleData.length > 0) {
        // Get the highest priority role (admin > staff > client)
        if (roleData.some((r) => r.role === 'admin')) {
          userRole = 'admin';
        } else if (roleData.some((r) => r.role === 'staff')) {
          userRole = 'staff';
        }
      } else {
        // No role in database, check admin email as fallback
        const userEmail = session.user.email;
        if (userEmail && isAdminEmail(userEmail)) {
          userRole = 'admin';
        }
      }

      // Check if user has any of the required roles
      const hasRequiredRole = requiredRole.includes(userRole);

      if (hasRequiredRole) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthorized(false);
    } finally {
      setIsLoading(false);
    }
  }, [requiredRole]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
