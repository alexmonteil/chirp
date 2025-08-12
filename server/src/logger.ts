import pinoFactory from "pino";

const isDev = process.env.NODE_ENV !== "production";

// define the transport based on the environment
const transport = isDev
  ? {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    }
  : undefined;

// create the logger instance
const logger = pinoFactory.default({
  level: process.env.PINO_LOG_LEVEL || "info",
  transport: transport,
});

export default logger;
