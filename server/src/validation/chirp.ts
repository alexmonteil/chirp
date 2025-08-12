import z from "zod";

export const chirpSchema = z.object({
  body: z
    .string()
    .min(1, { message: "chirp cannot be empty" })
    .max(280, { message: "chirp cannot exceed 280 characters." }),
  authorId: z
    .number()
    .int()
    .positive({ message: "authorId must be a positive integer." }),
});
