const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env" });

async function runMigration() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL is not set in .env");
    process.exit(1);
  }

  const client = new Client({
    connectionString: dbUrl,
  });

  try {
    await client.connect();
    console.log("Connected to Postgres");

    const sqlPath = path.join(__dirname, "..", "supabase", "schema.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    console.log("Executing migration...");
    await client.query(sql);

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await client.end();
  }
}

runMigration();
