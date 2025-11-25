import express from "express";
import analysisRoutes from "./analysis.js";
import chatRoutes from "./chat.js";
import highlightRoutes from "./highlight.js";
import riskRoutes from "./risk.js";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);


router.use("/analyze", analysisRoutes);
router.use("/chat", chatRoutes);
router.use("/highlight", highlightRoutes);
router.use("/risk", riskRoutes);

export default router;

