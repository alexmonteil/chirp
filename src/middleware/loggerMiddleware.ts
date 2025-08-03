import { type Context, type Next } from "hono";
import logger from "../logger.js";
import { type Env } from "../types/env.js";

// middleware to attach the logger instance to the hono context
export const loggerMiddleware = async (c: Context<Env>, next: Next) => {
  c.set("logger", logger);
  await next();
};
