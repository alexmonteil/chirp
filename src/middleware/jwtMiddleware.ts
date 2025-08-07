import { jwt } from "hono/jwt";
import JWT_SECRET from "../dependencies/jwtDependency.js";

export const jwtMiddleware = jwt({ secret: JWT_SECRET });
