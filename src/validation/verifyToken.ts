import z from "zod";

// Zod schema for the verify token returned from crypto.randomBytes(32).toString("hex")
export const verifyTokenSchema = z.object({
  token: z
    .string()
    .length(64) // <-- Check for the exact length (32 bytes * 2 hex chars)
    .regex(/^[0-9a-f]+$/i, "Invalid token format."), // <-- Check for hexadecimal characters
});
