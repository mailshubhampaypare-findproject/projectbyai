-- =========================================================
-- Project Contributor & Marketplace Community Schema
-- =========================================================

-- 1. Ensure library_projects supports contributor attribution & analytics
ALTER TABLE public.library_projects
  ADD COLUMN IF NOT EXISTS contributor_id UUID REFERENCES auth.users ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS contributor_name TEXT,
  ADD COLUMN IF NOT EXISTS tutorial_video_url TEXT,
  ADD COLUMN IF NOT EXISTS commission_rate NUMERIC DEFAULT 70,
  ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sales_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_tutorial_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS demo_url TEXT;

-- 2. Contributor Profiles (Payout details, bio, tier)
CREATE TABLE IF NOT EXISTS public.contributor_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  bio TEXT,
  upi_id TEXT,
  bank_name TEXT,
  bank_account TEXT,
  bank_ifsc TEXT,
  account_holder_name TEXT,
  commission_tier TEXT NOT NULL DEFAULT 'standard_70', -- 'standard_70' or 'tutorial_pro_90'
  total_earnings NUMERIC NOT NULL DEFAULT 0,
  rating NUMERIC NOT NULL DEFAULT 5.0,
  review_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.contributor_profiles TO anon, authenticated;
GRANT ALL ON public.contributor_profiles TO service_role;
ALTER TABLE public.contributor_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can select contributor_profiles" ON public.contributor_profiles FOR SELECT USING (true);
CREATE POLICY "authenticated can insert own contributor_profile" ON public.contributor_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "authenticated can update own contributor_profile" ON public.contributor_profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Community Q&A & Discussion Messages
CREATE TABLE IF NOT EXISTS public.project_community_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.library_projects ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  user_role TEXT DEFAULT 'Student', -- 'Contributor' or 'Student'
  message TEXT NOT NULL,
  parent_id UUID REFERENCES public.project_community_messages ON DELETE CASCADE,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_community_messages TO anon, authenticated;
GRANT ALL ON public.project_community_messages TO service_role;
ALTER TABLE public.project_community_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can select community messages" ON public.project_community_messages FOR SELECT USING (true);
CREATE POLICY "anyone can insert community messages" ON public.project_community_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "creator can update community messages" ON public.project_community_messages FOR UPDATE USING (true);
CREATE POLICY "creator can delete community messages" ON public.project_community_messages FOR DELETE USING (true);

-- 4. Reviews & Ratings (For Projects & Contributors)
CREATE TABLE IF NOT EXISTS public.project_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.library_projects ON DELETE CASCADE,
  contributor_id UUID REFERENCES auth.users ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_reviews TO anon, authenticated;
GRANT ALL ON public.project_reviews TO service_role;
ALTER TABLE public.project_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can select project_reviews" ON public.project_reviews FOR SELECT USING (true);
CREATE POLICY "anyone can insert project_reviews" ON public.project_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "creator can delete project_reviews" ON public.project_reviews FOR DELETE USING (true);

-- 5. 90% Tutorial Tier Requests
CREATE TABLE IF NOT EXISTS public.tutorial_tier_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contributor_id UUID REFERENCES auth.users ON DELETE CASCADE,
  contributor_email TEXT,
  project_id UUID REFERENCES public.library_projects ON DELETE CASCADE,
  project_title TEXT,
  tutorial_video_url TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.tutorial_tier_requests TO anon, authenticated;
GRANT ALL ON public.tutorial_tier_requests TO service_role;
ALTER TABLE public.tutorial_tier_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can select tutorial_tier_requests" ON public.tutorial_tier_requests FOR SELECT USING (true);
CREATE POLICY "anyone can insert tutorial_tier_requests" ON public.tutorial_tier_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "anyone can update tutorial_tier_requests" ON public.tutorial_tier_requests FOR UPDATE USING (true);
