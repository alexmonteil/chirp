import { z } from "zod";

export const chirpSchema = z.object({
  body: z.string().min(1, { message: "chirp cannot be empty" }),
  authorId: z
    .number()
    .int()
    .positive({ message: "authorId must be a positive integer" }),
});
