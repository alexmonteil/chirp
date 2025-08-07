import "dotenv/config";
import { type Context, type Next } from "hono";
import { type Env } from "../types/env.js";
import { safeParse } from "../utils/utils.js";
import { saltRoundsSchema } from "../validation/saltRounds.js";
import { db } from "../db/db.js";
import logger from "../logger.js";

const HASH_SALT_ROUNDS = safeParse<number>(
  saltRoundsSchema,
  process.env.HASH_SALT_ROUNDS,
  10
);

export const dependenciesMiddleware = async (c: Context<Env>, next: Next) => {
  c.set("db", db);
  c.set("logger", logger);
  c.set("HASH_SALT_ROUNDS", HASH_SALT_ROUNDS);
  await next();
};
