-- Fix RLS and permissions for user_roles table

-- Disable RLS on user_roles table
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Create a function that assigns roles (will be called from client)
CREATE OR REPLACE FUNCTION public.assign_user_role(user_id UUID, role_name TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Delete conflicting role if needed
  IF role_name = 'admin' THEN
    DELETE FROM public.user_roles 
    WHERE user_id = user_id AND role = 'client';
  END IF;

  -- Try to insert the new role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (user_id, role_name)
  ON CONFLICT (user_id, role) DO NOTHING;

  result := jsonb_build_object(
    'success', true,
    'message', 'Role assigned successfully',
    'role', role_name
  );

  RETURN result;
EXCEPTION WHEN OTHERS THEN
  result := jsonb_build_object(
    'success', false,
    'message', SQLERRM,
    'error_code', SQLSTATE
  );
  RETURN result;
END;
$$;

-- Make sure RLS is disabled
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Verify the table configuration
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'user_roles' AND schemaname = 'public';

