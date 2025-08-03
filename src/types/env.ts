import { type Logger } from "pino";

export interface Env {
  Variables: {
    logger: Logger;
  };
}
