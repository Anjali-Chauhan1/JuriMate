import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/routes.js"; 
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("⚖️ JuriMate Backend is Live!");
});

app.use("/api", routes);

app.use(errorHandler);

export default app;
