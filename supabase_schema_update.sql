-- library_projects
CREATE TABLE public.library_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  screenshots TEXT[] NOT NULL DEFAULT '{}',
  youtube_id TEXT,
  tech TEXT[] NOT NULL DEFAULT '{}',
  zip_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.library_projects TO anon, authenticated;
GRANT ALL ON public.library_projects TO service_role;
ALTER TABLE public.library_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can select library_projects" ON public.library_projects FOR SELECT USING (true);
CREATE POLICY "anyone can insert library_projects" ON public.library_projects FOR INSERT WITH CHECK (true);
CREATE POLICY "anyone can update library_projects" ON public.library_projects FOR UPDATE USING (true);
CREATE POLICY "anyone can delete library_projects" ON public.library_projects FOR DELETE USING (true);

-- blog_posts
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  thumbnail TEXT,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO anon, authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can select blog_posts" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "anyone can insert blog_posts" ON public.blog_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "anyone can update blog_posts" ON public.blog_posts FOR UPDATE USING (true);
CREATE POLICY "anyone can delete blog_posts" ON public.blog_posts FOR DELETE USING (true);

-- triggers for updating timestamps
CREATE TRIGGER library_projects_touch BEFORE UPDATE ON public.library_projects
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER blog_posts_touch BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed initial data
INSERT INTO public.library_projects (slug, title, description, long_description, price, category, thumbnail, screenshots, youtube_id, tech)
VALUES 
(
  'smart-attendance',
  'Smart Attendance System with Face Recognition',
  'Automated attendance using OpenCV & Python with a Flask dashboard.',
  'A complete college attendance system that detects and recognizes student faces via webcam, marks attendance in a database and exports reports as CSV/Excel.',
  49,
  'Machine Learning',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'],
  'dQw4w9WgXcQ',
  ARRAY['Python 3.10', 'OpenCV', 'Flask', 'SQLite']
),
(
  'ecom-mern',
  'Full-Stack E-Commerce Store (MERN)',
  'MongoDB + Express + React + Node store with Stripe payments.',
  'Production-grade e-commerce with product catalog, cart, checkout via Stripe, order tracking, admin dashboard for products/orders.',
  79,
  'Web Development',
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80'],
  'dQw4w9WgXcQ',
  ARRAY['Node 20', 'React 18', 'MongoDB', 'Express']
)
ON CONFLICT (slug) DO NOTHING;
