-- Update existing in_progress projects to open
UPDATE marketplace_projects
SET status = 'open'
WHERE status = 'in_progress';

-- Drop and recreate the project_status enum without in_progress
ALTER TYPE project_status RENAME TO project_status_old;
CREATE TYPE project_status AS ENUM ('open', 'completed', 'cancelled');

-- Update the column to use the new enum
ALTER TABLE marketplace_projects 
  ALTER COLUMN status TYPE project_status 
  USING status::text::project_status;

-- Drop the old enum
DROP TYPE project_status_old;

-- Remove the assigned_to column
ALTER TABLE marketplace_projects DROP COLUMN assigned_to;
