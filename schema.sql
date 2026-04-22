-- ============================================
-- Luxence Database Schema for Supabase
-- ============================================
-- This schema creates all tables needed for the Luxence e-commerce platform
-- Run this entire file in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. COLLECTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);

-- ============================================
-- 2. PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  collection_id TEXT REFERENCES collections(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL DEFAULT 'Uncategorized',
  slug TEXT NOT NULL UNIQUE,
  pdf_file TEXT,
  pdf_filename TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_products_collection_id ON products(collection_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- ============================================
-- 3. PRODUCT IMAGES TABLE (for multiple images per product)
-- ============================================
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_order ON product_images(product_id, order_index);

-- ============================================
-- 4. PRODUCT SPECIFICATIONS TABLE (for multiple specs per product)
-- ============================================
CREATE TABLE IF NOT EXISTS product_specifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_product_specifications_product_id ON product_specifications(product_id);
CREATE INDEX IF NOT EXISTS idx_product_specifications_order ON product_specifications(product_id, order_index);

-- ============================================
-- 5. ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  panier_code TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_postal_code TEXT NOT NULL,
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  status TEXT NOT NULL DEFAULT 'en attente' CHECK (status IN ('en attente', 'en cours', 'livré', 'annulé')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_panier_code ON orders(panier_code);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- ============================================
-- 6. ORDER ITEMS TABLE (for multiple items per order)
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- ============================================
-- 7. CONTACT MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);

-- ============================================
-- 8. QUOTE REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS quote_requests (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  message TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quote_requests_email ON quote_requests(client_email);

-- ============================================
-- 9. HERO SLIDES TABLE (optional, for homepage carousel)
-- ============================================
CREATE TABLE IF NOT EXISTS hero_slides (
  id TEXT PRIMARY KEY,
  image TEXT NOT NULL,
  alt TEXT DEFAULT 'Hero slide',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_hero_slides_order ON hero_slides(order_index);

-- ============================================
-- 10. PRODUCT DETAILS SECTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS product_details_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_product_details_sections_product_id ON product_details_sections(product_id);
CREATE INDEX IF NOT EXISTS idx_product_details_sections_order ON product_details_sections(product_id, order_index);

-- ============================================
-- TRIGGERS: Auto-update updated_at timestamps
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at
-- Drop existing triggers if they exist, then create new ones
DROP TRIGGER IF EXISTS update_collections_updated_at ON collections;
CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages;
CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_quote_requests_updated_at ON quote_requests;
CREATE TRIGGER update_quote_requests_updated_at
  BEFORE UPDATE ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hero_slides_updated_at ON hero_slides;
CREATE TRIGGER update_hero_slides_updated_at
  BEFORE UPDATE ON hero_slides
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_details_sections_updated_at ON product_details_sections;
CREATE TRIGGER update_product_details_sections_updated_at
  BEFORE UPDATE ON product_details_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Enable RLS on all tables
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_details_sections ENABLE ROW LEVEL SECURITY;

-- Public read access for collections (products are public)
-- Drop existing policies if they exist, then create new ones
DROP POLICY IF EXISTS "Collections are viewable by everyone" ON collections;
CREATE POLICY "Collections are viewable by everyone"
  ON collections FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Product images are viewable by everyone" ON product_images;
CREATE POLICY "Product images are viewable by everyone"
  ON product_images FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Product specifications are viewable by everyone" ON product_specifications;
CREATE POLICY "Product specifications are viewable by everyone"
  ON product_specifications FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Hero slides are viewable by everyone" ON hero_slides;
CREATE POLICY "Hero slides are viewable by everyone"
  ON hero_slides FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Product details sections are viewable by everyone" ON product_details_sections;
CREATE POLICY "Product details sections are viewable by everyone"
  ON product_details_sections FOR SELECT
  USING (true);

-- Insert/Update/Delete policies - you may want to restrict these based on your auth setup
-- For now, the service_role key (used in the backend API) bypasses RLS, so all operations
-- will work. In production, you should create proper admin policies based on your authentication.

-- Note: Orders, contact_messages, and quote_requests are managed via your backend API using the service_role key,
-- which bypasses RLS. If you want to allow client-side access later, you'll need to configure
-- additional policies based on your authentication system.

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================
-- Uncomment below to insert sample data

/*
-- Insert a sample collection
INSERT INTO collections (id, name, slug, description) 
VALUES ('panels', 'Panneaux LED', 'panels', 'Collection de panneaux LED')
ON CONFLICT (id) DO NOTHING;
*/

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify your tables were created:

-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- ORDER BY table_name;

-- ============================================
-- END OF SCHEMA
-- ============================================
