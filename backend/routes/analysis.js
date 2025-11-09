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
        error: "Please provide sufficient document text for analysis.",
      });
    }

    const prompt = `
You are an expert legal assistant. Analyze the following legal document text and provide a clear, easy-to-understand summary.

Document Text:
${text}

Your task:
1. Summarize what this document is about (type of agreement, purpose, parties involved).
2. Highlight the key legal points or clauses (e.g., payment terms, liability, termination, refund, confidentiality, jurisdiction).
3. Identify potential risks or obligations for each party.
4. Give your analysis in plain English (no legal jargon).
5. End with a short overall verdict — e.g., “This agreement protects the company more than the client.”

Your response should be structured like this:

**📄 Summary:**
(Brief 3–4 line overview)

**⚖️ Key Legal Points:**
- Clause 1: ...
- Clause 2: ...
- Clause 3: ...

**🚨 Risks & Obligations:**
- Party A: ...
- Party B: ...

**🧾 Legal View:**
(Short interpretation or opinion)
`;

    const geminiApiUrl =
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=" +
      process.env.GEMINI_API_KEY;

    const response = await axios.post(geminiApiUrl, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    const summary =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No analysis available from Gemini.";

    res.json({ summary });
  } catch (err) {
    console.error("Analysis error:", err.message);
    res.status(500).json({
      error: err.response?.data?.error?.message || "Failed to analyze document.",
    });
  }
});

export default router;
