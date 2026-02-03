-- Track daily task completions to prevent XP abuse
CREATE TABLE IF NOT EXISTS public.user_daily_task_completions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    task_id TEXT NOT NULL,
    completed_at DATE DEFAULT (timezone('utc'::text, now()) AT TIME ZONE 'America/Sao_Paulo')::DATE,
    UNIQUE(user_id, task_id, completed_at)
);

-- Add column to profiles for tracking last study bonus (100XP)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_daily_bonus_at') THEN
        ALTER TABLE public.profiles ADD COLUMN last_daily_bonus_at DATE;
    END IF;
END $$;

-- Enable RLS
ALTER TABLE public.user_daily_task_completions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own task completions"
    ON public.user_daily_task_completions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own task completions"
    ON public.user_daily_task_completions FOR INSERT
    WITH CHECK (auth.uid() = user_id);
