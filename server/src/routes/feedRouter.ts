import { zValidator } from "@hono/zod-validator";
import { and, eq, gt, sql } from "drizzle-orm";
import { Hono } from "hono";
import { chirps, follows } from "../db/schema.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import type { Env } from "../types/env.js";
import { paginationSchema } from "@shared/validation/pagination.js";

const feedRouter = new Hono<Env>();

// register middleware
feedRouter.use(authMiddleware);

// ROUTES

// GET /feed
feedRouter.get("/", zValidator("query", paginationSchema), async (c) => {
  const authenticatedId = c.get("jwtPayload").sub as number;
  const { cursor, limit } = c.req.valid("query");
  const db = c.get("db");
  const cursorCondition = cursor ? gt(chirps.id, cursor) : undefined;

  try {
    const query = db
      .select()
      .from(chirps)
      .innerJoin(follows, eq(chirps.authorId, follows.followeeId))
      .where(and(eq(follows.followerId, authenticatedId), cursorCondition))
      .limit(limit)
      .orderBy(sql`${chirps.createdAt} dsc`)
      .prepare("user_feed_paginated");

    const result = await query.execute();

    if (!result.length) {
      return c.json({ message: "No chirps in your feed." }, 404);
    }

    // next cursor will be the ID of the last chirp in the current result set
    const nextCursor =
      result.length > 0 ? result[result.length - 1].chirps.id : null;

    return c.json({
      data: result.map((row) => row.chirps), // return only the chirp data
      metadata: {
        next_cursor: nextCursor,
        count: result.length,
        limit: limit,
      },
    });
  } catch (error) {
    c.get("logger").error(error, "Failed to retrieve user feed.");
    return c.json({ message: "Failed to retrieve user feed." }, 500);
  }
});

export default feedRouter;
