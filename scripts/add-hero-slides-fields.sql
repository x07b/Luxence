-- Add new columns to hero_slides table to support editable content
-- Run this in the Supabase SQL Editor

ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS title TEXT DEFAULT 'Slide Title';
ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS description TEXT DEFAULT 'Slide description';
ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS button1_text TEXT DEFAULT 'Découvrir';
ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS button1_link TEXT DEFAULT '/products';
ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS button2_text TEXT DEFAULT 'En savoir plus';
ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS button2_link TEXT DEFAULT '/about';

-- Update existing rows with default values if they're NULL
UPDATE hero_slides 
SET 
  title = COALESCE(title, 'Illuminez vos espaces'),
  description = COALESCE(description, 'Des luminaires élégants pour sublimer vos intérieurs.'),
  button1_text = COALESCE(button1_text, 'Découvrir'),
  button1_link = COALESCE(button1_link, '/products'),
  button2_text = COALESCE(button2_text, 'En savoir plus'),
  button2_link = COALESCE(button2_link, '/about')
WHERE title IS NULL OR description IS NULL;
