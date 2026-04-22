import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;
let initError: Error | null = null;

function initSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    initError = new Error(
      "Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment",
    );
    throw initError;
  }

  // Create Supabase client with service role key for admin operations
  // This bypasses RLS policies, so use only on the server side
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Lazy initialization - only creates client when accessed
// If init fails, subsequent calls will throw with a clear error message
function getSupabase(): SupabaseClient {
  if (initError) {
    throw initError;
  }
  if (!supabaseClient) {
    supabaseClient = initSupabaseClient();
  }
  return supabaseClient;
}

// Export as an object that proxies all property access
// This allows routes to use `supabase.from()` syntax
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase();
    const value = (client as any)[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
