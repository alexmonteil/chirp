import { z } from "zod";

// Zod schema for query parameters for pagination
export const paginationSchema = z.object({
  cursor: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(30).optional().default(10),
});
