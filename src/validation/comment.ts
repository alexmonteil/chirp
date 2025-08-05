import { z } from "zod";

export const commentSchema = z.object({
  body: z.string().min(1, { message: "comment cannot be empty" }),
  chirpId: z
    .number()
    .int()
    .positive({ message: "chirpId must be a positive integer" }),
  authorId: z
    .number()
    .int()
    .positive({ message: "authorId must be a positive integer" }),
});
