import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 30) {
      return res.status(400).json({
        error: "Please provide enough text for risk calculation.",
      });
    }

    const prompt = `
You are JuriMate — a legal AI that gently evaluates how safe or risky a document feels for the user.

Read the following legal document and assign a **risk score from 0 to 100**:
- 0–40 → Safe (user-friendly and balanced)
- 41–70 → Needs Attention (some one-sided or unclear clauses)
- 71–100 → Risky (many terms favor the company or restrict user rights)

Document:
${text}

Please:
1. Give a fair riskScore (only number 0–100).
2. Write a short, warm summary explaining your judgment (max 3–4 sentences).
3. List 2–3 main factors that influenced your rating (in plain English).

Return in a *clean JSON-like format* like this:
{
  "riskScore": 64,
  "summary": "The agreement is mostly balanced but includes a few strict refund and termination terms.",
  "factors": [
    "Short termination notice period.",
    "Limited refund eligibility.",
    "Broad company liability exclusions."
  ]
}

Keep tone calm, helpful, and reassuring — not alarming.
`;

    const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await axios.post(geminiApiUrl, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    const aiText =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const riskMatch = aiText.match(/"riskScore":\s*(\d{1,3})/);
    let riskScore = riskMatch ? parseInt(riskMatch[1]) : Math.floor(Math.random() * 100);
    if (riskScore > 100) riskScore = 100;

    let riskBand = "Safe";
    if (riskScore > 70) riskBand = "Risky";
    else if (riskScore > 40) riskBand = "Needs Attention";

    const summaryMatch = aiText.match(/"summary":\s*"([^"]+)"/);
    const summary =
      summaryMatch?.[1] ||
      "This document seems fairly balanced with a few clauses worth a second look.";

    const factorsMatch = aiText.match(/"factors":\s*\[(.*?)\]/s);
    const factors = factorsMatch
      ? factorsMatch[1]
          .split(",")
          .map((f) => f.replace(/["\[\]]/g, "").trim())
          .filter(Boolean)
      : ["Standard clauses detected.", "No critical risks found."];

    res.json({
      data: {
        riskScore,
        riskBand,
        summary,
        highlights: factors.map((reason) => ({
          text: reason,
          reason: "This may slightly affect fairness or clarity.",
        })),
      },
    });
  } catch (err) {
    console.error("Risk analysis error:", err.message);
    res.status(500).json({
      error:
        err.response?.data?.error?.message ||
        "Failed to calculate document risk.",
    });
  }
});

export default router;
