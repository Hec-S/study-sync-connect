-- Add description column to profiles table
ALTER TABLE profiles
  ADD COLUMN description TEXT;

-- Update RLS policies to allow users to update their own profile description
DROP POLICY IF EXISTS "Enable update for users on own profile" ON profiles;

CREATE POLICY "Enable update for users on own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
