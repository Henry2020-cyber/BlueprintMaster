-- Create or Replace the track_user_login function with simplified UTC logic to ensure consistency
CREATE OR REPLACE FUNCTION public.track_user_login()
RETURNS void AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_last_login_ts TIMESTAMP WITH TIME ZONE;
  v_current_streak INTEGER;
  
  -- Using UTC for consistency across all timezones
  v_now TIMESTAMP WITH TIME ZONE := now();
  v_today_date DATE := (v_now AT TIME ZONE 'UTC')::DATE;
  v_last_login_date DATE;
BEGIN
  -- Get current user profile data
  SELECT last_login_at, streak INTO v_last_login_ts, v_current_streak
  FROM public.profiles
  WHERE id = v_user_id;

  v_current_streak := COALESCE(v_current_streak, 0);
  
  -- CASE 1: First time login logic (or missing data on last_login)
  IF v_last_login_ts IS NULL THEN
      v_current_streak := 1;
      
      UPDATE public.profiles 
      SET 
        streak = 1, 
        last_login_at = v_now, 
        xp = COALESCE(xp,0) + 10 
      WHERE id = v_user_id;
      
      -- Award first login achievement
      INSERT INTO public.user_achievements (user_id, achievement_id) 
      VALUES (v_user_id, 'first_login') 
      ON CONFLICT DO NOTHING;
      
      RETURN;
  END IF;

  v_last_login_date := (v_last_login_ts AT TIME ZONE 'UTC')::DATE;

  -- CASE 2: Already logged in today
  IF v_last_login_date = v_today_date THEN
      -- Just update the timestamp to show recent activity, do not increment streak again
      UPDATE public.profiles SET last_login_at = v_now WHERE id = v_user_id;
      RETURN;
  END IF;

  -- CASE 3: Logged in yesterday (Streak continues)
  IF v_last_login_date = (v_today_date - INTERVAL '1 day') THEN
      v_current_streak := v_current_streak + 1;
  ELSE
  -- CASE 4: Logged in before yesterday (Streak broken)
      v_current_streak := 1;
  END IF;

  -- Update Profile with new streak
  UPDATE public.profiles
  SET 
    streak = v_current_streak,
    last_login_at = v_now,
    xp = COALESCE(xp, 0) + 10 -- Daily login XP bonus
  WHERE id = v_user_id;

  -- Check and award Streak Achievements
  IF v_current_streak >= 3 THEN
      INSERT INTO public.user_achievements (user_id, achievement_id) VALUES (v_user_id, 'streak_3') ON CONFLICT DO NOTHING;
  END IF;
  
  IF v_current_streak >= 7 THEN
      INSERT INTO public.user_achievements (user_id, achievement_id) VALUES (v_user_id, 'streak_7') ON CONFLICT DO NOTHING;
  END IF;
  
  -- Verify if level exists in profiles, otherwise logic handles it elsewhere
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
