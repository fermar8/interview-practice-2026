import fs from "node:fs";
import path from "node:path";
import { Client } from "pg";

function loadEnvFile(filePath) {
  const envFile = fs.readFileSync(filePath, "utf8");
  const values = {};

  for (const line of envFile.split(/\r?\n/)) {
    if (!line || line.startsWith("#") || !line.includes("=")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");
    values[key] = value;
  }

  return values;
}

async function initDatabase() {
  const envPath = path.resolve(process.cwd(), ".env");
  const envValues = fs.existsSync(envPath) ? loadEnvFile(envPath) : {};
  const connectionString = process.env.DATABASE_URL || envValues.DATABASE_URL;

  if (!connectionString) {
    console.log(
      "DATABASE_URL not configured; skipping database initialization.",
    );
    return;
  }

  const client = new Client({ connectionString });

  try {
    await client.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS slots (
        id TEXT PRIMARY KEY,
        capacity INTEGER NOT NULL CHECK (capacity > 0),
        reserved INTEGER NOT NULL DEFAULT 0 CHECK (reserved >= 0)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id TEXT PRIMARY KEY,
        slot_id TEXT NOT NULL REFERENCES slots(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS reservation_slot_user_unique_idx
      ON reservations (slot_id, user_id);
    `);

    console.log("Database schema initialized successfully.");
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

await initDatabase();
