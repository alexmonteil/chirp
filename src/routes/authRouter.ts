import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { credentials, users } from "../db/schema.js";
import JWT_SECRET from "../dependencies/jwtDependency.js";
import { jwtMiddleware } from "../middleware/jwtMiddleware.js";
import { type Env } from "../types/env.js";
import { loginSchema } from "../validation/login.js";
import { registerSchema } from "../validation/register.js";
import { verifyTokenSchema } from "../validation/verifyToken.js";

const authRouter = new Hono<Env>();

// register middleware
authRouter.use("/me", jwtMiddleware);

// ROUTES

// POST /register
authRouter.post("/register", zValidator("json", registerSchema), async (c) => {
  const { username, email, password } = c.req.valid("json");
  const db = c.get("db");
  const HASH_SALT_ROUNDS = c.get("HASH_SALT_ROUNDS");

  // hash the password
  const passwordHash = await bcrypt.hash(password, HASH_SALT_ROUNDS);

  // generate a verification token
  const verifyToken = crypto.randomBytes(32).toString("hex");
  const verifyTokenExpiration = new Date(Date.now() + 3600000); // Expires in 1 hour

  await db.transaction(async (tx) => {
    // create the user record
    const newUser = await tx
      .insert(users)
      .values({ username, email })
      .returning();

    // create the credentials record
    await tx.insert(credentials).values({
      userId: newUser[0].id,
      passwordHash,
      verifyToken,
      verifyTokenExpiration,
    });
  });

  const verificationLink = `http://localhost:3000/auth/verify?token=${verifyToken}`;

  // For now just log the link to test
  // Later we will email with a service like nodemailer
  console.log(`Verification Link: ${verificationLink}`);

  return c.json(
    {
      message:
        "Successful registration. Please check your email for a verification link.",
    },
    201
  );
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
    exp: Math.floor(Date.now() + 3600000), // Expires in 1 hour
  };

  const jwt = await sign(jwtPayload, JWT_SECRET);
  return c.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    token: jwt,
  });
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

  const jwtPayload = {
    sub: updatedUser.id,
    email: updatedUser.email,
    exp: Math.floor(Date.now() + 3600000), // Expires in 1 hour
  };

  const jwt = await sign(jwtPayload, JWT_SECRET);

  return c.json(
    {
      user: updatedUser,
      token: jwt,
    },
    200
  );
});

// GET /me
authRouter.get("/me", async (c) => {
  const jwtPayload = c.get("jwtPayload");
  const db = c.get("db");
  const user = await db.query.users.findFirst({
    where: eq(users.id, jwtPayload.sub as number),
  });

  if (!user) {
    return c.json({ message: "User not found." }, 404);
  }

  return c.json(user);
});

export default authRouter;
