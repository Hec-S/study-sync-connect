-- Add first_name and last_name columns to profiles table
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Create function to format display name
CREATE OR REPLACE FUNCTION format_display_name(first_name TEXT, last_name TEXT)
RETURNS TEXT AS $$
BEGIN
  IF first_name IS NULL OR last_name IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN first_name || ' ' || LEFT(last_name, 1) || '.';
END;
$$ LANGUAGE plpgsql;

-- Update display_name with formatted name if first_name and last_name are set
CREATE OR REPLACE FUNCTION update_display_name()
RETURNS TRIGGER AS $$
BEGIN
  NEW.display_name = format_display_name(NEW.first_name, NEW.last_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to automatically update display_name when first_name or last_name changes
DROP TRIGGER IF EXISTS update_profile_display_name ON profiles;
CREATE TRIGGER update_profile_display_name
  BEFORE INSERT OR UPDATE OF first_name, last_name ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_display_name();
