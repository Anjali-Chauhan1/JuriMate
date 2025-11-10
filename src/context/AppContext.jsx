import { createContext, useContext, useMemo, useState } from "react";
import axios from "axios";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [documentFile, setDocumentFile] = useState(null);
  const [rawText, setRawText] = useState("");
  const [simplifiedText, setSimplifiedText] = useState("");
  const [riskScore, setRiskScore] = useState(0);
  const [riskBand, setRiskBand] = useState("Safe");
  const [highlights, setHighlights] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);

  const BASE_URL = import.meta.env.VITE_API_URL || "https://jurimate-1-s6az.onrender.com/api";

  const analyze = async (inputText) => {
    const text = (inputText ?? rawText)?.toString().trim();
    if (!text) return;

    try {
      const res = await axios.post(
        `${BASE_URL}/analyze`,
        {
          text,
          jurisdiction: "India",
          docType: "Contract",
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const { simplifiedText, highlights, riskScore } = res.data.data;

      let band = "Safe";
      if (riskScore > 70) band = "Risky";
      else if (riskScore > 40) band = "Needs Attention";

      setSimplifiedText(simplifiedText);
      setHighlights(
        highlights.map((h) => ({
          title: h.text,
          note: h.reason,
        }))
      );
      setRiskScore(riskScore);
      setRiskBand(band);
    } catch (err) {
      console.error("Analysis error:", err);
    }
  };

  const askChat = async (message) => {
    if (!message) return;

    setChatHistory((h) => [...h, { role: "user", text: message }]);

    try {
      const res = await axios.post(
        `${BASE_URL}/chat`,
        {
          message,
          document: rawText || "",
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setChatHistory((h) => [
        ...h,
        { role: "assistant", text: res.data.reply },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setChatHistory((h) => [
        ...h,
        { role: "assistant", text: "⚠️ Sorry, Gemini couldn't respond." },
      ]);
    }
  };

  const resetAnalysis = () => {
    setSimplifiedText("");
    setRiskScore(0);
    setRiskBand("Safe");
    setHighlights([]);
  };

  const value = useMemo(
    () => ({
      documentFile,
      setDocumentFile,
      rawText,
      setRawText,
      simplifiedText,
      setSimplifiedText,
      riskScore,
      setRiskScore,
      riskBand,
      setRiskBand,
      highlights,
      setHighlights,
      analyze,
      resetAnalysis,
      chatHistory,
      askChat,
    }),
    [
      documentFile,
      rawText,
      simplifiedText,
      riskScore,
      riskBand,
      highlights,
      chatHistory,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

