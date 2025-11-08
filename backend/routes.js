import express from "express";
import { analyzeDocument } from "./controllers/analyzeController.js";
import { handleChat } from "./controllers/chatController.js";
import { getLawyers, addLawyer } from "./controllers/lawyerController.js";
import { getTips } from "./controllers/tipsController.js";

const router = express.Router();

// 🧩 Analyze document or image
router.post("/analyze", analyzeDocument);

// 💬 Live Chat with AI
router.post("/chat", handleChat);

// ⚖️ Lawyer APIs
router.get("/lawyers", getLawyers);
router.post("/lawyers", addLawyer);

// 💡 Tips
router.get("/tips", getTips);

export default router;
