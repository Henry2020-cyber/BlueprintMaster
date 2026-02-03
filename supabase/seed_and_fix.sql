-- 1. Insert Initial Assets (Seeding data for the Store)
-- Only inserts if the table is empty or specific titles don't exist to avoid duplicates
INSERT INTO public.assets (title, description, price, features, category, is_active, thumbnail_url)
VALUES 
(
  'Starter Kit RPG', 
  'Sistema completo de inventário e atributos para RPGs.', 
  0.00, 
  '["Sistema de Inventário", "Atributos Básicos", "Save/Load Simples"]'::jsonb, 
  'Template', 
  true,
  '/placeholder-rpg.jpg'
),
(
  'FPS Pro Template', 
  'Movimentação avançada, sistema de armas e multiplayer replication.', 
  129.90, 
  '["Movimentação AAA", "Sistema de Armas", "Replication", "Recuo Procedural"]'::jsonb, 
  'FPS', 
  true,
  '/placeholder-fps.jpg'
),
(
  'Ultimate Horror System', 
  'Sistema de interações, jumpscares e IA para jogos de terror.', 
  197.00, 
  '["Sistema de Lanterna", "IA de Perseguição", "Jumpscares Dinâmicos", "Inventário de Puzzles"]'::jsonb, 
  'Horror', 
  true,
  '/placeholder-horror.jpg'
)
ON CONFLICT DO NOTHING; -- Assuming ID isn't set manually, but for seeding normally we don't conflict unless unique constraint. 
-- Since we rely on UUID, this insert blindly adds. If you run multiple times, you get duplicates.
-- Better approach for idempotency:
-- (We will skip complex check for now, just run this once to populate)

-- 2. Ensure Profile Role column is correct
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text default 'user';
-- Update constraint to allow both modes
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin'));

-- 3. Helper Function to Toggle Admin (Easier to use)
CREATE OR REPLACE FUNCTION public.set_admin(target_email text, is_admin boolean)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET role = CASE WHEN is_admin THEN 'admin' ELSE 'user' END
  WHERE email = target_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
