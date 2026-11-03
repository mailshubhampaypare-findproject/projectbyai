-- =========================================================
-- Project Approval & Contributor Marketplace Publishing Schema
-- =========================================================

-- 1. Add status and approval flags to library_projects
ALTER TABLE public.library_projects
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- 2. Ensure all existing pre-loaded or previously approved projects are marked as published
UPDATE public.library_projects
SET status = 'published', is_approved = true
WHERE status IS NULL OR status = '';

-- 3. Index status for performant marketplace queries
CREATE INDEX IF NOT EXISTS idx_library_projects_status ON public.library_projects (status);
CREATE INDEX IF NOT EXISTS idx_library_projects_contributor_id ON public.library_projects (contributor_id);
