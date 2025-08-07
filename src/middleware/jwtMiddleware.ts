import { jwt } from "hono/jwt";
import JWT_SECRET from "../dependencies/dependencies.js";

export const jwtMiddleware = jwt({ secret: JWT_SECRET });
