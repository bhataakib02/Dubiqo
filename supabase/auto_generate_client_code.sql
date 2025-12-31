-- ============================================================================
-- AUTO-GENERATE CLIENT CODE FOR NEW CLIENTS
-- ============================================================================
--
-- PURPOSE: Automatically generate unique client codes when new clients register
-- USE THIS WHEN:
--   - You want clients to automatically get a client code upon registration
--   - You want to ensure all clients have a unique identifier
--   - You want to avoid manual client code assignment
--
-- WHAT THIS DOES:
--   1. Creates a function to generate unique client codes (CLIENT001, CLIENT002, etc.)
--   2. Creates a trigger that runs after a profile is inserted
--   3. Only generates codes for users with 'client' role
--   4. Skips generation if client_code is already set (manual assignment)
--
-- IMPORTANT NOTES:
--   - Only generates codes for users with 'client' role (not admin/staff)
--   - If client_code is already set, it won't overwrite it
--   - Format: CLIENT01, CLIENT02, CLIENT03, etc. (2 digits)
--   - Codes are unique and sequential
--
-- ============================================================================

-- Function to generate a unique client code
CREATE OR REPLACE FUNCTION public.generate_client_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  next_number integer;
  new_code text;
  code_exists boolean;
BEGIN
  -- Find the highest existing client code number
  SELECT COALESCE(MAX(
    CAST(
      SUBSTRING(client_code FROM 'CLIENT([0-9]+)') AS integer
    )
  ), 0) + 1
  INTO next_number
  FROM public.profiles
  WHERE client_code ~ '^CLIENT[0-9]+$';

  -- Generate the new code (2 digits: CLIENT01, CLIENT02, etc.)
  new_code := 'CLIENT' || LPAD(next_number::text, 2, '0');

  -- Ensure uniqueness (in case of race conditions)
  LOOP
    SELECT EXISTS(
      SELECT 1 FROM public.profiles WHERE client_code = new_code
    ) INTO code_exists;
    
    IF NOT code_exists THEN
      EXIT;
    END IF;
    
    -- If code exists, try next number
    next_number := next_number + 1;
    new_code := 'CLIENT' || LPAD(next_number::text, 2, '0');
  END LOOP;

  RETURN new_code;
END;
$$;

-- Function to check if user is a client (not admin or staff)
CREATE OR REPLACE FUNCTION public.is_client(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  user_role text;
BEGIN
  -- Check if user has 'client' role and not 'admin' or 'staff'
  SELECT role INTO user_role
  FROM public.user_roles
  WHERE user_roles.user_id = is_client.user_id
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'staff' THEN 2
      WHEN 'client' THEN 3
      ELSE 4
    END
  LIMIT 1;

  -- Return true only if role is 'client' (or no role exists, default to client)
  RETURN COALESCE(user_role = 'client', true);
END;
$$;

-- Trigger function to auto-generate client code (runs AFTER INSERT)
CREATE OR REPLACE FUNCTION public.auto_generate_client_code_trigger()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  user_role text;
BEGIN
  -- Only generate code if client_code is NULL (not manually set)
  IF NEW.client_code IS NULL THEN
    -- Check user's role (default to client if no role exists)
    SELECT role INTO user_role
    FROM public.user_roles
    WHERE user_roles.user_id = NEW.id
    ORDER BY 
      CASE role
        WHEN 'admin' THEN 1
        WHEN 'staff' THEN 2
        WHEN 'client' THEN 3
        ELSE 4
      END
    LIMIT 1;

    -- Only generate code for clients (or if no role exists, assume client)
    IF user_role IS NULL OR user_role = 'client' THEN
      UPDATE public.profiles
      SET client_code = public.generate_client_code()
      WHERE id = NEW.id AND client_code IS NULL;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger on profiles table (AFTER INSERT)
DROP TRIGGER IF EXISTS auto_generate_client_code_on_insert ON public.profiles;
CREATE TRIGGER auto_generate_client_code_on_insert
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_client_code_trigger();

-- Also create trigger for when user_roles are assigned (in case profile exists first)
CREATE OR REPLACE FUNCTION public.auto_generate_client_code_on_role_assignment()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- If role is 'client' and profile doesn't have a client_code, generate one
  IF NEW.role = 'client' THEN
    UPDATE public.profiles
    SET client_code = public.generate_client_code()
    WHERE id = NEW.user_id 
      AND client_code IS NULL
      AND NOT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = NEW.user_id 
          AND role IN ('admin', 'staff')
      );
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger on user_roles table
DROP TRIGGER IF EXISTS auto_generate_client_code_on_role_insert ON public.user_roles;
CREATE TRIGGER auto_generate_client_code_on_role_insert
  AFTER INSERT ON public.user_roles
  FOR EACH ROW
  WHEN (NEW.role = 'client')
  EXECUTE FUNCTION public.auto_generate_client_code_on_role_assignment();

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Test the function:
-- SELECT public.generate_client_code();
--
-- Test with a new client registration:
-- 1. Create a new user in auth.users
-- 2. Insert into profiles with client role
-- 3. Check that client_code was auto-generated
--
-- Example:
-- INSERT INTO public.profiles (id, email, full_name)
-- VALUES (gen_random_uuid(), 'test@example.com', 'Test User');
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ((SELECT id FROM public.profiles WHERE email = 'test@example.com'), 'client');
-- SELECT client_code FROM public.profiles WHERE email = 'test@example.com';
-- ============================================================================

