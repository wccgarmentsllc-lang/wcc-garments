-- Create website_content table to store JSON data for 8 website sections
CREATE TABLE IF NOT EXISTS public.website_content (
    section_id TEXT PRIMARY KEY,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow public read access to content
CREATE POLICY "Allow public read access to website_content"
    ON public.website_content
    FOR SELECT
    USING (true);

-- Allow authenticated users to manage content
CREATE POLICY "Allow authenticated users to insert/update website_content"
    ON public.website_content
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Function to automatically update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_website_content_modtime()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function on update
CREATE TRIGGER update_website_content_modtime
BEFORE UPDATE ON public.website_content
FOR EACH ROW
EXECUTE FUNCTION update_website_content_modtime();
