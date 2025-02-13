-- Run this in the Supabase SQL Editor

-- First check if the column exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'graduation_year'
    ) THEN
        -- Add the graduation_year column if it doesn't exist
        ALTER TABLE profiles
        ADD COLUMN graduation_year INTEGER;

        -- Add a comment to the column
        COMMENT ON COLUMN profiles.graduation_year IS 'The year when the user expects to graduate';
    END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
