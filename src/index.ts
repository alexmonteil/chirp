import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { dependenciesMiddleware } from "./middleware/dependenciesMiddleware.js";
import authRouter from "./routes/authRouter.js";
import chirpRouter from "./routes/chirpRouter.js";
import commentRouter from "./routes/commentRouter.js";
import { type Env } from "./types/env.js";
import followRouter from "./routes/followRouter.js";

const app = new Hono<Env>();

// register middleware
app.use(dependenciesMiddleware);

// register routes
app.route("/auth", authRouter);
app.route("/chirps", chirpRouter);
app.route("/comments", commentRouter);
app.route("/follows", followRouter);

// run the server
const server = serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

// handle manual interrupt
process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});

// handle process interrupt
process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
});
