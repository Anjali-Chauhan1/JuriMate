import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

export function createServer() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN?.split(",") || "*",
      credentials: true
    })
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
  }

  app.get("/", (req, res) => res.send("⚖️ JuriMate Backend is Live!"));
  app.use("/api", routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
