import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle", // The directory where migration files will be created
  driver: "pglite",
  dbCredentials: {
    url: process.env.DATABASE_URL!, // DB connection string from environment
  },
});
