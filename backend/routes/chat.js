import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message, document } = req.body;

    if (!message || !document) {
      return res
        .status(400)
        .json({ error: "Both message and document are required." });
    }

    const prompt = document && document.trim()
      ? `
You are JuriMate — an intelligent AI Legal Assistant.
You have been given a legal document and a user's question.
Answer ONLY using the document content, and from a legal point of view.

Document:
${document}

User Question:
${message}

Instructions:
- Analyze the question in context of the document.
- Quote or refer to relevant clauses where applicable.
- Explain in plain English, avoiding legal jargon.
- If the document doesn't contain the answer, clearly say: "This point isn't specified in the document."
- Keep the answer short (3–6 lines) and precise.
- Avoid adding made-up information.

Respond in this format:

**🧾 Answer:**
(Your concise answer here)

**📚 Reference:**
(If applicable, mention the clause or section)
`
      : "";

    const geminiApiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
      process.env.GEMINI_API_KEY;

    const response = await axios.post(geminiApiUrl, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No response from AI.";

    res.json({ reply });
  } catch (err) {
    console.error("Chat route error:", err.message);
    res.status(500).json({
      error:
        err.response?.data?.error?.message || "Failed to process chat request.",
    });
  }
});

export default router;
