import { SendHorizonal } from "lucide-react";
import React, { useState } from "react";

export default function FloatingAIBox({ isOpen, onClose, onSend, placeholder }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendClick() {
    if (!input.trim()) return;
    setLoading(true);
    try {
      await onSend(input); // call parent handler (AI request)
    } finally {
      setLoading(false);
      setInput("");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white rounded-xl shadow-xl flex flex-col overflow-hidden">
      
      
      <div className="bg-cyan-500 text-white px-3 py-2 flex justify-between items-center">
        <span className="font-semibold">AI Assistant</span>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          ✖
        </button>
      </div>

      
      <div className="flex ">
        <textarea
          className="flex-1 p-2 h-50 text-sm outline-none resize-none"
          placeholder={ placeholder ? placeholder : 'Type something to ask ... '}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendClick()}
          disabled={loading}
        />
        <button
          onClick={handleSendClick}
          disabled={loading}
          className={`fixed px-2 py-2 rounded-full flex items-center justify-between h-10 w-10 bottom-8 right-8 gap-2 text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-cyan-600 hover:bg-green-700"
          }`}
        >
          {loading ? (
            <>
              <span className="animate-spin border-2  border-white border-t-transparent rounded-full w-6 h-6"></span>
              
            </>
          ) : (
            <SendHorizonal className="items-center self-center"/>
          )}
        </button>
      </div>
    </div>
  );
} 
