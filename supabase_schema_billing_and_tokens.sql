-- 1. Add used_tokens tracking column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS used_tokens INTEGER NOT NULL DEFAULT 0;

-- 2. Create a billing_transactions table for payments (token packs or library projects)
CREATE TABLE IF NOT EXISTS public.billing_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  invoice_no TEXT NOT NULL,
  item_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  payment_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Paid',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Grant privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON public.billing_transactions TO anon, authenticated;
GRANT ALL ON public.billing_transactions TO service_role;

-- Enable Row Level Security (RLS)
ALTER TABLE public.billing_transactions ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY "Users can select their own billing history"
  ON public.billing_transactions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON public.billing_transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can do everything on billing"
  ON public.billing_transactions
  FOR ALL
  USING (true);
