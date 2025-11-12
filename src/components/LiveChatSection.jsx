import { useState, useRef, useEffect } from "react";
import axios from "axios"; 
import { useApp } from "../context/AppContext";

export default function LiveChatSection() {
  const { rawText } = useApp(); 
  const [chatHistory, setChatHistory] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const BASE_URL = import.meta.env.VITE_API_URL || "https://jurimate-1-s6az.onrender.com/api";

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!msg.trim()) return;

    const userMsg = { role: "user", text: msg };
    setChatHistory((prev) => [...prev, userMsg]);
    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/chat`,
        {
          message: msg,
          ...(rawText ? { document: rawText } : {}),
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const botMsg = { role: "assistant", text: res.data.reply };
      setChatHistory((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", text: "⚠ Unable to get a response. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
   <section
  id="chat"
  className="bg-[#050507] text-white py-20 px-6 md:px-10 relative overflow-hidden"
>
  <div className="absolute inset-0 bg-linear-to-br from-white/10 via-gray-300/10 to-transparent blur-3xl pointer-events-none" />

  <div className="max-w-7xl mx-auto relative z-10">
    <div className="mb-12 text-center">
      <h2 className="text-3xl md:text-4xl font-extrabold text-white">
        Live Chat for Your Queries
      </h2>
      <p className="text-gray-400 mt-2 text-lg">
        Ask anything about your uploaded document in real time.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      {/* Chat Box */}
      <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 backdrop-blur-lg shadow-lg hover:shadow-white/20 transition">
        <div className="h-80 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {chatHistory.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              💬 No messages yet. Try asking “Is there any refund clause?”
            </p>
          )}

          {chatHistory.map((c, i) => (
            <div
              key={i}
              className={`max-w-[85%] my-1 p-3 rounded-xl text-sm leading-relaxed ${
                c.role === "user"
                  ? "ml-auto bg-white text-black shadow-sm"
                  : "bg-gray-800 text-gray-200 border border-gray-700"
              }`}
            >
              {c.text}
            </div>
          ))}

          {loading && (
            <div className="max-w-[85%] my-2 p-3 rounded-xl bg-gray-800 text-gray-400 italic">
              Typing...
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Chat Input */}
        <form onSubmit={sendMessage} className="mt-4 flex gap-2">
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 rounded-lg border border-gray-700 bg-gray-800 text-white px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/70 transition"
            disabled={loading}
          />
          <button
            className="px-5 py-2 rounded-lg font-semibold bg-white text-black hover:bg-gray-200 transition disabled:opacity-50"
            disabled={loading}
          >
            Send
          </button>
        </form>
      </div>

      {/* Tips Panel */}
      <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 backdrop-blur-lg shadow-lg hover:shadow-white/20 transition">
        <h3 className="text-lg font-semibold text-white mb-3">💡 Smart Tips</h3>
        <ul className="space-y-3 text-sm text-gray-300">
          <li>• Ask about refund, termination, or liability clauses.</li>
          <li>• Clarify timelines, hidden fees, or service scope.</li>
          <li>• Request a simplified summary of a tricky paragraph.</li>
          <li>• Understand your obligations before signing.</li>
        </ul>
        <p className="mt-6 text-gray-500 text-xs">
          ⚖ AI responses are for informational purposes only.
        </p>
      </div>
    </div>
  </div>
</section>

  );
}
