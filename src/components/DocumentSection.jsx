import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";

export default function DocumentSection() {
  const { setRawText, setDocumentFile, resetAnalysis } = useApp();
  const [localText, setLocalText] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  const handleFile = (f) => {
    if (!f) return;
    setDocumentFile(f);
    setFileName(f.name);
    resetAnalysis();

    if (f.type === "text/plain" || f.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        setRawText(text);
      };
      reader.onerror = () => {
        setRawText("");
        alert("Failed to read file. Please try again.");
      };
      reader.readAsText(f);
    } else {
      setRawText("");
    }
  };

  return (
   <section
  id="document"
  className="relative min-h-screen bg-linear-to-b from-gray-950 to-black text-white flex flex-col items-center justify-center px-6 overflow-hidden"
>
  
  <motion.div
    className="absolute inset-0 bg-linear-to-tr from-white/10 via-gray-400/10 to-transparent blur-3xl"
    animate={{ opacity: [0.4, 0.7, 0.4] }}
    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
  />

  {/* Heading */}
  <motion.div
    className="text-center z-10 mb-12"
    initial={{ y: 30, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    <h2 className="text-4xl md:text-5xl font-extrabold mb-3 text-white">
      Start Your Legal Analysis
    </h2>
    <p className="text-gray-400 text-lg">Choose how you’d like to get started 👇</p>
  </motion.div>

  {/* Option buttons */}
  <AnimatePresence mode="wait">
    {!selectedOption && (
      <motion.div
        key="choice"
        className="flex flex-col md:flex-row gap-6 z-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -30, opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Paste Text Option */}
        <button
          onClick={() => setSelectedOption("text")}
          className="group relative px-8 py-10 w-72 rounded-2xl bg-gray-900/60 hover:bg-gray-800/80 transition backdrop-blur-lg border border-gray-700 hover:border-white/80 shadow-lg hover:shadow-white/20"
        >
          <span className="text-2xl font-bold block mb-2 group-hover:text-white transition">
            Paste Text
          </span>
          <p className="text-gray-400 text-sm">
            Copy-paste your document text directly for quick analysis.
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-white to-gray-300 opacity-0 group-hover:opacity-100 transition" />
        </button>

        {/* Upload File Option */}
        <button
          onClick={() => setSelectedOption("file")}
          className="group relative px-8 py-10 w-72 rounded-2xl bg-gray-900/60 hover:bg-gray-800/80 transition backdrop-blur-lg border border-gray-700 hover:border-white/80 shadow-lg hover:shadow-white/20"
        >
          <span className="text-2xl font-bold block mb-2 group-hover:text-white transition">
            Upload File
          </span>
          <p className="text-gray-400 text-sm">
            Upload your PDF or text file for AI-powered analysis.
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-white to-gray-300 opacity-0 group-hover:opacity-100 transition" />
        </button>
      </motion.div>
    )}

    {/* Paste Text  */}
    {selectedOption === "text" && (
      <motion.div
        key="text"
        className="w-full max-w-2xl z-10"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-xl font-semibold mb-3 text-center">
          Paste your document text below
        </h3>
        <textarea
          className="w-full h-48 bg-gray-900 border border-gray-700 rounded-xl text-white p-4 focus:outline-none focus:ring-2 focus:ring-white/70"
          placeholder="Paste your legal text here..."
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
        />
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => {
              resetAnalysis();
              setRawText(localText);
              setFileName("");
              window.location.hash = "analysis";
            }}
            className="px-6 py-2 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition"
          >
            Use This Text
          </button>
          <button
            onClick={() => setSelectedOption(null)}
            className="text-gray-400 hover:text-gray-200 text-sm"
          >
            ← Back
          </button>
        </div>
      </motion.div>
    )}

    {/* Upload File */}
    {selectedOption === "file" && (
      <motion.div
        key="file"
        className="w-full max-w-2xl z-10"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-xl font-semibold mb-3 text-center">
          Upload your document (PDF/TXT)
        </h3>
        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-700 rounded-xl py-10 hover:border-white/80 cursor-pointer bg-gray-900/50 transition">
          <input
            type="file"
            accept=".pdf,.txt"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <span className="text-gray-300 font-medium">
            {fileName ? `📄 ${fileName}` : "Click to choose a file"}
          </span>
          <span className="text-xs text-gray-500">
            {fileName ? "File ready" : "Max 10MB"}
          </span>
        </label>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-gray-400">
            {fileName
              ? `✅ ${fileName} loaded`
              : "Upload extracts text automatically"}
          </span>
          <button
            onClick={() => {
              if (fileName) {
                resetAnalysis();
              setRawText(localText);
              setFileName("");
                window.location.hash = "analysis"
              }  
            }}
            disabled={!fileName}
            className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Go to Analysis
          </button>
        </div>
        <button
          onClick={() => setSelectedOption(null)}
          className="text-gray-400 hover:text-gray-200 text-sm mt-4"
        >
          ← Back
        </button>
      </motion.div>
    )}
  </AnimatePresence>
</section>

  );
}
