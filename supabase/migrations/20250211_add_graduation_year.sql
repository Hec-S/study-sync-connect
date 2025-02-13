ALTER TABLE profiles
ADD COLUMN graduation_year INTEGER;

COMMENT ON COLUMN profiles.graduation_year IS 'The year when the user expects to graduate';
