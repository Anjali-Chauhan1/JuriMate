import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import multer from "multer";
import pdfParse from "pdf-parse";

dotenv.config();
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),

});

async function getTextFromFile(file) {
  const { buffer, mimetype, originalname } = file;

  try {
    if (mimetype.includes("pdf") || originalname.endsWith(".pdf")) {
      const data = await pdfParse(buffer);
      return data.text;
    }

    if (mimetype.includes("text") || originalname.endsWith(".txt")) {
      return buffer.toString("utf8");
    }

    throw new Error("Only PDF and TXT files are supported");
  } catch (err) {
    throw new Error("Failed to read file: " + err.message);
  }
}

async function getAIAnalysis(text) {
  const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const prompt = `You are JuriMate — a friendly legal AI assistant.
Analyze this legal document and provide:
1. A simplified summary in plain English
2. A risk score from 0-100 (where 0 is safest, 100 is riskiest)
3. Key highlights of important clauses or concerns

Return ONLY valid JSON in this exact format:
{
  "simplifiedText": "Clear summary of the document",
  "riskScore": 50,
  "highlights": [
    {"text": "Clause title", "reason": "Why this matters"}
  ]
}

Document:
${text}`;

  try {
    const res = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });

    if (!res.data.candidates || res.data.candidates.length === 0) {
      throw new Error("No response from AI model");
    }

    const aiText = res.data.candidates[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
      throw new Error("Empty response from AI model");
    }

    const clean = aiText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    try {
      const parsed = JSON.parse(clean);

      if (!parsed.simplifiedText || typeof parsed.riskScore !== 'number' || !Array.isArray(parsed.highlights)) {
        throw new Error("Invalid response structure");
      }

      return parsed;
    } catch (parseError) {
      console.error("JSON parse error:", parseError.message);
      console.error("AI response:", clean);


      return {
        simplifiedText: aiText,
        riskScore: 50,
        highlights: [
          { text: "General Review", reason: "Please review the document carefully" },
        ],
      };
    }
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    const errorMessage = error.response?.data?.error?.message || error.message;
    throw new Error(`AI Analysis failed: ${errorMessage}`);
  }
}

router.post("/", upload.single("file"), async (req, res) => {
  try {
    let text = "";
    if (req.file) {
      text = await getTextFromFile(req.file);
    }
    else if (req.body.text) {
      text = req.body.text.trim();
    }

    if (!text || text.length < 30) {
      return res
        .status(400)
        .json({ error: "Please upload a valid document or provide text." });
    }

    const analysis = await getAIAnalysis(text);

    res.json({
      data: {
        simplifiedText: analysis.simplifiedText,
        riskScore: analysis.riskScore,
        highlights: analysis.highlights,
      },
    });
  } catch (err) {
    console.error("Analysis error:", err.message);
    console.error("Full error:", err);
    res.status(500).json({
      error: err.message || err.response?.data?.error?.message || "Failed to analyze document.",
    });
  }
});


router.get("/", (req, res) => {
  res.json({
    message: "Analysis endpoint is working. Use POST method to analyze documents.",
    endpoint: "POST /api/analyze",
    expectedBody: {
      text: "Document text to analyze",
      jurisdiction: "India",
      docType: "Contract"
    }
  });
});

export default router;
