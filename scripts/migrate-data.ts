/**
 * Migration script to import data from data.json to Supabase
 * Run with: npx tsx scripts/migrate-data.ts
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error(
    "Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface Product {
  id: string;
  collectionId: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  slug: string;
  pdfFile?: string | null;
  pdfFilename?: string | null;
  specifications: Array<{ label: string; value: string }>;
}

interface DataFile {
  collections: Collection[];
  products: Product[];
}

async function migrateData() {
  try {
    // Read data.json
    const dataPath = path.join(process.cwd(), "data.json");
    const dataContent = fs.readFileSync(dataPath, "utf-8");
    const data: DataFile = JSON.parse(dataContent);

    console.log("Starting migration...\n");

    // Migrate collections
    console.log("Migrating collections...");
    for (const collection of data.collections) {
      const { data: existing, error: checkError } = await supabase
        .from("collections")
        .select("id")
        .eq("id", collection.id)
        .single();

      if (existing) {
        console.log(`  Collection "${collection.name}" already exists, skipping...`);
        continue;
      }

      const { error: insertError } = await supabase
        .from("collections")
        .insert({
          id: collection.id,
          name: collection.name,
          slug: collection.slug,
          description: collection.description || "",
        });

      if (insertError) {
        console.error(`  Error inserting collection "${collection.name}":`, insertError.message);
      } else {
        console.log(`  ✓ Migrated collection: ${collection.name}`);
      }
    }

    // Migrate products
    console.log("\nMigrating products...");
    for (const product of data.products) {
      // Check if product already exists
      const { data: existing, error: checkError } = await supabase
        .from("products")
        .select("id")
        .eq("id", product.id)
        .single();

      if (existing) {
        console.log(`  Product "${product.name}" already exists, skipping...`);
        continue;
      }

      // Insert product
      const { error: productError } = await supabase
        .from("products")
        .insert({
          id: product.id,
          collection_id: product.collectionId || null,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category || "Uncategorized",
          slug: product.slug,
          pdf_file: product.pdfFile || null,
          pdf_filename: product.pdfFilename || null,
        });

      if (productError) {
        console.error(`  Error inserting product "${product.name}":`, productError.message);
        continue;
      }

      // Insert product images
      if (product.images && product.images.length > 0) {
        const imageRecords = product.images
          .filter((img) => img && img.trim())
          .map((img, index) => ({
            product_id: product.id,
            image_url: img,
            order_index: index,
          }));

        if (imageRecords.length > 0) {
          const { error: imagesError } = await supabase
            .from("product_images")
            .insert(imageRecords);

          if (imagesError) {
            console.error(
              `  Error inserting images for "${product.name}":`,
              imagesError.message
            );
          }
        }
      }

      // Insert product specifications
      if (product.specifications && product.specifications.length > 0) {
        const specRecords = product.specifications
          .filter((spec) => spec.label && spec.value)
          .map((spec, index) => ({
            product_id: product.id,
            label: spec.label,
            value: spec.value,
            order_index: index,
          }));

        if (specRecords.length > 0) {
          const { error: specsError } = await supabase
            .from("product_specifications")
            .insert(specRecords);

          if (specsError) {
            console.error(
              `  Error inserting specifications for "${product.name}":`,
              specsError.message
            );
          }
        }
      }

      console.log(`  ✓ Migrated product: ${product.name}`);
    }

    console.log("\n✓ Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateData();
