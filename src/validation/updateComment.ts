import z from "zod";

export const updateCommentSchema = z.object({
  body: z
    .string()
    .min(1, { message: "Comment cannot be empty." })
    .max(280, { message: "Comment cannot exceed 280 characters." }),
});
