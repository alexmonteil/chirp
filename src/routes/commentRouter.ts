import { Hono } from "hono";
import { type Env } from "../types/env.js";

// instantiate router
const commentRouter = new Hono<Env>();

// defines routes
commentRouter.get("/", (c) => {
  return c.json([
    { id: 1, body: "I am comment 1", chirpId: 1 },
    { id: 2, body: "I am comment 2", chirpId: 2 },
  ]);
});

export default commentRouter;
