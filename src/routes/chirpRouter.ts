import { Hono } from "hono";
import { type Env } from "../types/env.js";
import { zValidator } from "@hono/zod-validator";
import { idSchema } from "../validation/id.js";
import { chirpSchema } from "../validation/chirp.js";
import { paginationSchema } from "../validation/pagination.js";
import { gt, eq } from "drizzle-orm";
import { chirps } from "../db/schema.js";
import { jwt } from "hono/jwt";

const chirpRouter = new Hono<Env>();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

// register middleware
chirpRouter.use(jwt({ secret: JWT_SECRET }));

// ROUTES

// GET /chirps
chirpRouter.get("/", zValidator("query", paginationSchema), async (c) => {
  const { cursor, limit } = c.req.valid("query");
  const db = c.get("db");
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

// GET /chirps/:id
chirpRouter.get("/:id", zValidator("param", idSchema), async (c) => {
  const { id } = c.req.valid("param");
  const db = c.get("db");
  const chirp = await db.query.chirps.findFirst({
    where: eq(chirps.id, id),
  });

  if (!chirp) {
    return c.json({ message: "Chirp not found" }, 404);
  }

  return c.json(chirp);
});

// POST /chirps
chirpRouter.post("/", zValidator("json", chirpSchema), async (c) => {
  const chirpData = c.req.valid("json");
  const db = c.get("db");
  const insertedChirps = await db
    .insert(chirps)
    .values({
      body: chirpData.body,
      authorId: chirpData.authorId,
    })
    .returning();

  if (!insertedChirps.length) {
    return c.json({ message: "Failed to create chirp" }, 500);
  }

  return c.json(insertedChirps[0], 201);
});

// DELETE /chirps/:id
chirpRouter.delete("/:id", zValidator("param", idSchema), async (c) => {
  const { id } = c.req.valid("param");
  const userIdFromJwt = c.get("jwtPayload").sub;
  const db = c.get("db");

  const chirpToDelete = await db.query.chirps.findFirst({
    where: eq(chirps.id, id),
  });

  if (!chirpToDelete) {
    c.json({ message: "Chirp not found." }, 404);
  }

  if (chirpToDelete?.authorId !== userIdFromJwt) {
    c.json({ message: "Unauthorized Action." }, 403);
  }

  await db.delete(chirps).where(eq(chirps.id, id));
  return c.body(null, 204);
});

export default chirpRouter;
