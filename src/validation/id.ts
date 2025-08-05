import { z } from "zod";

// Zod schema for path parameter: id
export const idSchema = z.object({
  id: z.coerce.number().int().positive(),
});
