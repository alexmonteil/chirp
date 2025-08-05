import type { JwtVariables } from "hono/jwt";
import type { db } from "../db/db.js";

export type AuthEnv = {
  Variables: {
    jwtVariables: JwtVariables;
    db: typeof db;
  };
};
