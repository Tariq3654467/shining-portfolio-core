/*
  Create public.profiles from auth signup (fixes FK races from client inserting too early).

  - Runs AFTER INSERT ON auth.users, so profiles_id_fkey always sees the new user row.
  - Reads registration fields from auth.users.raw_user_meta_data (set via signUp options.data).

  Frontend should pass metadata in signUp and should NOT duplicate-insert profiles.
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  dob date;
BEGIN
  dob := NULL;
  BEGIN
    IF nullif(trim(NEW.raw_user_meta_data ->> 'date_of_birth'), '') IS NOT NULL THEN
      dob := (NEW.raw_user_meta_data ->> 'date_of_birth')::date;
    END IF;
  EXCEPTION WHEN invalid_text_representation THEN
    dob := NULL;
  END;

  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    gender,
    on_behalf,
    date_of_birth
  )
  VALUES (
    NEW.id,
    nullif(trim(NEW.raw_user_meta_data ->> 'first_name'), ''),
    nullif(trim(NEW.raw_user_meta_data ->> 'last_name'), ''),
    nullif(lower(trim(NEW.raw_user_meta_data ->> 'gender')), ''),
    nullif(trim(NEW.raw_user_meta_data ->> 'on_behalf'), ''),
    dob
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, profiles.last_name),
    gender = COALESCE(EXCLUDED.gender, profiles.gender),
    on_behalf = COALESCE(EXCLUDED.on_behalf, profiles.on_behalf),
    date_of_birth = COALESCE(EXCLUDED.date_of_birth, profiles.date_of_birth),
    updated_at = timezone('utc'::text, now());

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
