import { zValidator } from "@hono/zod-validator";
import { and, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { follows, users } from "../db/schema.js";
import type { Env } from "../types/env.js";
import { followSchema as followeeIdSchema } from "@shared/validation/followeeId.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const followRouter = new Hono<Env>();

// register middleware
followRouter.use(authMiddleware);

// ROUTES

// POST /follows
followRouter.post("/", zValidator("json", followeeIdSchema), async (c) => {
  const authenticatedId = c.get("jwtPayload").sub as number;
  const { followeeId } = c.req.valid("json");
  const db = c.get("db");
  const logger = c.get("logger");

  try {
    await db.transaction(async (tx) => {
      const followeeUser = await tx.query.users.findFirst({
        where: eq(users.id, followeeId),
      });

      if (!followeeUser) {
        throw new Error("Target user not found.");
      }

      await tx
        .insert(follows)
        .values({ followerId: authenticatedId, followeeId });

      const newCount = (followeeUser.followersCount ?? 0) + 1;
      await tx
        .update(users)
        .set({ followersCount: newCount })
        .where(eq(users.id, followeeId));
    });

    return c.body(null, 201);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Target user not found.")
    ) {
      return c.json({ message: error.message }, 404);
    }

    if (
      error instanceof Error &&
      error.message.includes("violates unique constraint")
    ) {
      return c.json({ message: "Already following this user." }, 409);
    }

    logger.error(error, "Follow transaction failed.");
    return c.json({ message: "Failed to perform follow action." }, 500);
  }
});

// DELETE /follows/:followeeId
followRouter.delete(
  "/:followeeId",
  zValidator("param", followeeIdSchema),
  async (c) => {
    const db = c.get("db");
    const logger = c.get("logger");
    const authenticatedId = c.get("jwtPayload").sub as number;
    const { followeeId } = c.req.valid("param");

    try {
      let affectedRows = 0;

      await db.transaction(async (tx) => {
        const deleteResult = await tx
          .delete(follows)
          .where(
            and(
              eq(follows.followerId, authenticatedId),
              eq(follows.followeeId, followeeId)
            )
          )
          .returning();

        affectedRows = deleteResult.length;

        // If the follow record existed, decrement the followersCount
        if (affectedRows > 0) {
          await tx
            .update(users)
            .set({
              followersCount: sql`${users.followersCount} - 1`,
            })
            .where(eq(users.id, followeeId));
        }
      });

      if (!affectedRows) {
        // If no rows were affected, it means the follow record was not found
        return c.json({ message: "Follow record not found." }, 404);
      }

      return c.body(null, 204);
    } catch (error) {
      logger.error(error, "Unfollow transaction failed.");
      return c.json({ message: "Failed to perform unfollow action." }, 500);
    }
  }
);

export default followRouter;
