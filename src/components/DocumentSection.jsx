import { useState } from "react";
import { useApp } from "../context/AppContext";


export default function DocumentSection() {
  const { setRawText, setDocumentFile, resetAnalysis } = useApp();
  const [localText, setLocalText] = useState("");
  const [fileName, setFileName] = useState("");

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
        console.log("✅ Text extracted from .txt file, length:", text?.length);
      };
      reader.onerror = () => {
        setRawText("");
        alert("Failed to read file. Please try again.");
      };
      reader.readAsText(f);
    } else {
  
      setRawText("");
      console.log("📄 File uploaded, will be processed by backend:", f.name);
    }
  };

  return (
    <section id="document" className="max-w-6xl mx-auto px-4 py-14">
      <div className="mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold">Start your analysis</h2>
        <p className="text-gray-600">Choose a method: paste text or upload file.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Test / Paste */}
        <div className="border rounded-2xl p-5 shadow-soft">
          <h3 className="font-semibold mb-2">Paste / Test Text</h3>
          <textarea
            className="w-full h-40 rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-brand-600"
            placeholder="Paste your legal text here..."
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
          />
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={() => {
                resetAnalysis(); 
                setRawText(localText);
                setFileName("");
                window.location.hash = "analysis";
              }}
              className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
            >
              Use This Text
            </button>
            <span className="text-xs text-gray-500">Click to load text, then run analysis below</span>
          </div>
        </div>

        {/* Upload */}
        <div className="border rounded-2xl p-5 shadow-soft">
          <h3 className="font-semibold mb-2">Upload File (PDF/TXT)</h3>
          <label
            className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-10 hover:border-brand-600 cursor-pointer"
          >
            <input
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <span className="text-gray-700 font-medium">
              {fileName ? `📄 ${fileName}` : "Click to choose a file"}
            </span>
            <span className="text-xs text-gray-500">{fileName ? "File ready" : "Max 10MB"}</span>
          </label>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-500">
              {fileName ? `✅ ${fileName} loaded` : "Upload extracts text automatically"}
            </span>
            <button
              onClick={() => {
                if (fileName) window.location.hash = "analysis";
              }}
              disabled={!fileName}
              className="px-5 py-2 bg-brand-600 text-black rounded-lg hover:bg-brand-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Go to Analysis
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
