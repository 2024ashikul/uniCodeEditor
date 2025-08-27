import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../Contexts/AuthContext/AuthContext";
import { API_URL } from "../config";
import TopBar from "./SharedComponents/TopBar";
import PageTitle from "./SharedComponents/PageTitle";


export default function Home() {
    const { userId } = useContext(AuthContext);
    const navigate = useNavigate();
    const [meetings, setMeetings] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/getmeetingstatus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        })
            .then((res) => res.json())
            .then((data) => {
                setMeetings(data.meetings);
                console.log(data)
            })
            .catch((err) => {
                console.log(err)
            })

    }, [userId])

    
    return (

        <>
            <div className="flex">

                <div className="flex flex-col w-2/3">
                    <PageTitle text={'Your activities'} />
                    {
                        !meetings ? 'you have no meetings' :
                            meetings.map((meeting) => (
                                <div>
                                    A {meeting.type} is running
                                    <button
                                        className="px-4 py-2 bg-fuchsia-300 hover:bg-zinc-400 hover:font-semibold hover:text-white text-black rounded-xl shadow-md transition"
                                        onClick={() => navigate(`/${meeting.type}/${meeting.roomId}`)}>{`Join the meeting`}</button>
                                </div>
                            )

                            )}

                </div>
                <div className="flex flex-col w-1/3 gap-2">
                 <div><PageTitle className="text-center" text={'More actions'} /></div>
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => navigate('/editor')}
                            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 hover:font-semibold hover:text-white text-black rounded-xl shadow-md transition">
                            Code Now
                        </button>
                        <button
                            onClick={() => navigate('/collaborate')}
                            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 hover:font-semibold hover:text-white text-black rounded-xl shadow-md transition">
                            MeetCode
                        </button>
                        <button
                            onClick={() => navigate('/collaborate')}
                            className="px-6 py-3 bg-red-500 hover:bg-cyan-600 hover:font-semibold hover:text-white text-black rounded-xl shadow-md transition">
                            CollabCode
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}