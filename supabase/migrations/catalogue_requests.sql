-- Create catalogue_requests table to store client requests for catalogues
CREATE TABLE IF NOT EXISTS public.catalogue_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    brand_slug TEXT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.catalogue_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow public insert access to submit requests
DROP POLICY IF EXISTS "Allow public insert access to catalogue_requests" ON public.catalogue_requests;
CREATE POLICY "Allow public insert access to catalogue_requests"
    ON public.catalogue_requests
    FOR INSERT
    WITH CHECK (true);

-- Allow service_role (admin) full access to manage requests
DROP POLICY IF EXISTS "Allow admin access to catalogue_requests" ON public.catalogue_requests;
CREATE POLICY "Allow admin access to catalogue_requests"
    ON public.catalogue_requests
    FOR ALL
    USING (auth.role() = 'service_role');

-- Trigger to automatically update 'updated_at' timestamp
DROP TRIGGER IF EXISTS update_catalogue_requests_modtime ON public.catalogue_requests;
CREATE TRIGGER update_catalogue_requests_modtime
    BEFORE UPDATE ON public.catalogue_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
