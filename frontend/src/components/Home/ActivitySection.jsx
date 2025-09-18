import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import { API_URL } from "../../config";
import PageTitle from "../SharedComponents/PageTitle";
import { APIRequest } from "../../APIRequest";

export default function ActivitySection() {
    const { userId ,token} = useContext(AuthContext);
    const navigate = useNavigate();
    const [meetings, setMeetings] = useState([]);
    const {request} = APIRequest();

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const data = await request('/meeting/getstatus',{body : {userId}});
                setMeetings(data.meetings);
            } catch (err) {
                console.log("Failed to fetch lesson", err);
            }
        }
        if (userId) {
            fetchMeetings();
        }
    }, [userId,token]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
                <h2 className="text-2xl border-b font-semibold text-gray-800">
                    Join a meeting
                </h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => navigate("/editor")}
                        className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-xl shadow-md hover:bg-yellow-600 transition"
                    >
                        Code Now
                    </button>
                    <button
                        onClick={() => navigate("/collaborate")}
                        className="px-6 py-2 bg-cyan-500 text-white font-semibold rounded-xl shadow-md hover:bg-cyan-600 transition"
                    >
                        MeetCode
                    </button>
                    <button
                        onClick={() => navigate("/collaborate")}
                        className="px-6 py-2 bg-red-500 text-white font-semibold rounded-xl shadow-md hover:bg-red-600 transition"
                    >
                        CollabCode
                    </button>
                </div>
            </div>


            <div className="flex flex-col gap-6">
                <h2 className="text-2xl border-b font-semibold text-gray-800">
                    Your Activities
                </h2>

                {(!meetings || meetings.length === 0) ? (
                    <div className="text-center text-gray-500 italic py-6">
                        You don’t have any active meetings right now.
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {meetings.map((meeting, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center justify-between gap-3 bg-white shadow-lg rounded-2xl px-5 py-2 border border-gray-100 hover:shadow-xl transition"
                            >
                                <h4 className="text-md font-semibold text-fuchsia-600">
                                    {meeting.type} Meeting
                                    <span className="font-mono text-[10px] px-6">Room ID {meeting.roomId}</span>
                                </h4>
                                {/* <p className="text-gray-600 text-sm">
                                    Room ID: <span className="font-mono">{meeting.roomId}</span>
                                </p> */}
                                <button
                                    className="self-center px-4 py-1 bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-lg shadow-md transition"
                                    onClick={() => navigate(`/${meeting.type}/${meeting.roomId}`)}
                                >
                                    Join Meeting
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
