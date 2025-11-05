-- Add more fields to books table
ALTER TABLE books ADD COLUMN IF NOT EXISTS edition TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'English';
ALTER TABLE books ADD COLUMN IF NOT EXISTS page_count INTEGER;
ALTER TABLE books ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

-- Add more fields to datasets table
ALTER TABLE datasets ADD COLUMN IF NOT EXISTS version TEXT;
ALTER TABLE datasets ADD COLUMN IF NOT EXISTS access_level TEXT DEFAULT 'Public';
ALTER TABLE datasets ADD COLUMN IF NOT EXISTS doi TEXT;
ALTER TABLE datasets ADD COLUMN IF NOT EXISTS citation TEXT;

-- Add more fields to journals table
ALTER TABLE journals ADD COLUMN IF NOT EXISTS keywords_list TEXT[];
ALTER TABLE journals ADD COLUMN IF NOT EXISTS citations_count INTEGER DEFAULT 0;
ALTER TABLE journals ADD COLUMN IF NOT EXISTS impact_factor NUMERIC;
ALTER TABLE journals ADD COLUMN IF NOT EXISTS category TEXT;