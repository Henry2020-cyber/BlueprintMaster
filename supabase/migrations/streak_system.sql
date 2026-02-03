-- Add last_login_at to profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_login_at') THEN
    ALTER TABLE public.profiles ADD COLUMN last_login_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Function to handle login tracking and streak logic
CREATE OR REPLACE FUNCTION public.track_user_login()
RETURNS void AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_last_login TIMESTAMP WITH TIME ZONE;
  v_current_streak INTEGER;
  v_today DATE := (timezone('utc'::text, now()) AT TIME ZONE 'America/Sao_Paulo')::DATE;
  v_last_login_date DATE;
BEGIN
  -- Get current user profile data
  SELECT last_login_at, streak INTO v_last_login, v_current_streak
  FROM public.profiles
  WHERE id = v_user_id;

  -- If no profile yet, we can't do much (should be handled by creation logic)
  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Calculate dates
  v_last_login_date := (v_last_login AT TIME ZONE 'America/Sao_Paulo')::DATE;

  -- If last login was NOT today
  IF v_last_login IS NULL OR v_last_login_date < v_today THEN
    -- If last login was yesterday, increment streak
    IF v_last_login_date = v_today - INTERVAL '1 day' THEN
      v_current_streak := COALESCE(v_current_streak, 0) + 1;
    -- If it was more than 1 day ago or first login
    ELSE
      v_current_streak := 1;
    END IF;

    -- Update profile
    UPDATE public.profiles
    SET 
      streak = v_current_streak,
      last_login_at = timezone('utc'::text, now()),
      xp = COALESCE(xp, 0) + 10 -- Reward login
    WHERE id = v_user_id;

    -- Check for streak achievements
    IF v_current_streak >= 3 THEN
      INSERT INTO public.user_achievements (user_id, achievement_id)
      VALUES (v_user_id, 'streak_3')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Always unlock first_login if not already
    INSERT INTO public.user_achievements (user_id, achievement_id)
    VALUES (v_user_id, 'first_login')
    ON CONFLICT DO NOTHING;

  ELSE
    -- Already logged in today, just update the timestamp to be safe (optional)
    UPDATE public.profiles
    SET last_login_at = timezone('utc'::text, now())
    WHERE id = v_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
