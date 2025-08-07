import type { JwtVariables } from "hono/jwt";
import { type Logger } from "pino";
import { db } from "../db/db.js";

export interface Env {
  Variables: {
    jwtVariables: JwtVariables;
    db: typeof db;
    logger: Logger;
    JWT_SECRET: string;
    HASH_SALT_ROUNDS: number;
  };
}
