import { useState } from "react";
import { useApp } from "../context/AppContext";


export default function DocumentSection() {
  const { setRawText, setDocumentFile, analyze } = useApp();
  const [localText, setLocalText] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFile = (f) => {
    if (!f) return;
    setDocumentFile(f);
    setFileName(f.name);
    // in real app, extract text from file then setRawText(extracted)
    setRawText(`${f.name} uploaded. (Mock) Paste sample text to analyze.`);
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
                setRawText(localText);
                analyze(localText);
                window.location.hash = "analysis";
              }}
              className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
            >
              Analyze Text
            </button>
            <span className="text-xs text-gray-500">No data leaves your browser (demo)</span>
          </div>
        </div>

        {/* Upload */}
        <div className="border rounded-2xl p-5 shadow-soft">
          <h3 className="font-semibold mb-2">Upload File (PDF/DOC/TXT)</h3>
          <label
            className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-10 hover:border-brand-600 cursor-pointer"
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <span className="text-gray-700 font-medium">Click to choose a file</span>
            <span className="text-xs text-gray-500">{fileName || "Max 10MB"}</span>
          </label>
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={() => {
                analyze();
                window.location.hash = "analysis";
              }}
              className="px-5 py-2 bg-brand-600 text-black rounded-lg hover:bg-brand-700 transition"
            >
              Analyze File
            </button>
            <span className="text-xs text-gray-500">We’ll summarize & score risk</span>
          </div>
        </div>
      </div>
    </section>
  );
}
