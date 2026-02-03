-- REMOVE OLD/UNUSED TABLES
-- Use CASCADE to remove any dependent constraints or foreign keys automatically

DROP TABLE IF EXISTS public.agents CASCADE;
DROP TABLE IF EXISTS public.plans CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.modules CASCADE;
DROP TABLE IF EXISTS public.lessons CASCADE;

-- Optional: If you want to clear system logs from the old structure
-- DROP TABLE IF EXISTS public.system_logs CASCADE;

-- Ensure the 'achievements' table has RLS enabled (it was showing "Unrestricted" in your screenshot)
ALTER TABLE IF EXISTS public.achievements ENABLE ROW LEVEL SECURITY;

-- Policy for achievements (public read, admin write)
DROP POLICY IF EXISTS "Achievements viewable by everyone" ON public.achievements;
CREATE POLICY "Achievements viewable by everyone" ON public.achievements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage achievements" ON public.achievements;
CREATE POLICY "Admins manage achievements" ON public.achievements FOR ALL USING (public.is_admin());
