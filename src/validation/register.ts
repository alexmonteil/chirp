import z from "zod";

export const registerSchema = z.object({
  username: z.string().min(6),
  email: z.email(),
  password: z.string().min(8),
});
