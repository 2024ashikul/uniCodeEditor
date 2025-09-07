import { useContext, useEffect, useState } from "react";
import PopUp from "../SharedComponents/PopUp";
import PageTitle from "../SharedComponents/PageTitle";
import Button from "../SharedComponents/Button";
import { UIContext } from "../../Contexts/UIContext/UIContext";
import NullComponent from "../SharedComponents/NullComponent";
import { AlertContext } from "../../Contexts/AlertContext/AlertContext";
import InlineButton from "../SharedComponents/InlineButton";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import LoadingParent from "../SharedComponents/LoadingParent";



export default function Annoucements({ roomId }) {
    const [announcements, setAnnoucements] = useState(null);
    const [announcement, setAnnoucement] = useState(false);
    const [meetingColClass, setMeetingColClass] = useState(null);
    const [meetingCol, setMeetingCol] = useState(null);
    const { popUp, setPopUp } = useContext(UIContext);
    const { setMessage, setType } = useContext(AlertContext);
    const { token, userId } = useContext(AuthContext);
    const [form, setForm] = useState({
        title: '',
        description: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const res = await fetch(`${API_URL}/meeting/room/getstatus`, {
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
                setMeetingColClass(data.activeCollaborateClassRoom);
                setMeetingCol(data.activeCollaborateRoom);
            } catch (err) {
                console.log("Failed to fetch lesson", err);
            }
        }

        if (roomId) {
            fetchMeetings();
        }
    }, [roomId, token])

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const res = await fetch(`${API_URL}/room/announcement/fetchall`, {
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
                setAnnoucements(data);
            } catch (err) {
                console.log("Failed to fetch lesson", err);
            }
        }

        if (roomId) {
            fetchAssignment();
        }
    }, [roomId, token])

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const createAnnouncement = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/room/announcement/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ roomId, form })
            })

            const data = await res.json();

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            setAnnoucements(prev => [data.newAnnoucement, ...prev])
            setMessage(data.message)
            setPopUp(false);
            setAnnoucement(false);

        } catch (err) {
            console.log(err);
            setMessage('Internal server error');
            setType('error');
        }
    }

    const createMeeting = async (e, type) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/meeting/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ roomId, userId, type })
            })

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            console.log(data);
            setMessage(data.message);
            navigate(`/collaborateclassroom/${roomId}`)

        } catch (err) {
            console.log(err);
            setMessage('Internal server error');
            setType('error');
        }
    }

    return (

        <>
            <div className={`flex flex-col ${popUp && 'transition duration-500 blur pointer-events-none'}`}>
                <div className="flex mt-2 justify-between">
                    <PageTitle
                        text={'Announcements'}
                    />
                    <Button
                        onClickAction={() => { setAnnoucement(true) }}
                        buttonLabel={'Create a New Announcement'}
                    />
                </div>
                <div className="flex-1 min-w-full pt-4  flex  gap-4  rounded-2xl transition duration-1000">
                    <div className="flex-1 ">
                        {
                            announcements === null ?
                                <LoadingParent /> :
                                announcements.length === 0 ?
                                    <NullComponent
                                        text={'No announcments found!'}
                                    />
                                    :

                                    announcements.map((item, i) => (
                                        <div className="shadow-lg border-amber-700 flex-col mb-4 rounded-2xl transition duration-500 flex w-full 
                                hover:bg-slate-100  "
                                            key={i}>

                                            <div className="flex">
                                                <div className="px-4 py-2 font-semibold text-lg self-center">{item.title}</div>
                                                <div className="px-4 py-2 flex-1 self-end text-sm">{new Date(item.createdAt).toLocaleDateString()}</div>
                                            </div>
                                            <div className="pl-8 py-2 flex-1 overflow-hidden">{item.description}</div>

                                        </div>
                                    ))
                        }

                    </div>
                    <div className="min-w-[400px] flex flex-col gap-4">

                        <div
                            className="flex flex-col items-center justify-between gap-3 bg-white shadow-lg rounded-2xl px-5 py-2 border border-gray-100 hover:shadow-xl transition"
                        >
                            <h4 className="text-md font-semibold text-fuchsia-600">
                                CollaborateClassRoom Meeting 
                            </h4>
                            {
                                meetingColClass === null ?
                                    <button
                                        className="self-center px-4 py-1 bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-lg shadow-md transition"
                                        onClick={(e) => createMeeting(e, 'collaborateclassroom')}
                                    >
                                        Create Meeting
                                    </button> :
                                    <button
                                        className="self-center px-4 py-1 bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-lg shadow-md transition"
                                        onClick={() => { navigate(`/collaborateclassroom/${roomId}`) }}
                                    >
                                        Join Meeting
                                    </button>
                            }
                        </div>
                        <div
                            className="flex flex-col items-center justify-between gap-3 bg-white shadow-lg rounded-2xl px-5 py-2 border border-gray-100 hover:shadow-xl transition"
                        >
                            <h4 className="text-md font-semibold text-fuchsia-600">
                                CollaborateRoom Meeting
                            </h4>
                            {
                                meetingCol === null ?
                                    <button
                                        className="self-center px-4 py-1 bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-lg shadow-md transition"
                                        onClick={(e) => createMeeting(e, 'collaborateroom')}
                                    >
                                        Create Meeting
                                    </button> :
                                    <button
                                        className="self-center px-4 py-1 bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-lg shadow-md transition"
                                        onClick={() => { navigate(`/collaborateroom/${roomId}`) }}
                                    >
                                        Join Meeting
                                    </button>
                            }
                        </div>

                    </div>
                </div>
            </div>
            {announcement &&
                <PopUp
                    form={form}
                    name={announcement}
                    setName={setAnnoucement}
                    onChange={handleChange}
                    onSubmit={createAnnouncement}
                    extraFields={null}
                    title={'Create a new Annoucement'}
                    buttonTitle={'Create Annoucement'}
                />
            }
        </>
    )
}