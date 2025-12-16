import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message, document } = req.body;


    if (!message && !document) {
      return res.status(400).json({
        error: "Send at least a message or a document.",
      });
    }

    let prompt = "";

    if (document && !message) {
      prompt = `
You are JuriMate — an intelligent AI Legal Assistant.
Summarize the legal document below in simple, clear language.

Document:
${document}

Instructions:
- Highlight key legal points.
- Explain in plain English.
- Keep answer concise (5–7 lines).
`;
    }

    if (message && !document) {
      prompt = `
You are JuriMate — an intelligent AI Legal Assistant.

User Question:
${message}

If the question requires context from a document, say:
"I may need the related document to answer this more accurately."

Respond in 4–6 lines, keep it simple.
`;
    }

  
    if (message && document) {
      prompt = `
You are JuriMate — an intelligent AI Legal Assistant.
Answer the user's question strictly based on the document content.

Document:
${document}

User Question:
${message}

Instructions:
- Answer in 3–6 lines.
- Refer to relevant clauses if possible.
- Do not add extra information.
- If document does not answer this, say: "This point isn't specified in the document."
`;
    }

    const geminiApiUrl =
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
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
        err.response?.data?.error?.message ||
        "Failed to process chat request.",
    });
  }
});

export default router;