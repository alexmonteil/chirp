import { type Context, type Next } from "hono";
import { type Env } from "../types/env.js";
import { db } from "../db/db.js";

// middleware to attach the logger instance to the hono context
export const dbMiddleware = async (c: Context<Env>, next: Next) => {
  c.set("db", db);
  await next();
};
