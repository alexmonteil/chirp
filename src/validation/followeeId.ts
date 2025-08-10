import z from "zod";

export const followSchema = z.object({
  followeeId: z
    .number()
    .int()
    .positive({ message: "followeeId must be a positive integer." }),
});
