import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { cloudinaryClient } from "../dependencies/cloudinaryDependency.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import type { Env } from "../types/env.js";
import { uploadRequestSchema } from "../validation/uploadRequest.js";

const userRouter = new Hono<Env>();

// register middleware
userRouter.use(authMiddleware);

// ROUTES

// POST /upload-signature
userRouter.post(
  "/upload-signature",
  zValidator("json", uploadRequestSchema),
  async (c) => {
    const authenticatedId = c.get("jwtPayload").sub as number;
    const timestamp = Math.round(Date.now() / 1000); // get current time in seconds
    const paramsToSign = {
      timestamp,
      public_id: `user_avatars/${authenticatedId}`,
      folder: "user_avatars",
    };

    const signature = cloudinaryClient.utils.api_sign_request(
      paramsToSign,
      cloudinaryClient.config().api_secret! // Environment var is parsed safely with error thrown if null or undefined
    );

    return c.json({
      signature,
      timestamp,
      cloudName: cloudinaryClient.config().cloud_name,
      apiKey: cloudinaryClient.config().api_key,
      public_id: paramsToSign.public_id,
    });
  }
);

export default userRouter;
