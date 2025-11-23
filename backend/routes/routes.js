import express from "express";
import mongoose from "mongoose";
import analysisRoutes from "./analysis.js";
import chatRoutes from "./chat.js";
import highlightRoutes from "./highlight.js";
import riskRoutes from "./risk.js";
import { signup,login } from "../controllers/authController.js";

const router = express.Router();

router.use("/signup", signup);
router.use("/login", login);
router.use("/analyze", analysisRoutes);
router.use("/chat", chatRoutes);
router.use("/highlight", highlightRoutes);
router.use("/risk", riskRoutes);

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("MongoDB connected");
})
.catch((err) => {
    console.error("MongoDB connection error:", err);
});

export default router;

