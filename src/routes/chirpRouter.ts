import { Hono } from "hono";
import { type Env } from "../types/env.js";
import { zValidator } from "@hono/zod-validator";
import { idSchema } from "../validation/id.js";
import { chirpSchema } from "../validation/chirp.js";
import { paginationSchema } from "../validation/pagination.js";
import { gt } from "drizzle-orm";
import { chirps } from "../db/schema.js";

// instantiate router
const chirpRouter = new Hono<Env>();

// define routes
chirpRouter.get("/", zValidator("query", paginationSchema), async (c) => {
  // validate query parameters for pagination
  const { cursor, limit } = c.req.valid("query");
  // fetch db
  const db = c.get("db");

  // build query dynamically
  const whereCondition = cursor ? gt(chirps.id, cursor) : undefined;
  const query = db
    .select()
    .from(chirps)
    .where(whereCondition)
    .limit(limit)
    .orderBy(chirps.id)
    .prepare("all_chirps_paginated");

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

chirpRouter.get("/:id", zValidator("param", idSchema), async (c) => {
  const { id } = c.req.valid("param");

  return c.json({
    message: `Fetched chirp with id: ${id}`,
  });
});

chirpRouter.post("/", zValidator("json", chirpSchema), async (c) => {
  const chirpData = c.req.valid("json");
  return c.json({ message: "Chirp created successfully" });
});

export default chirpRouter;
