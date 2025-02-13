-- Enable RLS for storage
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
SELECT 'project-attachments', 'project-attachments', true, 10485760, ARRAY['application/pdf', 'image/png', 'image/jpeg']
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'project-attachments'
);

-- Add column to marketplace_projects if it doesn't exist
ALTER TABLE marketplace_projects ADD COLUMN IF NOT EXISTS attachments TEXT[] DEFAULT '{}';

-- Set up RLS policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;

CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'project-attachments' );

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'project-attachments' );
