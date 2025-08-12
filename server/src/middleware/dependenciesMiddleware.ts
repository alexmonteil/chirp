import "dotenv/config";
import { type Context, type Next } from "hono";
import { db } from "../db/db.js";
import { HASH_SALT_ROUNDS } from "../dependencies/bcryptDependency.js";
import { transporter } from "../dependencies/nodemailerDependency.js";
import logger from "../logger.js";
import { type Env } from "../types/env.js";
import { cloudinaryClient } from "../dependencies/cloudinaryDependency.js";

export const dependenciesMiddleware = async (c: Context<Env>, next: Next) => {
  c.set("db", db);
  c.set("logger", logger);
  c.set("HASH_SALT_ROUNDS", HASH_SALT_ROUNDS);
  c.set("nodemailer", transporter);
  c.set("cloudinaryClient", cloudinaryClient);
  await next();
};
