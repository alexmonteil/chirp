import z from "zod";

export const registerSchema = z
  .object({
    username: z.string().min(6, "Username must be at least 6 characters."),
    email: z.email("Invalid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[a-z]/, "Password must contain a lowercase letter.")
      .regex(/[A-Z]/, "Password must contain an uppercase letter.")
      .regex(/[0-9]/, "Password must contain a number.")
      .regex(/[^a-zA-Z0-9]/, "Password must contain a special character."),
    passwordConfirm: z.string().min(8, "Password confirmation is required."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match.",
    path: ["passwordConfirm"],
  });
