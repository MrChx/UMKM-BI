const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env" });

async function runSeed() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL is not set in .env");
    process.exit(1);
  }

  const client = new Client({ connectionString: dbUrl });

  try {
    await client.connect();
    console.log("Connected to Postgres");

    const sqlPath = path.join(__dirname, "..", "supabase", "seed.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    console.log("Running seeder...");
    await client.query(sql);

    const res = await client.query("SELECT COUNT(*) FROM public.businesses");
    console.log(`Seeding complete! Total businesses: ${res.rows[0].count}`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await client.end();
  }
}

runSeed();
