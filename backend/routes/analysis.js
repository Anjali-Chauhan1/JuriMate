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
You are JuriMate — a legal AI that analyzes documents and provides structured insights.

Read the following legal document and provide:
1. A simplified summary (3-4 sentences in plain English)
2. A risk score from 0 to 100 (0-40: Safe, 41-70: Needs Attention, 71-100: Risky)
3. Key highlights/clauses that need attention

Document:
${text}

Return in this JSON format:
{
  "simplifiedText": "Brief summary of the document...",
  "riskScore": 45,
  "highlights": [
    {"text": "Payment Terms", "reason": "Explanation of why this matters"},
    {"text": "Termination Clause", "reason": "Explanation of why this matters"}
  ]
}

Keep the tone friendly and reassuring.
`;

    const geminiApiUrl =
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=" +
      process.env.GEMINI_API_KEY;

    const response = await axios.post(geminiApiUrl, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    const aiText =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No analysis available from Gemini.";

    // Try to parse JSON from AI response
    let parsedData;
    try {
      // Remove markdown code blocks if present
      const cleanText = aiText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedData = JSON.parse(cleanText);
    } catch (parseErr) {
      // Fallback if JSON parsing fails
      parsedData = {
        simplifiedText: aiText,
        riskScore: 50,
        highlights: [
          { text: "General Review", reason: "Please review the document carefully" }
        ]
      };
    }

    res.json({ 
      data: {
        simplifiedText: parsedData.simplifiedText || aiText,
        riskScore: parsedData.riskScore || 50,
        highlights: parsedData.highlights || []
      }
    });
  } catch (err) {
    console.error("Analysis error:", err.message);
    res.status(500).json({
      error: err.response?.data?.error?.message || "Failed to analyze document.",
    });
  }
});

export default router;
