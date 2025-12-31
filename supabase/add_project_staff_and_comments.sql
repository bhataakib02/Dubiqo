-- ============================================================================
-- ADD PROJECT STAFF ASSIGNMENTS AND INTERNAL COMMENTS
-- ============================================================================
-- This migration adds:
-- 1. project_staff_assignments table (many-to-many: projects can have multiple staff)
-- 2. project_comments table (for internal staff comments and public comments)
-- ============================================================================

-- ============================================================================
-- STEP 1: Create project_staff_assignments junction table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.project_staff_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES public.profiles(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, staff_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_project_staff_assignments_project_id ON public.project_staff_assignments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_staff_assignments_staff_id ON public.project_staff_assignments(staff_id);

-- Enable RLS
ALTER TABLE public.project_staff_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for project_staff_assignments
-- Admins can do everything
CREATE POLICY "Admins can manage project staff assignments"
  ON public.project_staff_assignments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Staff can view assignments for projects they're assigned to
CREATE POLICY "Staff can view their project assignments"
  ON public.project_staff_assignments
  FOR SELECT
  USING (
    staff_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Clients can view staff assignments for their projects
CREATE POLICY "Clients can view staff assigned to their projects"
  ON public.project_staff_assignments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_staff_assignments.project_id
        AND projects.client_id = auth.uid()
    )
  );

-- ============================================================================
-- STEP 2: Create project_comments table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.project_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_project_comments_project_id ON public.project_comments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_comments_user_id ON public.project_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_project_comments_is_internal ON public.project_comments(is_internal);

-- Enable RLS
ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for project_comments
-- Admins can do everything
CREATE POLICY "Admins can manage all project comments"
  ON public.project_comments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Staff can view and create internal comments for projects they're assigned to
CREATE POLICY "Staff can view and create internal comments on assigned projects"
  ON public.project_comments
  FOR ALL
  USING (
    is_internal = true AND
    EXISTS (
      SELECT 1 FROM public.project_staff_assignments
      WHERE project_staff_assignments.project_id = project_comments.project_id
        AND project_staff_assignments.staff_id = auth.uid()
    )
  );

-- Staff can view public comments for all projects they're assigned to
CREATE POLICY "Staff can view public comments on assigned projects"
  ON public.project_comments
  FOR SELECT
  USING (
    is_internal = false AND
    EXISTS (
      SELECT 1 FROM public.project_staff_assignments
      WHERE project_staff_assignments.project_id = project_comments.project_id
        AND project_staff_assignments.staff_id = auth.uid()
    )
  );

-- Clients can view only public comments on their projects (NOT internal comments)
CREATE POLICY "Clients can view public comments on their projects"
  ON public.project_comments
  FOR SELECT
  USING (
    is_internal = false AND
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_comments.project_id
        AND projects.client_id = auth.uid()
    )
  );

-- Clients can create public comments on their projects
CREATE POLICY "Clients can create public comments on their projects"
  ON public.project_comments
  FOR INSERT
  WITH CHECK (
    is_internal = false AND
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_comments.project_id
        AND projects.client_id = auth.uid()
    )
  );

-- ============================================================================
-- STEP 3: Create function to update updated_at timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION update_project_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_project_comments_updated_at
  BEFORE UPDATE ON public.project_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_project_comments_updated_at();

-- ============================================================================
-- STEP 4: Add metadata column to profiles for descriptive roles
-- ============================================================================

-- Add metadata column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'metadata'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN metadata jsonb DEFAULT '{}'::jsonb;
    RAISE NOTICE 'Added metadata column to profiles table';
  ELSE
    RAISE NOTICE 'metadata column already exists in profiles table';
  END IF;
END $$;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT '✅ Migration completed successfully!' as status;

-- Show tables created
SELECT 
  'Tables created' as info,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_staff_assignments') as project_staff_assignments_exists,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_comments') as project_comments_exists,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'metadata') as metadata_column_exists;

