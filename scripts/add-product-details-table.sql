-- Create product_details_sections table
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS product_details_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_product_details_sections_product_id ON product_details_sections(product_id);
CREATE INDEX IF NOT EXISTS idx_product_details_sections_order ON product_details_sections(product_id, order_index);

-- Enable RLS
ALTER TABLE product_details_sections ENABLE ROW LEVEL SECURITY;

-- Create policy for public SELECT
CREATE POLICY "Product details sections are viewable by everyone"
  ON product_details_sections FOR SELECT
  USING (true);

-- Create policy for authenticated INSERT
CREATE POLICY "Authenticated users can insert product details sections"
  ON product_details_sections FOR INSERT
  WITH CHECK (true);

-- Create policy for authenticated UPDATE
CREATE POLICY "Authenticated users can update product details sections"
  ON product_details_sections FOR UPDATE
  USING (true);

-- Create policy for authenticated DELETE
CREATE POLICY "Authenticated users can delete product details sections"
  ON product_details_sections FOR DELETE
  USING (true);
