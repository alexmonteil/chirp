import { drizzle } from "drizzle-orm/postgres-js";
import { Client } from "pg";
import * as schema from "./schema.js";

// db connection url
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("DATABASE_URL environment variable not set");
}

const client = new Client({
  connectionString: dbUrl,
});

await client.connect();

export const db = drizzle(client, { schema });
