import { useState, useRef, useEffect } from "react";
import axios from "axios"; 
import { useApp } from "../context/AppContext";

export default function LiveChatSection() {
  const { documentFile } = useApp(); 
  const [chatHistory, setChatHistory] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory.length]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!msg.trim()) return;

   const userMsg = { role: "user", text: msg };
    setChatHistory((prev) => [...prev, userMsg]);
    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post("https://jurimate-1-s6az.onrender.com/api/chat", {
        message: msg,
        document: documentFile || "", 
      });

      const botMsg = { role: "assistant", text: res.data.reply };
      setChatHistory((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", text: "⚠️ Unable to get a response. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="chat" className="max-w-6xl mx-auto px-4 py-14">
      <div className="mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold">Live chat for your queries</h2>
        <p className="text-gray-600">
          Ask anything about your uploaded document.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Chat Box */}
        <div className="border rounded-2xl p-6 shadow-soft bg-white">
          <div className="h-72 overflow-y-auto pr-2">
            {chatHistory.length === 0 && (
              <p className="text-sm text-gray-500">
                No messages yet. Try asking “Is there any refund clause?”
              </p>
            )}
            {chatHistory.map((c, i) => (
              <div
                key={i}
                className={`max-w-[85%] my-2 p-3 rounded-xl ${
                  c.role === "user"
                    ? "ml-auto bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {c.text}
              </div>
            ))}
            {loading && (
              <div className="max-w-[85%] my-2 p-3 rounded-xl bg-gray-100 text-gray-500 italic">
                Typing...
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={sendMessage} className="mt-3 flex gap-2">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              disabled={loading}
            />
            <button
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
              disabled={loading}
            >
              Send
            </button>
          </form>
        </div>

        {/* Tips Panel */}
        <div className="border rounded-2xl p-6 shadow-soft bg-white">
          <h3 className="font-semibold mb-2">Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Ask about refund, termination, or liability clauses.</li>
            <li>• Clarify timelines, hidden fees, or service scope.</li>
            <li>• Request a simplified summary of a tricky paragraph.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
