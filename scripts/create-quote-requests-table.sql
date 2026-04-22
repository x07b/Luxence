-- Create quote_requests table
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

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_quote_requests_updated_at ON quote_requests;
CREATE TRIGGER update_quote_requests_updated_at
  BEFORE UPDATE ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Allow service role to bypass RLS (backend operations)
-- This is already configured in schema.sql, so no additional policy needed here
