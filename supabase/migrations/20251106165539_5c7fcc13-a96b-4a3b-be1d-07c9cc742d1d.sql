-- Create storage buckets for book covers, thumbnails, and dataset files
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('book-covers', 'book-covers', true),
  ('thumbnails', 'thumbnails', true),
  ('dataset-files', 'dataset-files', true);

-- Storage policies for book covers
CREATE POLICY "Anyone can view book covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'book-covers');

CREATE POLICY "Authenticated users can upload book covers"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'book-covers' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own book covers"
ON storage.objects FOR UPDATE
USING (bucket_id = 'book-covers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own book covers"
ON storage.objects FOR DELETE
USING (bucket_id = 'book-covers' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for thumbnails
CREATE POLICY "Anyone can view thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'thumbnails');

CREATE POLICY "Authenticated users can upload thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'thumbnails' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own thumbnails"
ON storage.objects FOR UPDATE
USING (bucket_id = 'thumbnails' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own thumbnails"
ON storage.objects FOR DELETE
USING (bucket_id = 'thumbnails' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for dataset files
CREATE POLICY "Anyone can view dataset files"
ON storage.objects FOR SELECT
USING (bucket_id = 'dataset-files');

CREATE POLICY "Authenticated users can upload dataset files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'dataset-files' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own dataset files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'dataset-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own dataset files"
ON storage.objects FOR DELETE
USING (bucket_id = 'dataset-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add new fields to books table
ALTER TABLE books ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS price NUMERIC(10,2);
ALTER TABLE books ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'Available';
ALTER TABLE books ADD COLUMN IF NOT EXISTS subject_area TEXT;

-- Add new fields to journals table
ALTER TABLE journals ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE journals ADD COLUMN IF NOT EXISTS open_access BOOLEAN DEFAULT false;
ALTER TABLE journals ADD COLUMN IF NOT EXISTS peer_reviewed BOOLEAN DEFAULT true;
ALTER TABLE journals ADD COLUMN IF NOT EXISTS submission_date DATE;

-- Add new fields to datasets table
ALTER TABLE datasets ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE datasets ADD COLUMN IF NOT EXISTS dataset_url TEXT;
ALTER TABLE datasets ADD COLUMN IF NOT EXISTS contributor_name TEXT;
ALTER TABLE datasets ADD COLUMN IF NOT EXISTS last_updated DATE;