import { Hono } from "hono";
import { authMiddleware } from "../middleware/authMiddleware.js";
import type { Env } from "../types/env.js";

const userRouter = new Hono<Env>();

// register middleware
userRouter.use(authMiddleware);

export default userRouter;
