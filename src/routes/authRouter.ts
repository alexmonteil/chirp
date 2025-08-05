import { Hono } from "hono";
import type { AuthEnv } from "../types/authEnv.js";
import { zValidator } from "@hono/zod-validator";
import { registerSchema } from "../validation/register.js";
import { loginSchema } from "../validation/login.js";
import bcrypt from "bcrypt";
import { saltRoundsSchema } from "../validation/saltRounds.js";
import { safeParse } from "../utils/utils.js";

const authRouter = new Hono<AuthEnv>();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

const HASH_SALT_ROUNDS = safeParse<number>(
  saltRoundsSchema,
  process.env.HASH_SALT_ROUNDS,
  10
);

// ROUTES

// POST /register
authRouter.post("/register", zValidator("json", registerSchema), async (c) => {
  const { username, email, password } = c.req.valid("json");
});

// POST /login
authRouter.post("/login", zValidator("json", loginSchema), async (c) => {});

export default authRouter;
