import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message, document } = req.body;

    // If both are missing -> return error
    if (!message && !document) {
      return res.status(400).json({
        error: "Send at least a message or a document.",
      });
    }

    let prompt = "";

    // Case 1: Only document → Summarize it
    if (document && !message) {
      prompt = `
You are JuriMate — an intelligent AI Legal Assistant.
Summarize the legal document below in simple and clear language.

Document:
${document}

Instructions:
- Extract key legal points.
- Explain in plain English.
- Keep it concise (5–7 lines).
`;
    }

    // Case 2: Only message → General legal question handling
    if (message && !document) {
      prompt = `
You are JuriMate — an intelligent AI Legal Assistant.
The user has asked a legal question.

User Question:
${message}

If needed, politely request the related legal document for more precise analysis.
Keep your answer short (4–6 lines) and avoid complex legal jargon.
`;
    }

    // Case 3: Both message + document → Answer using the document
    if (message && document) {
      prompt = `
You are JuriMate — an intelligent AI Legal Assistant.
You have been given a legal document and a user's question.
Answer ONLY using the document content.

Document:
${document}

User Question:
${message}

Instructions:
- Answer in 3–6 lines.
- Refer to relevant clauses if present.
- Do not make up any information.
- If the document does not cover this, say: "This point isn't specified in the document."
`;
    }

    const geminiApiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
      process.env.GEMINI_API_KEY;

    const response = await axios.post(geminiApiUrl, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    const reply =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠ No response from AI.";

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
