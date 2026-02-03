
-- Function to sync profile role to auth.users metadata
create or replace function public.sync_role_to_metadata()
returns trigger as $$
begin
  update auth.users
  set raw_app_meta_data = 
    coalesce(raw_app_meta_data, '{}'::jsonb) || 
    jsonb_build_object('role', new.role)
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to run whenever profile is updated or inserted
drop trigger if exists on_profile_role_change on public.profiles;
create trigger on_profile_role_change
  after insert or update of role on public.profiles
  for each row execute procedure public.sync_role_to_metadata();

-- Update handle_new_user to also set the role in metadata initially if needed
-- (Though the trigger above might handle the insert on profiles, it's safer to ensure it)
