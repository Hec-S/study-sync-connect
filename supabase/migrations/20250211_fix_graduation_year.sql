-- Drop any existing triggers that might affect graduation_year
DROP TRIGGER IF EXISTS update_profile_graduation_year ON profiles;

-- Verify and fix the column type
ALTER TABLE profiles 
  ALTER COLUMN graduation_year DROP DEFAULT,
  ALTER COLUMN graduation_year TYPE INTEGER USING graduation_year::INTEGER;

-- Add check constraint to ensure valid graduation years
ALTER TABLE profiles
  ADD CONSTRAINT graduation_year_check 
  CHECK (graduation_year >= EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER 
         AND graduation_year <= EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER + 6);

-- Update the handle_new_user function to ensure proper integer handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_grad_year integer;
BEGIN
  default_grad_year := EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER + 4;
  
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
    '', 
    '', 
    '', 
    default_grad_year,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
