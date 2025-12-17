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
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const prompt = `You are JuriMate, a friendly legal AI assistant.

Analyze this legal document and provide:

1. SUMMARY (200-300 words in plain English):
Cover the document type, parties involved, main obligations, payment terms, duration, important clauses, rights, restrictions, and key dates. Write naturally and be thorough.

2. RISK SCORE (just a number 0-100):
0-20 = Very Safe
21-40 = Low Risk
41-60 = Medium Risk
61-80 = High Risk
81-100 = Critical Risk

3. KEY HIGHLIGHTS (4-6 important points):
List critical points the user must know before signing. Format each as:
Title: Explanation of why this matters

Return in JSON format:
{
  "simplifiedText": "your detailed summary here",
  "riskScore": 50,
  "highlights": [
    {"text": "Important Point", "reason": "Why it matters"}
  ]
}

Document:
${text}`;

  try {
    const response = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 3000
      }
    });

    const aiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiText) {
      throw new Error("No response from AI");
    }

   
    const cleanText = aiText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    try {
      const result = JSON.parse(cleanText);
      
     
      if (!result.simplifiedText || !result.riskScore || !result.highlights) {
        throw new Error("Invalid response structure");
      }

      return {
        simplifiedText: result.simplifiedText,
        riskScore: result.riskScore,
        highlights: result.highlights
      };

    } catch (parseError) {
     
      return {
        simplifiedText: aiText,
        riskScore: 50,
        highlights: [
          { text: "Document Review", reason: "Please review this document carefully" }
        ]
      };
    }

  } catch (error) {
    console.error("AI Analysis Error:", error.message);
    throw new Error(`AI Analysis failed: ${error.message}`);
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
