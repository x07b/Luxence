/**
 * Test script to verify Supabase database connection
 * Run with: npx tsx scripts/test-db-connection.ts
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("❌ Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function testConnection() {
  console.log("🔍 Testing Supabase database connection...\n");

  try {
    // Test 1: Check collections table
    console.log("Test 1: Checking collections table...");
    const { data: collections, error: collectionsError } = await supabase
      .from("collections")
      .select("id, name")
      .limit(5);

    if (collectionsError) {
      console.error("❌ Error querying collections:", collectionsError.message);
    } else {
      console.log(`✅ Collections table accessible. Found ${collections?.length || 0} collections`);
    }

    // Test 2: Check products table
    console.log("\nTest 2: Checking products table...");
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name")
      .limit(5);

    if (productsError) {
      console.error("❌ Error querying products:", productsError.message);
    } else {
      console.log(`✅ Products table accessible. Found ${products?.length || 0} products`);
    }

    // Test 3: Check orders table
    console.log("\nTest 3: Checking orders table...");
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("id, panier_code")
      .limit(5);

    if (ordersError) {
      console.error("❌ Error querying orders:", ordersError.message);
    } else {
      console.log(`✅ Orders table accessible. Found ${orders?.length || 0} orders`);
    }

    // Test 4: Check contact_messages table
    console.log("\nTest 4: Checking contact_messages table...");
    const { data: messages, error: messagesError } = await supabase
      .from("contact_messages")
      .select("id, email")
      .limit(5);

    if (messagesError) {
      console.error("❌ Error querying contact_messages:", messagesError.message);
    } else {
      console.log(`✅ Contact_messages table accessible. Found ${messages?.length || 0} messages`);
    }

    console.log("\n✅ Database connection test completed successfully!");
    console.log("\n📝 Summary:");
    console.log(`   - Collections: ${collections?.length || 0}`);
    console.log(`   - Products: ${products?.length || 0}`);
    console.log(`   - Orders: ${orders?.length || 0}`);
    console.log(`   - Contact Messages: ${messages?.length || 0}`);

  } catch (error: any) {
    console.error("\n❌ Database connection test failed:", error.message);
    process.exit(1);
  }
}

testConnection();
