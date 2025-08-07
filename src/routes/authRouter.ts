import { Hono } from "hono";
import type { AuthEnv } from "../types/authEnv.js";
import { zValidator } from "@hono/zod-validator";
import { sign } from "hono/jwt";
import { registerSchema } from "../validation/register.js";
import { loginSchema } from "../validation/login.js";
import bcrypt from "bcrypt";
import { saltRoundsSchema } from "../validation/saltRounds.js";
import { safeParse } from "../utils/utils.js";
import { credentials, users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { verifyTokenSchema } from "../validation/verifyToken.js";
import { timestamptz } from "drizzle-orm/gel-core";

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
  const passwordHash = await bcrypt.hash(password, HASH_SALT_ROUNDS);
  const db = c.get("db");

  const result = await db.transaction(async (tx) => {
    // create the user record
    const newUser = await tx
      .insert(users)
      .values({ username, email })
      .returning();

    // create the credentials record
    await tx
      .insert(credentials)
      .values({ userId: newUser[0].id, passwordHash });
    return newUser[0];
  });

  return c.json(result, 201);
});

// POST /login
authRouter.post("/login", zValidator("json", loginSchema), async (c) => {
  const { email, password } = c.req.valid("json");
  const db = c.get("db");
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    with: {
      credentials: true,
    },
  });

  // check user exists
  if (!user || !user.credentials) {
    return c.json({ message: "Invalid email or password." }, 401);
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.credentials.passwordHash
  );

  // check password
  if (!isPasswordValid) {
    return c.json({ message: "Invalid email or password." }, 401);
  }

  // check user has verified status
  if (!user.isEmailVerified) {
    return c.json(
      {
        message:
          "Account not verified. Please check your email for a verification link.",
      },
      403
    );
  }

  const jwtPayload = {
    sub: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };

  const token = await sign(jwtPayload, JWT_SECRET);
  return c.json({ token });
});

// GET /verify
authRouter.get("/verify", zValidator("query", verifyTokenSchema), async (c) => {
  const { token } = c.req.valid("query");
  const now = new Date();
  const db = c.get("db");
  const credentialsRecord = await db.query.credentials.findFirst({
    where: eq(credentials.verifyToken, token),
    with: {
      user: true,
    },
  });

  if (
    !credentialsRecord ||
    !credentialsRecord.verifyTokenExpiration ||
    now > credentialsRecord.verifyTokenExpiration
  ) {
    return c.json(
      { message: "Invalid, expired, or missing verification token" },
      400
    );
  }

  const updatedUser = await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({ isEmailVerified: true })
      .where(eq(users.id, credentialsRecord.userId));

    await tx
      .update(credentials)
      .set({ verifyToken: null, verifyTokenExpiration: null })
      .where(eq(credentials.userId, credentialsRecord.userId));

    return tx.query.users.findFirst({
      where: eq(users.id, credentialsRecord.userId),
    });
  });

  if (!updatedUser) {
    return c.json({ message: "Failed to verify account." }, 500);
  }

  return c.json(updatedUser, 200);
});

export default authRouter;
