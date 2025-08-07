import { Hono } from "hono";
import { type Env } from "../types/env.js";
import { zValidator } from "@hono/zod-validator";
import { paginationSchema } from "../validation/pagination.js";
import { eq, gt } from "drizzle-orm";
import { comments } from "../db/schema.js";
import { idSchema } from "../validation/id.js";
import { jwtMiddleware } from "../middleware/jwtMiddleware.js";

const commentRouter = new Hono<Env>();

commentRouter.use(jwtMiddleware);

// ROUTES

// GET /comments
commentRouter.get("/", zValidator("query", paginationSchema), async (c) => {
  const { cursor, limit } = c.req.valid("query");
  const db = c.get("db");
  const whereCondition = cursor ? gt(comments.id, cursor) : undefined;
  const query = db
    .select()
    .from(comments)
    .where(whereCondition)
    .limit(limit)
    .orderBy(comments.id)
    .prepare("comments_paginated");

  const result = await query.execute();
  const nextCursor = result.length > 0 ? result[result.length - 1].id : null;

  return c.json({
    data: result,
    metadata: {
      next_cursor: nextCursor,
      count: result.length,
      limit: limit,
    },
  });
});

// GET /comments/:id
commentRouter.get("/:id", zValidator("param", idSchema), async (c) => {
  const { id } = c.req.valid("param");
  const db = c.get("db");
  const comment = await db.query.comments.findFirst({
    where: eq(comments.id, id),
  });

  if (!comment) {
    return c.json({ message: "Comment not found." }, 404);
  }

  return c.json(comment);
});

export default commentRouter;
