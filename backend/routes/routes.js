import express from "express";
import analysisRoutes from "./analysis.js";
import chatRoutes from "./chat.js";
import highlightRoutes from "./highlight.js";
import riskRoutes from "./risk.js";

const router = express.Router();

router.use("/analysis", analysisRoutes);
router.use("/chat", chatRoutes);
router.use("/highlight", highlightRoutes);
router.use("/risk", riskRoutes);

export default router;
