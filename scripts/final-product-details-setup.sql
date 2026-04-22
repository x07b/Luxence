-- ============================================
-- PRODUCT DETAILS SECTIONS TABLE - FINAL SETUP
-- ============================================
-- Copy and paste this ENTIRE script into your Supabase SQL Editor
-- This creates the table, indexes, RLS policies, and triggers

-- 1. CREATE TABLE
CREATE TABLE IF NOT EXISTS product_details_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CREATE INDEXES
CREATE INDEX IF NOT EXISTS idx_product_details_sections_product_id ON product_details_sections(product_id);
CREATE INDEX IF NOT EXISTS idx_product_details_sections_order ON product_details_sections(product_id, order_index);

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE product_details_sections ENABLE ROW LEVEL SECURITY;

-- 4. CREATE RLS POLICIES (with DROP IF EXISTS to prevent conflicts)
DROP POLICY IF EXISTS "Product details sections are viewable by everyone" ON product_details_sections;
CREATE POLICY "Product details sections are viewable by everyone"
  ON product_details_sections FOR SELECT
  USING (true);

-- 5. CREATE TRIGGER FOR AUTO-UPDATE TIMESTAMP
-- First, ensure the function exists (from the main schema)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Now create the trigger
DROP TRIGGER IF EXISTS update_product_details_sections_updated_at ON product_details_sections;
CREATE TRIGGER update_product_details_sections_updated_at
  BEFORE UPDATE ON product_details_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DONE! You can now:
-- 1. Refresh your browser
-- 2. Go to Admin → Products
-- 3. Add or edit a product
-- 4. You'll see "Détails du produit" section at the bottom
-- 5. Click "Add Section" to add content
-- ============================================
