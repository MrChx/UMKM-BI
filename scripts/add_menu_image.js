const { Client } = require("pg");
require("dotenv").config({ path: ".env" });

async function addMenuImageColumn() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("❌ DATABASE_URL is not set in .env");
    process.exit(1);
  }

  const client = new Client({
    connectionString: dbUrl,
  });

  try {
    await client.connect();
    console.log("✅ Connected to Postgres");

    // Add menu_image_url to businesses
    await client.query(`
      ALTER TABLE public.businesses
      ADD COLUMN IF NOT EXISTS menu_image_url text;
    `);

    // Add menu_image_url to submissions
    await client.query(`
      ALTER TABLE public.submissions
      ADD COLUMN IF NOT EXISTS menu_image_url text;
    `);

    console.log("🎉 Successfully added menu_image_url columns!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await client.end();
  }
}

addMenuImageColumn();
