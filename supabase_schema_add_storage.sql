-- Enable Storage extension if not enabled
CREATE SCHEMA IF NOT EXISTS storage;

-- Create uploads bucket if it does not exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies to allow public reads and anonymous inserts/updates/deletions
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'uploads');

CREATE POLICY "Anon Insert Access" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "Anon Update Access" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'uploads')
WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "Anon Delete Access" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'uploads');
