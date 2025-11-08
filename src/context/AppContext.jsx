import { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [documentFile, setDocumentFile] = useState(null);
  const [rawText, setRawText] = useState("");
  const [simplifiedText, setSimplifiedText] = useState("");
  const [riskScore, setRiskScore] = useState(0);
  const [riskBand, setRiskBand] = useState("Safe");
  const [highlights, setHighlights] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);

  // 🔹 NEW: Connect to backend analysis API
  const analyze = async (inputText) => {
    const text = (inputText ?? rawText)?.toString().trim();
    if (!text) return;

    try {
      const res = await fetch("http://localhost:8080/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          jurisdiction: "India",
          docType: "Contract",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze");

      const { simplifiedText, highlights, riskScore } = data.data;

      // Map risk score → band
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

  // 🔹 NEW: Chat via backend API
  const askChat = async (message) => {
    if (!message) return;

    // Show user message instantly
    setChatHistory((h) => [...h, { role: "user", text: message }]);

    try {
      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          context: documentFile || rawText || "",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Chat failed");

      setChatHistory((h) => [...h, { role: "assistant", text: data.reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setChatHistory((h) => [
        ...h,
        { role: "assistant", text: "⚠️ Sorry, Gemini couldn't respond." },
      ]);
    }
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
