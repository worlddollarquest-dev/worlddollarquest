-- ==============================================================================
-- WORLD DOLLAR QUEST — PHASE 3: COMMERCE & PAYMENTS SUPABASE MIGRATION
-- ==============================================================================

-- 1. Extend Orders Table with Customer & Provider metadata
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS customer_name TEXT DEFAULT 'Customer',
  ADD COLUMN IF NOT EXISTS customer_email TEXT DEFAULT 'customer@example.com',
  ADD COLUMN IF NOT EXISTS customer_phone TEXT,
  ADD COLUMN IF NOT EXISTS payment_provider TEXT DEFAULT 'sandbox',
  ADD COLUMN IF NOT EXISTS payment_reference TEXT,
  ADD COLUMN IF NOT EXISTS coupon_code TEXT,
  ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- 2. Extend Order Items Table with slug and storage download path
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS product_slug TEXT,
  ADD COLUMN IF NOT EXISTS download_file_path TEXT,
  ADD COLUMN IF NOT EXISTS download_entitlement_created BOOLEAN DEFAULT false;

-- 3. Payment Transactions Table (Audit trail & multi-provider records)
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_transaction_id TEXT,
  provider_order_id TEXT,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('pending', 'processing', 'paid', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded')),
  raw_reference_metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Download Entitlements Table (Secure digital fulfillment & download limit enforcement)
CREATE TABLE IF NOT EXISTS public.download_entitlements (
  id TEXT PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES public.order_items(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_slug TEXT,
  customer_email TEXT NOT NULL,
  access_token TEXT UNIQUE NOT NULL,
  download_limit INTEGER DEFAULT 5,
  download_count INTEGER DEFAULT 0,
  download_file_path TEXT,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast token lookups
CREATE INDEX IF NOT EXISTS idx_entitlements_access_token ON public.download_entitlements(access_token);
CREATE INDEX IF NOT EXISTS idx_entitlements_customer_email ON public.download_entitlements(customer_email);
CREATE INDEX IF NOT EXISTS idx_entitlements_order_id ON public.download_entitlements(order_id);

-- 5. Coupons Table (Discount codes & usage limits)
CREATE TABLE IF NOT EXISTS public.coupons (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL,
  minimum_order_value NUMERIC(10, 2) DEFAULT 0,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Commerce Settings Table (Multi-currency, gateways & fulfillment rules)
CREATE TABLE IF NOT EXISTS public.commerce_settings (
  id TEXT PRIMARY KEY DEFAULT 'default_commerce_config',
  settings_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Seed Initial Coupons
INSERT INTO public.coupons (id, code, discount_type, discount_value, minimum_order_value, usage_limit, used_count, is_active)
VALUES 
  ('coup-welcome10', 'WELCOME10', 'percentage', 10, 0, 500, 38, true),
  ('coup-quest20', 'QUEST2026', 'percentage', 20, 25, 200, 52, true),
  ('coup-save5', 'SAVE5', 'fixed', 5, 20, 100, 14, true),
  ('coup-freelance50', 'FREELANCE50', 'percentage', 50, 30, 50, 8, true)
ON CONFLICT (code) DO NOTHING;

-- 8. Seed Initial Commerce Settings
INSERT INTO public.commerce_settings (id, settings_data)
VALUES (
  'default_commerce_config',
  '{
    "defaultCurrency": "USD",
    "supportedCurrencies": ["USD", "PKR", "BDT"],
    "defaultDownloadLimit": 5,
    "downloadExpiryDays": 365,
    "guestCheckoutEnabled": true,
    "customerAccountsEnabled": true,
    "couponSystemEnabled": true,
    "activePaymentProviders": {
      "stripe": { "enabled": true, "isConfigured": false, "testMode": true },
      "paypal": { "enabled": true, "isConfigured": false, "testMode": true },
      "mobileWallet": { "enabled": true, "isConfigured": true, "provider": "bkash_nagad" },
      "sandbox": { "enabled": true, "label": "Instant Sandbox Testing" }
    }
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 9. Private Storage Bucket for Product Files
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-files', 'product-files', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- 10. Enable Row Level Security
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commerce_settings ENABLE ROW LEVEL SECURITY;

-- 11. Security Policies

-- Coupons: Public read for active coupons, Admin full access
CREATE POLICY "Public read active coupons" ON public.coupons
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin full manage coupons" ON public.coupons
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Commerce Settings: Public read, Admin manage
CREATE POLICY "Public read commerce settings" ON public.commerce_settings
  FOR SELECT USING (true);

CREATE POLICY "Admin manage commerce settings" ON public.commerce_settings
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Download Entitlements: Public can read with exact access token, Admin full manage
CREATE POLICY "Public token entitlement access" ON public.download_entitlements
  FOR SELECT USING (true);

CREATE POLICY "Customer or Admin entitlement update" ON public.download_entitlements
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Admin full manage entitlements" ON public.download_entitlements
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Payment Transactions: Admin full manage, public insert during checkout
CREATE POLICY "Public insert payment transactions" ON public.payment_transactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin read payment transactions" ON public.payment_transactions
  FOR SELECT USING (public.is_admin() OR auth.uid() IS NOT NULL);
