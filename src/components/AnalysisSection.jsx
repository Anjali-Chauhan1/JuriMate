import { useState } from "react";
import axios from "axios";
import { motion, useInView } from "framer-motion";
import { useApp } from "../context/AppContext";
import { useRef } from "react";

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
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  const BASE_URL =
    import.meta.env.VITE_API_URL || "https://jurimate-1-s6az.onrender.com/api";

  const analyzeDocument = async () => {
    if ((!rawText || rawText.trim().length === 0) && !documentFile) {
      setError("Please upload a document or paste text first.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      let res;

      if (rawText && rawText.trim().length > 0) {
        res = await axios.post(
          `${BASE_URL}/analyze`,
          { text: rawText, jurisdiction: "India", docType: "Contract" },
          { headers: { "Content-Type": "application/json" } }
        );
      } else if (documentFile) {
        const formData = new FormData();
        formData.append("file", documentFile);
        formData.append("jurisdiction", "India");
        formData.append("docType", "Contract");

        res = await axios.post(`${BASE_URL}/analyze`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const { simplifiedText, highlights, riskScore } = res.data.data;

      let band = "Safe";
      if (riskScore > 70) band = "Risky";
      else if (riskScore > 40) band = "Needs Attention";

      setSimplifiedText(simplifiedText);
      setHighlights(highlights.map((h) => ({ title: h.text, note: h.reason })));
      setRiskScore(riskScore);
      setRiskBand(band);
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || err.message || "Analysis failed.";
      setError(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const color =
    riskBand === "Safe"
      ? "bg-green-600/20 border-green-500/40 text-green-300"
      : riskBand === "Needs Attention"
      ? "bg-yellow-600/20 border-yellow-500/40 text-yellow-300"
      : "bg-red-600/20 border-red-500/40 text-red-300";

  return (
     <section
    ref={sectionRef}
    id="analysis"
    className="relative min-h-screen bg-[#050507] text-white py-20 px-6 md:px-10 overflow-hidden"
  >

    <motion.div
      className="absolute inset-0 bg-linear-to-br from-white/10 via-gray-300/10 to-transparent blur-3xl"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: [0.2, 0.6, 0.3] } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />

    <div className="max-w-7xl mx-auto relative z-10">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-14"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
          Legal Document Analysis
        </h2>
        <p className="text-gray-400 mt-3 text-lg">
          Simplified summary, risk score & key highlights — powered by AI.
        </p>
      </motion.div>

      {/* Analysis Button */}
      <motion.div
        className="flex justify-center mb-10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <button
          onClick={analyzeDocument}
          disabled={loading}
          className="px-10 py-3 rounded-xl font-semibold text-black bg-white hover:bg-gray-200 focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-gray-900 transition disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Run Analysis'}
        </button>
      </motion.div>

      {error && (
        <p className="text-center text-red-400 font-medium mb-6">{error}</p>
      )}

      {/* Analysis */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Summary */}
        <motion.div
          className="lg:col-span-2 bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl hover:shadow-white/20 transition"
          initial={{ y: 60, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-white mb-3">
            📄 Simplified Summary
          </h3>
          <div className="text-gray-300 text-sm md:text-base leading-relaxed max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {loading
              ? 'Analyzing document...'
              : simplifiedText ||
                'Run analysis to view the simplified version of your document.'}
          </div>
        </motion.div>

        {/* Risk */}
        <motion.div
          className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl hover:shadow-white/20 transition"
          initial={{ y: 60, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-white mb-3">⚖️ Risk Overview</h3>
          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${color}`}>
            <span className="font-semibold">{riskBand}</span>
            <span className="text-xs opacity-70">{riskScore}%</span>
          </div>
          <div className="mt-5 h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-3 rounded-full ${
                riskBand === 'Safe'
                  ? 'bg-green-500'
                  : riskBand === 'Needs Attention'
                  ? 'bg-yellow-400'
                  : 'bg-red-500'
              } transition-all duration-700`}
              style={{ width: `${riskScore || 0}%` }}
            />
          </div>
          <div className="mt-4 space-y-2 text-sm text-gray-400">
            <div className="flex justify-between">
              <span>Safe</span>
              <span>0-40%</span>
            </div>
            <div className="flex justify-between">
              <span>Needs Attention</span>
              <span>41-70%</span>
            </div>
            <div className="flex justify-between">
              <span>Risky</span>
              <span>71-100%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Highlights */}
      <motion.div
        className="mt-10 bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl hover:shadow-white/20 transition"
        initial={{ y: 60, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-xl font-semibold text-white mb-4">🔍 Key Highlights</h3>

        {loading ? (
          <p className="text-gray-400 text-sm">Extracting important points...</p>
        ) : highlights?.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {highlights.map((h, i) => (
              <div
                key={i}
                className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-white/70 hover:bg-gray-800/80 transition group"
              >
                <p className="font-medium text-gray-100 mb-1 group-hover:text-white">
                  {h.title}
                </p>
                <p className="text-sm text-gray-400">{h.note}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">
            No specific red flags found in this document.
          </p>
        )}
      </motion.div>
    </div>
  </section>
  );
}
