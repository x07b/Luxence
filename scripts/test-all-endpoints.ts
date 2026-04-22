/**
 * Comprehensive test script to verify all API endpoints and database connections
 * Run with: npx tsx scripts/test-all-endpoints.ts
 */
import "dotenv/config";

const BASE_URL = process.env.TEST_URL || "http://localhost:8080/api";

async function testEndpoint(
  name: string,
  method: string,
  path: string,
  body?: any
): Promise<{ success: boolean; status: number; data: any }> {
  try {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${path}`, options);
    const data = await response.json().catch(() => response.text());

    return {
      success: response.ok,
      status: response.status,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      status: 0,
      data: error.message,
    };
  }
}

async function runTests() {
  console.log("🧪 Testing API Endpoints\n");
  console.log(`Base URL: ${BASE_URL}\n`);

  // Test 1: Ping
  console.log("Test 1: GET /api/ping");
  const ping = await testEndpoint("Ping", "GET", "/ping");
  console.log(
    ping.success
      ? `✅ PASSED (${ping.status})`
      : `❌ FAILED (${ping.status})`,
    ping.data
  );
  console.log();

  // Test 2: Products
  console.log("Test 2: GET /api/products");
  const products = await testEndpoint("Products", "GET", "/products");
  console.log(
    products.success
      ? `✅ PASSED (${products.status})`
      : `❌ FAILED (${products.status})`,
    Array.isArray(products.data)
      ? `Found ${products.data.length} products`
      : products.data
  );
  console.log();

  // Test 3: Collections
  console.log("Test 3: GET /api/collections");
  const collections = await testEndpoint("Collections", "GET", "/collections");
  console.log(
    collections.success
      ? `✅ PASSED (${collections.status})`
      : `❌ FAILED (${collections.status})`,
    Array.isArray(collections.data)
      ? `Found ${collections.data.length} collections`
      : collections.data
  );
  console.log();

  // Test 4: Create Order
  console.log("Test 4: POST /api/orders");
  const order = await testEndpoint("Create Order", "POST", "/orders", {
    customer: {
      name: "Test User",
      email: "test@example.com",
      phone: "1234567890",
      address: "123 Test Street",
      city: "Test City",
      postalCode: "12345",
    },
    items: [
      {
        id: "test-product-1",
        name: "Test Product",
        price: 29.99,
        quantity: 2,
      },
    ],
    total: 59.98,
  });
  console.log(
    order.success
      ? `✅ PASSED (${order.status})`
      : `❌ FAILED (${order.status})`,
    order.data
  );
  console.log();

  // Test 5: Get Orders
  console.log("Test 5: GET /api/orders");
  const orders = await testEndpoint("Get Orders", "GET", "/orders");
  console.log(
    orders.success
      ? `✅ PASSED (${orders.status})`
      : `❌ FAILED (${orders.status})`,
    orders.data?.orders
      ? `Found ${orders.data.orders.length} orders`
      : orders.data
  );
  console.log();

  console.log("✅ Testing complete!");
}

runTests().catch(console.error);
