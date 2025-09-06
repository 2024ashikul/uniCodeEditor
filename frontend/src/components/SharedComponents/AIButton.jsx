import { useState } from "react";

export default function AIButton({ onClick }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await onClick(); // run the parent action (e.g., send AI request)
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition
        ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
    >
      {loading ? (
        <>
          <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
          <span>Thinking...</span>
        </>
      ) : (
        <>
          🤖 <span>Use AI</span>
        </>
      )}
    </button>
  );
}
