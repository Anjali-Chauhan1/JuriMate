import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import multer from "multer";
import pdfParse from "pdf-parse";

dotenv.config();
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'text/plain'];
    const allowedExtensions = ['.pdf', '.txt'];
    
    const hasValidMime = allowedTypes.includes(file.mimetype);
    const hasValidExt = allowedExtensions.some(ext => file.originalname.toLowerCase().endsWith(ext));
    
    if (hasValidMime || hasValidExt) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT files are allowed'));
    }
  }
});

async function getTextFromFile(file) {
  const { buffer, mimetype, originalname } = file;

  try {
    if (mimetype.includes("pdf") || originalname.endsWith(".pdf")) {
      try {
        const data = await pdfParse(buffer);
        if (data.text && data.text.trim().length > 0) {
          return data.text;
        }
        throw new Error("PDF appears to be empty or unreadable");
      } catch (pdfError) {
        console.error("PDF parsing error:", pdfError.message);
        
      
        try {
          const data = await pdfParse(buffer, {
            max: 0, 
            version: 'v2.0.550' 
          });
          if (data.text && data.text.trim().length > 0) {
            return data.text;
          }
        } catch (retryError) {
          console.error("PDF retry parsing error:", retryError.message);
        }
        
        throw new Error(
          `Unable to parse PDF: ${pdfError.message}. The PDF may be corrupted, password-protected, or use an unsupported format. Please try a different file or convert it to text.`
        );
      }
    }

    if (mimetype.includes("text") || originalname.endsWith(".txt")) {
      return buffer.toString("utf8");
    }

    throw new Error("Only PDF and TXT files are supported");
  } catch (err) {
    throw err;
  }
}

async function getAIAnalysis(text) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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

  try {
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
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    throw new Error(`AI Analysis failed: ${error.response?.data?.error?.message || error.message}`);
  }
}

router.post("/", (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size exceeds 10MB limit' });
      }
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      let text = "";
      if (req.file) {
        console.log(`Processing file: ${req.file.originalname}, size: ${req.file.size} bytes`);
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

      console.log(`Extracted text length: ${text.length} characters`);
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
});

export default router;
