#!/bin/bash

# API Testing Script
# This script tests all API endpoints to ensure everything is working

BASE_URL="http://localhost:8080/api"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 Testing API Endpoints..."
echo ""

# Test 1: Ping endpoint
echo -e "${YELLOW}Test 1: GET /api/ping${NC}"
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/ping")
status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)
if [ "$status_code" = "200" ]; then
  echo -e "${GREEN}✓ PASSED${NC} (Status: $status_code)"
  echo "Response: $body"
else
  echo -e "${RED}✗ FAILED${NC} (Status: $status_code)"
  echo "Response: $body"
fi
echo ""

# Test 2: Products endpoint
echo -e "${YELLOW}Test 2: GET /api/products${NC}"
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/products")
status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)
if [ "$status_code" = "200" ]; then
  echo -e "${GREEN}✓ PASSED${NC} (Status: $status_code)"
  product_count=$(echo "$body" | grep -o '"id"' | wc -l | tr -d ' ')
  echo "Response: Found $product_count products"
else
  echo -e "${RED}✗ FAILED${NC} (Status: $status_code)"
  echo "Response: $body"
fi
echo ""

# Test 3: Collections endpoint
echo -e "${YELLOW}Test 3: GET /api/collections${NC}"
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/collections")
status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)
if [ "$status_code" = "200" ]; then
  echo -e "${GREEN}✓ PASSED${NC} (Status: $status_code)"
  collection_count=$(echo "$body" | grep -o '"id"' | wc -l | tr -d ' ')
  echo "Response: Found $collection_count collections"
else
  echo -e "${RED}✗ FAILED${NC} (Status: $status_code)"
  echo "Response: $body"
fi
echo ""

# Test 4: Create Order endpoint
echo -e "${YELLOW}Test 4: POST /api/orders${NC}"
order_data='{
  "customer": {
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "address": "123 Test Street",
    "city": "Test City",
    "postalCode": "12345"
  },
  "items": [
    {
      "id": "test-product-1",
      "name": "Test Product",
      "price": 29.99,
      "quantity": 2
    }
  ],
  "total": 59.98
}'

response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/orders" \
  -H "Content-Type: application/json" \
  -d "$order_data")
status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)
if [ "$status_code" = "201" ] || [ "$status_code" = "200" ]; then
  echo -e "${GREEN}✓ PASSED${NC} (Status: $status_code)"
  echo "Response: $body"
else
  echo -e "${RED}✗ FAILED${NC} (Status: $status_code)"
  echo "Response: $body"
fi
echo ""

# Test 5: Get Orders endpoint
echo -e "${YELLOW}Test 5: GET /api/orders${NC}"
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/orders")
status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)
if [ "$status_code" = "200" ]; then
  echo -e "${GREEN}✓ PASSED${NC} (Status: $status_code)"
  order_count=$(echo "$body" | grep -o '"id"' | wc -l | tr -d ' ')
  echo "Response: Found $order_count orders"
else
  echo -e "${RED}✗ FAILED${NC} (Status: $status_code)"
  echo "Response: $body"
fi
echo ""

echo "✅ Testing complete!"
echo ""
echo "Note: Make sure the server is running with 'pnpm dev' or 'npm run dev'"
