-- SCRIPT TO MAKE A USER ADMIN
-- Replace 'YOUR_EMAIL_HERE' with the target email

UPDATE public.profiles
SET role = 'admin'
WHERE email = 'henryadm@email.com'; -- <--- TROQUE PELO SEU EMAIL

-- Verifique se funcionou
SELECT * FROM public.profiles WHERE role = 'admin';
