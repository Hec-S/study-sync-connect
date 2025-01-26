-- Create enum for marketplace project status
CREATE TYPE project_status AS ENUM ('open', 'in_progress', 'completed', 'cancelled');

-- Create marketplace_projects table
CREATE TABLE marketplace_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    budget_range TEXT NOT NULL,
    required_skills TEXT[] DEFAULT '{}',
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    status project_status DEFAULT 'open',
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies for marketplace_projects
ALTER TABLE marketplace_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view marketplace projects"
    ON marketplace_projects FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create marketplace projects"
    ON marketplace_projects FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own marketplace projects"
    ON marketplace_projects FOR UPDATE
    TO authenticated
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own marketplace projects"
    ON marketplace_projects FOR DELETE
    TO authenticated
    USING (auth.uid() = owner_id);

-- Rename projects table to portfolio_items and add new columns
ALTER TABLE projects RENAME TO portfolio_items;

-- Add new columns to portfolio_items
ALTER TABLE portfolio_items 
    ADD COLUMN image_url TEXT,
    ADD COLUMN project_url TEXT,
    ADD COLUMN completion_date TIMESTAMP WITH TIME ZONE;

-- Copy deadline data to completion_date
UPDATE portfolio_items SET completion_date = deadline;

-- Drop deadline column
ALTER TABLE portfolio_items DROP COLUMN deadline;

-- Update RLS policies for portfolio_items
DROP POLICY IF EXISTS "Users can view their own projects" ON portfolio_items;
DROP POLICY IF EXISTS "Users can insert their own projects" ON portfolio_items;
DROP POLICY IF EXISTS "Users can update their own projects" ON portfolio_items;
DROP POLICY IF EXISTS "Users can delete their own projects" ON portfolio_items;

CREATE POLICY "Anyone can view portfolio items"
    ON portfolio_items FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create portfolio items"
    ON portfolio_items FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own portfolio items"
    ON portfolio_items FOR UPDATE
    TO authenticated
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own portfolio items"
    ON portfolio_items FOR DELETE
    TO authenticated
    USING (auth.uid() = owner_id);

-- Add triggers to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_portfolio_items_updated_at
    BEFORE UPDATE ON portfolio_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_projects_updated_at
    BEFORE UPDATE ON marketplace_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
