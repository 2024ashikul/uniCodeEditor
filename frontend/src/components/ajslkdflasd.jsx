


import { useEffect, useState } from "react";
import PageTitle from "../PageTitle";
import NullComponent from "../NullComponent";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { API_URL } from "../config";

export default function Announcements({ roomId }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/fetchannouncements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId }),
    })
      .then((res) => res.json())
      .then((data) => setAnnouncements(data))
      .catch((err) => setError("Failed to load announcements."))
      .finally(() => setLoading(false));
  }, [roomId]);

  const toggleExpand = (i) => {
    setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex mt-2 justify-between">
        <PageTitle text={"Announcements"} />
      </div>

      <div className="min-w-full pt-4 flex flex-col gap-3 rounded-2xl transition duration-1000">
        {loading && (
          <div className="flex justify-center items-center py-10 text-gray-500">
            <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading...
          </div>
        )}

        {error && (
          <div className="text-red-500 font-medium text-center py-4">{error}</div>
        )}

        {!loading && !error && announcements.length === 0 && (
          <NullComponent text={"No Announcements found"} />
        )}

        {!loading && !error &&
          announcements.map((item, i) => {
            const isOpen = expanded[i];
            return (
              <div
                key={i}
                className="shadow-md border border-gray-200 flex-col rounded-2xl transition duration-300 flex w-full hover:shadow-lg bg-white"
              >
                <div
                  className="flex items-center cursor-pointer p-4"
                  onClick={() => toggleExpand(i)}
                >
                  <div className="text-lg font-semibold text-gray-800 flex-1">
                    {item.title}
                  </div>
                  <div className="text-xs text-gray-500 pr-4">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </div>

                {isOpen && (
                  <div className="px-6 pb-4 text-gray-700 text-sm leading-relaxed animate-fadeIn">
                    {item.description}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}