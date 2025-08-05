import z from "zod";

// Zod schema to safe parse HASH_SALT_ROUNDS from environment variables
export const saltRoundsSchema = z.coerce
  .number()
  .int()
  .positive()
  .optional()
  .default(10);
