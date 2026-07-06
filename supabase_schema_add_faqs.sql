-- Add faqs column to library_projects
ALTER TABLE public.library_projects 
ADD COLUMN IF NOT EXISTS faqs JSONB NOT NULL DEFAULT '[]'::jsonb;
