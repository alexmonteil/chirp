import { z } from "zod";

// Zod schema for id params
export const idSchema = z.object({
  id: z.coerce.number().int().positive(),
});
