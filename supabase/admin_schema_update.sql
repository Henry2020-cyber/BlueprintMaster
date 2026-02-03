
-- =============================================
-- ADMIN SCHEMA UPDATE
-- Focus: Assets as Products (not subscription plans)
-- =============================================

-- Update Profiles to include status info
alter table public.profiles add column if not exists status text default 'active' check (status in ('active', 'suspended', 'archived'));
alter table public.profiles add column if not exists phone text;

-- The assets table already exists in schema.sql
-- We just need to ensure it has all the fields we need for product management

-- Add additional fields to assets if they don't exist
alter table public.assets add column if not exists message_limit integer default 100;
alter table public.assets add column if not exists agent_limit integer default 1;
alter table public.assets add column if not exists whatsapp_access boolean default false;
alter table public.assets add column if not exists card_color text default 'black' check (card_color in ('black', 'white', 'orange', 'violet'));

-- Note: features field already exists as jsonb in the original schema
-- We'll use it to store auto-generated feature descriptions

-- RLS policies already exist for assets in schema.sql
-- No need to recreate them
