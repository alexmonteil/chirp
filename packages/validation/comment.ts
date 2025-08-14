import z from "zod";

export const commentSchema = z.object({
  body: z
    .string()
    .min(1, { message: "Comment cannot be empty." })
    .max(280, { message: "Comment cannot exceed 280 characters." }),
  chirpId: z
    .number()
    .int()
    .positive({ message: "chirpId must be a positive integer." }),
  authorId: z
    .number()
    .int()
    .positive({ message: "authorId must be a positive integer." }),
});
