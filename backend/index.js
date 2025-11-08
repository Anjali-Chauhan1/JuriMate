import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.js";
import { createServer } from "./app.js";

const PORT = process.env.PORT || 8080;

(async () => {
  await connectDB();
  const app = createServer();
  app.listen(PORT, () => {
    console.log(`⚖️  JuriMate backend running on http://localhost:${PORT}`);
  });
})();
