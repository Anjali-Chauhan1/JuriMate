import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function AnalysisSection() {
  const {
    documentFile,
    rawText,
    simplifiedText,
    setSimplifiedText,
    riskScore,
    setRiskScore,
    riskBand,
    setRiskBand,
    highlights,
    setHighlights,
  } = useApp();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeDocument = async () => {
    if (!documentFile && !rawText) {
      setError("Please upload or paste a document first.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Fetch backend URL (change if deployed)
      const res = await fetch("http://localhost:8080/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: documentFile, // Your extracted text
          jurisdiction: "India",
          docType: "Contract", // optional
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze");
      }

      const { simplifiedText, highlights, riskScore } = data.data;

      // Calculate risk band
      let band = "Safe";
      if (riskScore > 70) band = "Risky";
      else if (riskScore > 40) band = "Needs Attention";

      // Update context
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
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const color =
    riskBand === "Safe"
      ? "bg-green-100 text-green-800 border-green-200"
      : riskBand === "Needs Attention"
      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
      : "bg-red-100 text-red-800 border-red-200";

  return (
    <section id="analysis" className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">Your analysis</h2>
          <p className="text-gray-600">
            Summary, risk color code, and important points.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={analyzeDocument}
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {loading ? "Analyzing..." : "Run Analysis"}
          </button>
        </div>

        {error && (
          <p className="text-center text-red-600 text-sm mb-4">{error}</p>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Summary */}
          <div className="lg:col-span-2 border rounded-2xl p-6 bg-white shadow-soft">
            <h3 className="font-semibold mb-3">Summary (Plain English)</h3>
            <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
              {loading
                ? "Analyzing document..."
                : simplifiedText || "Run an analysis to see the simplified summary here."}
            </pre>
          </div>

          {/* Risk */}
          <div className="border rounded-2xl p-6 bg-white shadow-soft">
            <h3 className="font-semibold mb-3">Risk</h3>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${color}`}
            >
              <span className="font-semibold">{riskBand}</span>
              <span className="text-xs opacity-70">{riskScore}%</span>
            </div>
            <div className="mt-4 h-3 bg-gray-200 rounded-full">
              <div
                className={`h-3 rounded-full ${
                  riskBand === "Safe"
                    ? "bg-green-500"
                    : riskBand === "Needs Attention"
                    ? "bg-yellow-400"
                    : "bg-red-500"
                }`}
                style={{ width: `${riskScore}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              🟢 Safe &nbsp; 🟡 Needs Attention &nbsp; 🔴 Risky
            </p>
          </div>

          {/* Important Points */}
          <div className="lg:col-span-3 border rounded-2xl p-6 bg-white shadow-soft">
            <h3 className="font-semibold mb-3">Important points</h3>
            {loading ? (
              <p className="text-gray-600 text-sm">
                Extracting key highlights...
              </p>
            ) : highlights?.length ? (
              <ul className="grid md:grid-cols-2 gap-3">
                {highlights.map((h, i) => (
                  <li
                    key={i}
                    className="p-3 rounded-xl border bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <p className="font-medium">{h.title}</p>
                    <p className="text-sm text-gray-600">{h.note}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-sm">
                No specific red flags detected yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
