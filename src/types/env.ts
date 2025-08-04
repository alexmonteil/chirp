import { type Logger } from "pino";
import { db } from "../db/db.js";

export interface Env {
  Variables: {
    logger: Logger;
    db: typeof db;
  };
}
