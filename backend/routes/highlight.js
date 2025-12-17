import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 30) {
      return res
        .status(400)
        .json({ error: "Please provide valid document text for analysis." });
    }

  
    const prompt = `
You are JuriMate — a friendly, calm AI Legal Assistant.

Read the following document and highlight only the points that deserve special attention.
Explain what they mean and offer future guidance in a kind, reassuring tone — not scary or overly technical.

Document:
${text}

Focus on clauses or terms related to:
- Refunds or payments 💰
- Termination or cancellation ❌
- Liability or damages ⚖️
- Confidentiality or privacy 🔒
- Arbitration or disputes 🏛️
- Auto-renewal, obligations, or penalties ⏳

Respond as if you are *chatting* with the user — short, message-style advice bubbles.
Use a warm tone, emojis, and natural flow. Example style:

"💬 I noticed a **Termination Clause** — it explains when either side can end the agreement. It’s a good idea to double-check if the notice period fits your needs 😊"

"💬 There’s a **Liability Limitation** here. Totally normal in contracts — it just sets a fair boundary for responsibility ⚖️"

Now, generate around 3–5 such friendly highlight messages.
`;

    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const geminiApiUrl =
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await axios.post(geminiApiUrl, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    const message =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Hmm, I didn’t find any special clauses that need attention. Everything looks standard. 😊";

    res.send(message);
  } catch (err) {
    console.error("Highlight route error:", err.message);
    res
      .status(500)
      .send("⚠️ Sorry, I couldn’t generate highlights for this document.");
  }
});

export default router;
