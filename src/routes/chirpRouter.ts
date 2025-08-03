import { Hono } from "hono";
import { type Env } from "../types/env.js";
import { zValidator } from "@hono/zod-validator";
import { idSchema } from "../validation/id.js";
import { chirpSchema } from "../validation/chirp.js";

// instantiate router
const chirpRouter = new Hono<Env>();

// define routes
chirpRouter.get("/", (c) => {
  const logger = c.get("logger");
  logger.info("Received GET /chirps");
  return c.json([
    { id: 1, name: "chirp 1" },
    { id: 2, name: "chirp 2" },
  ]);
});

chirpRouter.get("/:id", zValidator("param", idSchema), async (c) => {
  const { id } = c.req.valid("param");
  const logger = c.get("logger");
  logger.info(`Received GET /chirps/${id}`);
  return c.json({
    message: `Fetched chirp with id: ${id}`,
  });
});

chirpRouter.post("/", zValidator("json", chirpSchema), async (c) => {
  const chirpData = c.req.valid("json");
  const logger = c.get("logger");
  logger.info({ chirpData }, "Valid chirp data received");
  return c.json({ message: "Chirp created successfully" });
});

export default chirpRouter;
