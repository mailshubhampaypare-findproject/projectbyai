-- =========================================================
-- Contributor Payouts & Ledger Schema
-- =========================================================

-- 1. Create contributor_payouts table for recording disbursements & ledger debits
CREATE TABLE IF NOT EXISTS public.contributor_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contributor_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  payout_method TEXT NOT NULL DEFAULT 'upi', -- 'upi' or 'bank'
  payout_details JSONB, -- { upi_id, upi_name, bank_name, bank_account, bank_ifsc, account_holder_name }
  utr_reference TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'completed', -- 'completed', 'pending', 'failed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Add columns to contributor_profiles if not present
ALTER TABLE public.contributor_profiles
  ADD COLUMN IF NOT EXISTS preferred_payout_method TEXT DEFAULT 'upi',
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS total_withdrawn NUMERIC DEFAULT 0;

-- 3. Grants & Security
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contributor_payouts TO anon, authenticated;
GRANT ALL ON public.contributor_payouts TO service_role;
ALTER TABLE public.contributor_payouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can select contributor_payouts" ON public.contributor_payouts;
CREATE POLICY "Anyone can select contributor_payouts"
  ON public.contributor_payouts FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated can insert contributor_payouts" ON public.contributor_payouts;
CREATE POLICY "Authenticated can insert contributor_payouts"
  ON public.contributor_payouts FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can update contributor_payouts" ON public.contributor_payouts;
CREATE POLICY "Authenticated can update contributor_payouts"
  ON public.contributor_payouts FOR UPDATE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_contributor_payouts_contributor_id 
  ON public.contributor_payouts (contributor_id);
CREATE INDEX IF NOT EXISTS idx_contributor_payouts_created_at 
  ON public.contributor_payouts (created_at DESC);
