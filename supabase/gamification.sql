-- --- CORE GAMIFICATION SCHEMA (FIXED & POPULATED) ---

-- 1. Ensure Table achievements exists and is populated
CREATE TABLE IF NOT EXISTS public.achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT
);

-- Insert/Sync Achievement Definitions (Matches ACHIEVEMENTS_LIST in store.tsx)
INSERT INTO public.achievements (id, title, description, icon) VALUES
('first_login', 'Primeiro Passo', 'Realizou seu primeiro login na plataforma', 'zap'),
('first_lesson', 'Aprendiz', 'Concluiu sua primeira aula', 'book'),
('streak_3', 'Consistência', 'Manteve um streak de 3 dias', 'flame'),
('level_5', 'Veterano', 'Alcançou o nível 5', 'trophy'),
('module_1_complete', 'Fundamentos Master', 'Concluiu o módulo de Fundamentos', 'star'),
('first_purchase', 'Investidor', 'Adquiriu seu primeiro asset na Loja', 'award'),
('kanban_master', 'Organizado', 'Criou sua primeira tarefa no Kanban', 'zap'),
('pomodoro_warrior', 'Foco Total', 'Completou 5 sessões de Pomodoro', 'flame'),
('study_marathon', 'Maratonista', 'Completou 10 horas de estudo', 'medal')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon;

-- 2. Profiles Table & Column Sync
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'xp') THEN
    ALTER TABLE public.profiles ADD COLUMN xp INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'level') THEN
    ALTER TABLE public.profiles ADD COLUMN level INTEGER DEFAULT 1;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'streak') THEN
    ALTER TABLE public.profiles ADD COLUMN streak INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'total_hours_study') THEN
    ALTER TABLE public.profiles ADD COLUMN total_hours_study DECIMAL(10,2) DEFAULT 0;
  END IF;
END $$;

-- 3. Progress Tables
CREATE TABLE IF NOT EXISTS public.user_completed_lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS public.user_completed_exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercise_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, exercise_id)
);

CREATE TABLE IF NOT EXISTS public.user_completed_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, module_id)
);

CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id TEXT REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, achievement_id)
);

-- 4. RPC & Trigger Logic

-- XP Increment
CREATE OR REPLACE FUNCTION public.increment_xp(amount_to_add INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    xp = COALESCE(xp, 0) + amount_to_add,
    level = floor((COALESCE(xp, 0) + amount_to_add) / 1000) + 1
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Lesson Completed
CREATE OR REPLACE FUNCTION public.fn_on_lesson_completed() RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    xp = COALESCE(xp, 0) + 100, 
    level = floor((COALESCE(xp, 0) + 100) / 1000) + 1 
  WHERE id = NEW.user_id;

  INSERT INTO public.user_achievements (user_id, achievement_id) 
  VALUES (NEW.user_id, 'first_lesson') ON CONFLICT DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Exercise Completed
CREATE OR REPLACE FUNCTION public.fn_on_exercise_completed() RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    xp = COALESCE(xp, 0) + 50, 
    level = floor((COALESCE(xp, 0) + 50) / 1000) + 1 
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Module Completed (Unlocks Next)
CREATE OR REPLACE FUNCTION public.fn_on_module_completed() RETURNS TRIGGER AS $$
DECLARE
  next_mod_id INTEGER := NEW.module_id + 1;
  target_xp INTEGER := (next_mod_id - 1) * 1000;
  base_xp INTEGER;
BEGIN
  SELECT COALESCE(xp, 0) INTO base_xp FROM public.profiles WHERE id = NEW.user_id;
  
  UPDATE public.profiles 
  SET 
    xp = GREATEST(base_xp + 250, target_xp),
    level = GREATEST(level, floor(GREATEST(base_xp + 250, target_xp) / 1000) + 1, next_mod_id)
  WHERE id = NEW.user_id;

  IF NEW.module_id = 1 THEN
    INSERT INTO public.user_achievements (user_id, achievement_id) VALUES (NEW.user_id, 'module_1_complete') ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Attach Triggers
DROP TRIGGER IF EXISTS tr_lesson_completed ON public.user_completed_lessons;
CREATE TRIGGER tr_lesson_completed AFTER INSERT ON public.user_completed_lessons FOR EACH ROW EXECUTE FUNCTION public.fn_on_lesson_completed();

DROP TRIGGER IF EXISTS tr_exercise_completed ON public.user_completed_exercises;
CREATE TRIGGER tr_exercise_completed AFTER INSERT ON public.user_completed_exercises FOR EACH ROW EXECUTE FUNCTION public.fn_on_exercise_completed();

DROP TRIGGER IF EXISTS tr_module_completed ON public.user_completed_modules;
CREATE TRIGGER tr_module_completed AFTER INSERT ON public.user_completed_modules FOR EACH ROW EXECUTE FUNCTION public.fn_on_module_completed();

-- 6. Permissions
GRANT ALL ON TABLE public.achievements TO postgres, service_role, authenticated;
GRANT ALL ON TABLE public.user_achievements TO postgres, service_role, authenticated;
