import { useContext, useEffect, useState } from "react";
import PageTitle from "../SharedComponents/PageTitle";
import NullComponent from "../SharedComponents/NullComponent";
import { API_URL } from "../../config";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import LoadingParent from "../SharedComponents/LoadingParent";
import { useNavigate } from "react-router-dom";

export default function Announcements({ roomId }) {
    const [announcements, setAnnouncements] = useState(null);
    const { token } = useContext(AuthContext);
    const [meetings, setMeetings] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const res = await fetch(`${API_URL}/meeting/user`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ roomId })
                })

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                setMeetings(data.meetings);
            } catch (err) {
                console.log("Failed to fetch lesson", err);
            }
        }

        if (roomId) {
            fetchMeetings();
        }
    }, [roomId, token]);



    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const res = await fetch(`${API_URL}/announcement/fetchall`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ roomId })
                })

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                console.log(data);
                setAnnouncements(data);
            } catch (err) {
                console.log("Failed to fetch lesson", err);
            }
        }

        if (roomId) {
            fetchAssignment();
        }
    }, [roomId, token])

    const formatTimeAgo = (date) => {
        const d = date instanceof Date ? date : new Date(date);
        const diff = Math.floor((Date.now() - d.getTime()) / 1000);
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    const categoryColors = {
        Info: "bg-blue-100 text-blue-600",
        Urgent: "bg-red-100 text-red-600",
        Assignment: "bg-green-100 text-green-600",
    };


    return (
        <>
            <div className={`flex flex-col `}>
                <div className="flex mt-2 justify-between">
                    <PageTitle
                        text={'Announcements'}
                    />
                </div>
                <div className=" min-w-full pt-4  flex  gap-20  rounded-2xl transition duration-1000">
                    <div className="flex-1 space-y-4">
                        {
                            announcements === null ? (
                                <LoadingParent />
                            ) : announcements.length === 0 ? (
                                <NullComponent text={'No Announcements found'} />
                            ) : (

                                announcements.map((item, i) => (
                                    <div
                                        key={i}
                                        className="bg-white shadow-md rounded-2xl border border-gray-100 transition hover:shadow-lg hover:scale-[1.01] duration-300 p-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            {
                                                item.user.profile_pic ?
                                                    <img
                                                        src={item.user.profile_pic}
                                                        alt={item.user.name}
                                                        className="w-8 h-8 rounded-full"
                                                    /> :
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                                                        {item?.user.name[0].toUpperCase()}
                                                    </div>
                                            }

                                            <div className="flex flex-col">
                                                <h3 className="text-gray-800 text-base font-semibold">{item.title}</h3>
                                                <p className="text-xs text-gray-500">
                                                    {item.user.name} • {formatTimeAgo(item.createdAt)}
                                                </p>
                                            </div>
                                            <span
                                                className={`ml-auto px-2 py-0.5 text-xs rounded-full ${categoryColors[item.category]}`}
                                            >
                                                {item.category}
                                            </span>
                                        </div>

                                        <div className="mt-2">
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                ))


                            )

                        }
                    </div>
                    <div className="min-w-[360px] flex flex-col gap-4">
                        {
                            meetings === null ?
                                <LoadingParent />
                                : meetings.length === 0 ?
                                    <div className="flex flex-col items-center justify-center bg-white shadow-md rounded-2xl px-6 py-8 border border-gray-100 text-center">
                                        <h4 className="text-lg font-semibold text-gray-700 mb-2">
                                            No Meetings Found
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            When meetings are created, they will appear here.
                                        </p>
                                    </div>
                                    : meetings?.map((meeting, i) => (
                                        <div
                                            key={i}
                                            className="flex flex-col items-center justify-between gap-3 bg-white shadow-lg rounded-2xl px-5 py-2 border border-gray-100 hover:shadow-xl transition"
                                        >
                                            <h4 className="text-md font-semibold text-fuchsia-600">
                                                {meeting.type} Meeting
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

                </div>
            </div>

        </>
    )
}



// import { useState } from "react";

// export default function Announcements() {
//   const [announcements] = useState([
//     {
//       id: 1,
//       title: "Class Rescheduled",
//       description:
//         "Tomorrow’s math class has been rescheduled to 3:00 PM. Please update your schedules accordingly.",
//       createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
//       category: "Info",
//       author: { name: "Mr. Smith", avatar: "https://i.pravatar.cc/40?img=3" },
//       attachment: "https://example.com/schedule.pdf",
//     },
//     {
//       id: 2,
//       title: "Project Submission Reminder",
//       description:
//         "Don’t forget to submit your science project by Friday midnight.",
//       createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26), // 1 day ago
//       category: "Urgent",
//       author: { name: "Ms. Johnson", avatar: "https://i.pravatar.cc/40?img=5" },
//     },
//     {
//       id: 3,
//       title: "New Assignment Available",
//       description:
//         "A new Assignment on World History has been posted. Check the Assignments section.",
//       createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
//       category: "Assignment",
//       author: { name: "Dr. Lee", avatar: "https://i.pravatar.cc/40?img=8" },
//     },
//   ]);

//   const formatTimeAgo = (date) => {
//     const diff = Math.floor((Date.now() - date.getTime()) / 1000);
//     if (diff < 60) return `${diff}s ago`;
//     if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
//     if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
//     return `${Math.floor(diff / 86400)}d ago`;
//   };

//   const categoryColors = {
//     Info: "bg-blue-100 text-blue-600",
//     Urgent: "bg-red-100 text-red-600",
//     Assignment: "bg-green-100 text-green-600",
//   };

//   return (
//     <div className="flex flex-col gap-4 p-4">
//       {announcements.map((item) => (
//         <div
//           key={item.id}
//           className="bg-white shadow-md rounded-2xl border border-gray-100 transition hover:shadow-lg hover:scale-[1.01] duration-300"
//         >
//           {/* Header */}
//           <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
//             <div className="flex items-center gap-3">
//               <img
//                 src={item.author.avatar}
//                 alt={item.author.name}
//                 className="w-8 h-8 rounded-full"
//               />
//               <div>
//                 <h3 className="text-gray-800 font-semibold">{item.title}</h3>
//                 <p className="text-xs text-gray-500">
//                   {item.author.name} • {formatTimeAgo(item.createdAt)}
//                 </p>
//               </div>
//             </div>
//             <span
//               className={`px-2 py-0.5 text-xs rounded-full ${
//                 categoryColors[item.category]
//               }`}
//             >
//               {item.category}
//             </span>
//           </div>

//           {/* Body */}
//           <div className="px-6 py-4">
//             <p className="text-gray-600 text-sm leading-relaxed">
//               {item.description}
//             </p>
//             {item.attachment && (
//               <a
//                 href={item.attachment}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-block mt-3 text-sm text-blue-500 hover:underline"
//               >
//                 📎 View Attachment
//               </a>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
