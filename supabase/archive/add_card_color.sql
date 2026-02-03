-- =============================================
-- UPDATE CARD COLORS (Fix Restrictions)
-- =============================================

-- 1. Remove strict check constraints from ASSETS to allow new colors
ALTER TABLE public.assets DROP CONSTRAINT IF EXISTS assets_card_color_check;

-- Optional: You can re-add the constraint with the new colors if you want strict validation
-- ALTER TABLE public.assets ADD CONSTRAINT assets_card_color_check 
-- CHECK (card_color IN ('black', 'white', 'orange', 'violet', 'blue', 'emerald', 'crimson', 'gold', 'cyan', 'slate'));

-- 2. Remove strict check constraints from PLANS (if they exist)
DO $$
BEGIN
    -- Check if strict constraint exists on plans and drop it
    -- Note: constraint name might vary, trying common default
    BEGIN
        ALTER TABLE public.plans DROP CONSTRAINT IF EXISTS plans_color_theme_check;
    EXCEPTION WHEN OTHERS THEN
        NULL; -- Ignore if not found
    END;
END $$;
