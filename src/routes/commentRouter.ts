import { zValidator } from "@hono/zod-validator";
import { eq, gt } from "drizzle-orm";
import { Hono } from "hono";
import { comments } from "../db/schema.js";
import { jwtMiddleware } from "../middleware/jwtMiddleware.js";
import { type Env } from "../types/env.js";
import { commentSchema } from "../validation/comment.js";
import { idSchema } from "../validation/id.js";
import { paginationSchema } from "../validation/pagination.js";
import { updateCommentSchema } from "../validation/updateComment.js";

const commentRouter = new Hono<Env>();

// register middleware
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

// POST /comments
commentRouter.post("/", zValidator("json", commentSchema), async (c) => {});

// PATCH /comments/:id
commentRouter.patch(
  "/:id",
  zValidator("param", updateCommentSchema),
  async (c) => {
    const { id, body } = c.req.valid("param");
    const db = c.get("db");
    const commentToPatch = await db.query.comments.findFirst({
      where: eq(comments.id, id),
    });

    if (!commentToPatch) {
      c.json({ message: "Comment not found." }, 404);
    }

    const authenticatedId = c.get("jwtPayload").sub as number;

    if (commentToPatch?.authorId !== authenticatedId) {
      c.json({ message: "Unauthorized Action." }, 403);
    }

    const patchedComment = await db
      .update(comments)
      .set({ body })
      .where(eq(comments.id, id))
      .returning();

    c.json(patchedComment);
  }
);

// DELETE /comments/:id
commentRouter.delete("/:id", zValidator("param", idSchema), async (c) => {});

export default commentRouter;
