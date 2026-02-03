-- SQL para criar a tabela de compras de assets
-- Execute este código no Supabase SQL Editor

-- Tabela para armazenar as compras dos usuários
-- Aviso: Isso apagará a tabela existente para garantir a criação correta das colunas
DROP TABLE IF EXISTS user_assets;

CREATE TABLE user_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  amount_paid DECIMAL(10, 2) NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  transaction_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicate purchases
  UNIQUE(user_id, asset_id)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_assets_user_id ON user_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_assets_asset_id ON user_assets(asset_id);
CREATE INDEX IF NOT EXISTS idx_user_assets_status ON user_assets(payment_status);

-- Enable Row Level Security
ALTER TABLE user_assets ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own purchases
CREATE POLICY "Users can view their own purchases"
  ON user_assets
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Allow inserts from authenticated users (for webhook)
CREATE POLICY "Allow inserts for authenticated users"
  ON user_assets
  FOR INSERT
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_assets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER user_assets_updated_at
  BEFORE UPDATE ON user_assets
  FOR EACH ROW
  EXECUTE FUNCTION update_user_assets_updated_at();

-- Grant permissions
GRANT ALL ON user_assets TO authenticated;
GRANT ALL ON user_assets TO service_role;

COMMENT ON TABLE user_assets IS 'Stores user asset purchases and payment information';
