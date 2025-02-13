-- Make essential signup fields required
ALTER TABLE profiles
  ALTER COLUMN full_name SET NOT NULL,
  ALTER COLUMN school_name SET NOT NULL,
  ALTER COLUMN major SET NOT NULL,
  ALTER COLUMN graduation_year SET NOT NULL;

-- Add RLS policies for profile creation
DROP POLICY IF EXISTS "Enable insert for authenticated users creating their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for service role" ON profiles;
DROP POLICY IF EXISTS "Enable all operations for service role" ON profiles;
DROP POLICY IF EXISTS "Enable system level operations" ON profiles;

-- Policy for authenticated users
CREATE POLICY "Enable insert for authenticated users creating their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy for service role
CREATE POLICY "Enable all operations for service role"
  ON profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy for system-level operations (like triggers)
CREATE POLICY "Enable system level operations"
  ON profiles
  TO postgres
  USING (true)
  WITH CHECK (true);

-- Allow the trigger function to bypass RLS
ALTER FUNCTION public.handle_new_user() SET search_path = public;

-- Create a trigger to ensure profile exists for every new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_grad_year integer;
  user_metadata jsonb;
BEGIN
  default_grad_year := EXTRACT(YEAR FROM CURRENT_DATE)::integer + 4;
  user_metadata := new.raw_user_meta_data;
  
  INSERT INTO public.profiles (
    id,
    full_name,
    school_name,
    major,
    graduation_year,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    COALESCE(user_metadata->>'full_name', ''),
    COALESCE(user_metadata->>'school_name', ''),
    COALESCE(user_metadata->>'major', ''),
    COALESCE((user_metadata->>'graduation_year')::integer, default_grad_year),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    school_name = EXCLUDED.school_name,
    major = EXCLUDED.major,
    graduation_year = EXCLUDED.graduation_year,
    updated_at = CURRENT_TIMESTAMP;
    
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add NOT NULL constraint with a default value for created_at and updated_at
ALTER TABLE profiles
  ALTER COLUMN created_at SET NOT NULL,
  ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN updated_at SET NOT NULL,
  ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
