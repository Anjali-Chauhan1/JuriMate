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
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const prompt = `
You are JuriMate — a friendly legal AI.
Summarize this document, give a risk score (0-100), and list key highlights.

Return JSON like this:
{
  "simplifiedText": "...",
  "riskScore": 50,
  "highlights": [
    {"text": "Clause name", "reason": "Why it's important"}
  ]
}

Document:
${text}
`;

  const res = await axios.post(url, {
    contents: [{ parts: [{ text: prompt }] }],
  });

  const aiText =
    res.data.candidates?.[0]?.content?.parts?.[0]?.text || "No analysis found";

  const clean = aiText.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(clean);
  } catch {
    return {
      simplifiedText: aiText,
      riskScore: 50,
      highlights: [
        { text: "General Review", reason: "Please review the document carefully" },
      ],
    };
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
    res.status(500).json({
      error: err.response?.data?.error?.message || "Failed to analyze document.",
    });
  }
});

export default router;
