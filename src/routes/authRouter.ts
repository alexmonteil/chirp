import { Hono } from "hono";
import type { AuthEnv } from "../types/authEnv.js";
import { zValidator } from "@hono/zod-validator";
import { registerSchema } from "../validation/register.js";
import { loginSchema } from "../validation/login.js";

const authRouter = new Hono<AuthEnv>();

// ROUTES

// POST /register
authRouter.post(
  "/register",
  zValidator("json", registerSchema),
  async (c) => {}
);

// POST /login
authRouter.post("/login", zValidator("json", loginSchema), async (c) => {});

export default authRouter;
