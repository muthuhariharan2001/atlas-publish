-- Add new publisher values to book_publisher enum
ALTER TYPE book_publisher ADD VALUE IF NOT EXISTS 'Dhara Sci Tech Publications';
ALTER TYPE book_publisher ADD VALUE IF NOT EXISTS 'Yar Tech Publications';
ALTER TYPE book_publisher ADD VALUE IF NOT EXISTS 'AM Technical Publications';
ALTER TYPE book_publisher ADD VALUE IF NOT EXISTS 'Dhara Publications';
ALTER TYPE book_publisher ADD VALUE IF NOT EXISTS 'AS NextGen Publishing Home';