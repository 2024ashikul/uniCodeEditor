import { useState, useEffect, useContext } from "react";
import { AlertContext } from "../../../Contexts/AlertContext/AlertContext";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";
import { API_URL } from "../../../config";
import LoadingParent from "../../SharedComponents/LoadingParent";
import PageTitle from "../../SharedComponents/PageTitle";

export default function Results({ assessmentId }) {
  const [members, setMembers] = useState(null);
  const [lockedUserIds, setLockedUserIds] = useState([]);
  const { token } = useContext(AuthContext);
  const { setMessage, setType } = useContext(AlertContext);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`${API_URL}/submission/admin/project/results`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ assessmentId }),
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        console.log(data);

        if(!data.results){
          setMembers([]);
          
        }
        const processedResults = data.results.map((item) => ({
          ...item,
          finalScore:
            !item?.submission && item?.submission?.FinalScore == null ? 0 : item?.submission?.FinalScore,
        }));
        console.log(processedResults);

        const initiallyLockedIds = processedResults.map(
          (item) => item.member.id
        );

        setMembers(processedResults);
        setLockedUserIds(initiallyLockedIds);
      } catch (err) {
        console.error("Failed to fetch results:", err);
      }
    };
    fetchResults();
  }, [assessmentId, token]);

  const handleFinalScoreChange = (userId, value) => {
    setMembers((prev) =>
      prev?.map((item) =>
        item.member.id === userId
          ? {
              ...item,
              finalScore: value === "" ? "" : Math.max(0, Number(value)),
            }
          : item
      ) || null
    );
  };

  const handleSaveFinalScore = async (userId, finalScore) => {
    if (finalScore === null || finalScore === "" || finalScore === undefined) {
      setMessage("Score cannot be empty.");
      setType("error");
      return;
    }
    try {
      const res = await fetch(
        `${API_URL}/submission/admin/project/savescore`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ assessmentId, userId, finalScore }),
        }
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || `HTTP error! status: ${res.status}`);
      setMessage(data.message);
      setType("success");

      // Lock the row again
      if (!lockedUserIds.includes(userId)) {
        setLockedUserIds((prev) => [...prev, userId]);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to save final score");
      setType("error");
    }
  };

  const handlePublish = async () => {
        try {
            const res = await fetch(`${API_URL}/assessment/admin/publishresults`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ assessmentId })
            })
            const data = await res.json();
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
           
                setMessage(data.message)
                setType(data.type)

        } catch (err) {
            console.log(err)
            setMessage('Internal server error');
            setType('error');
        }
    }

  const handleEditScore = (userId) => {
    setLockedUserIds((prev) => prev.filter((id) => id !== userId));
  };

  return (
    <div className="flex flex-col mt-4 gap-4">
      <div className="flex justify-between items-center">
        <PageTitle text="Assignment Results" />

        <button onClick={handlePublish} className="inline-flex items-center justify-center px-5 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-200">Publish Result</button>
      </div>

      {members === null ? (
        <LoadingParent />
      ) : members.length === 0 ? (
        <p className="text-gray-500 text-center">No results to display</p>
      ) : (
        members.map((item, index) => {
          const isLocked = lockedUserIds.includes(item.member.id);
          const isEditable = !isLocked;

          return (
            <div
              key={item.member.id}
              className="flex flex-col md:flex-row items-center justify-between bg-white shadow-md rounded-lg p-4 gap-4"
            >
              <div className="flex items-center gap-4 flex-1">
                <p className="font-bold text-gray-800 w-6">{index + 1}.</p>
                <div>
                  <p className="font-semibold text-gray-700">
                    {item.member.name}
                  </p>
                </div>
              </div>

              <div className="flex justify-center flex-1">
                {item.submission?.file ? (
                  <a
                    href={`${API_URL}/download/assessment-${assessmentId}/${item.submission.file}`}
                    className="px-3 py-1 rounded-full text-sm bg-green-500 text-white hover:bg-green-600 transition-colors"
                  >
                    Download
                  </a>
                ) : (
                  <span className="text-gray-500 italic text-sm">
                    Not Submitted
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={item.finalScore === null ? "" : item.finalScore}
                  onChange={(e) =>
                    handleFinalScoreChange(item.member.id, e.target.value)
                  }
                  disabled={!isEditable}
                  className={`border rounded-lg px-3 py-1 w-24 text-center ${
                    !isEditable
                      ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                      : "focus:outline-none focus:ring-2 focus:ring-blue-500"
                  }`}
                />
                <button
                  onClick={() => {
                    if (isEditable) {
                      handleSaveFinalScore(item.member.id, item.finalScore);
                    } else {
                      handleEditScore(item.member.id);
                    }
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-20"
                >
                  {isEditable ? "Save" : "Edit"}
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
