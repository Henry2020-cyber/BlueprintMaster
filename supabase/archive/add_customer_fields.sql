-- Add phone and tax_id fields to profiles table for customer data
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS tax_id TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_tax_id ON public.profiles(tax_id);

COMMENT ON COLUMN public.profiles.phone IS 'Phone number for payment processing (format: (11) 4002-8922)';
COMMENT ON COLUMN public.profiles.tax_id IS 'CPF or CNPJ for payment processing (format: 123.456.789-01)';
