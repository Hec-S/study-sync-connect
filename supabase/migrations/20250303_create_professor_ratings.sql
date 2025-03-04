-- Create professor_ratings table
CREATE TABLE IF NOT EXISTS public.professor_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professor_name TEXT NOT NULL,
  major TEXT,
  school TEXT,
  would_take_again NUMERIC,  -- Percentage stored as decimal
  difficulty NUMERIC,        -- Typically on a scale (e.g., 1-5)
  num_ratings INTEGER,
  average_rating NUMERIC,    -- Overall rating
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes for faster searching
CREATE INDEX IF NOT EXISTS professor_ratings_professor_name_idx ON public.professor_ratings (professor_name);
CREATE INDEX IF NOT EXISTS professor_ratings_school_idx ON public.professor_ratings (school);
CREATE INDEX IF NOT EXISTS professor_ratings_major_idx ON public.professor_ratings (major);

-- Add row-level security policies
ALTER TABLE public.professor_ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public professor ratings are viewable by everyone" 
  ON public.professor_ratings FOR SELECT USING (true);
CREATE POLICY "Only admins can insert professor ratings" 
  ON public.professor_ratings FOR INSERT 
  USING (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'));
