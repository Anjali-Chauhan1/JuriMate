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

  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const prompt = `You are JuriMate — a friendly legal AI assistant.
Analyze this legal document and provide:
1. A clear and descriptive summary in plain English that covers the main points - what the document is, key obligations, important terms, and conditions. Write naturally and be thorough enough to give proper understanding.
2. A risk score from 0-100 based on these criteria:
   - 0-20: Very Safe (standard terms, user-friendly, minimal risk)
   - 21-40: Low Risk (fair terms with minor concerns)
   - 41-60: Medium Risk (some unfavorable clauses, needs attention)
   - 61-80: High Risk (multiple red flags, unfavorable terms)
   - 81-100: Critical Risk (extremely one-sided, dangerous clauses)
   
   Calculate the risk score by analyzing:
   - Liability limitations and indemnification clauses
   - Termination conditions and penalties
   - Payment terms and hidden fees
   - Data privacy and intellectual property rights
   - Auto-renewal and lock-in periods
   - Dispute resolution and jurisdiction clauses
   - One-sided terms favoring the other party

3. Key highlights focusing on RED FLAGS - critical points, potential risks, unfavorable terms, or important clauses that the user MUST be aware of before signing

Return ONLY valid JSON in this exact format:
{
  "simplifiedText": "A well-explained summary covering the document's purpose, main obligations, key terms, and important conditions. Be descriptive and thorough but focus on what matters most.",
  "riskScore": 50,
  "highlights": [
    {"text": "🚩 Title of red flag or critical clause", "reason": "Why this is important and what risk or concern it poses"}
  ]
}

Document:
${text}`;

  try {
    const res = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        topK: 20,
        topP: 0.8,
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
