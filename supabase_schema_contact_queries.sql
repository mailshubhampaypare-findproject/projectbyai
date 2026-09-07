-- Create contact_queries table
CREATE TABLE IF NOT EXISTS public.contact_queries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Grant privileges
GRANT ALL ON public.contact_queries TO anon, authenticated, service_role;

-- Enable Row Level Security (RLS)
ALTER TABLE public.contact_queries ENABLE ROW LEVEL SECURITY;

-- Allow insert access for anyone
CREATE POLICY "Allow insert for everyone" ON public.contact_queries
  FOR INSERT TO public WITH CHECK (true);

-- Allow full access for service_role and authenticated users
CREATE POLICY "Allow service_role full access" ON public.contact_queries
  FOR ALL TO service_role USING (true);

CREATE POLICY "Allow read access to authenticated users" ON public.contact_queries
  FOR SELECT TO authenticated USING (true);
