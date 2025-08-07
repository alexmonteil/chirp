import type { JwtVariables } from "hono/jwt";
import { type Logger } from "pino";
import { db } from "../db/db.js";
import type { transporter } from "../dependencies/nodemailerDependency.js";

export interface Env {
  Variables: {
    jwtVariables: JwtVariables;
    db: typeof db;
    logger: Logger;
    HASH_SALT_ROUNDS: number;
    nodemailer: typeof transporter;
  };
}
