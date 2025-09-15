import { useContext, useEffect, useState } from "react";
import PopUp from "../SharedComponents/PopUp";
import PageTitle from "../SharedComponents/PageTitle";
import Button from "../SharedComponents/Button";
import { UIContext } from "../../Contexts/UIContext/UIContext";
import NullComponent from "../SharedComponents/NullComponent";
import { AlertContext } from "../../Contexts/AlertContext/AlertContext";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import LoadingParent from "../SharedComponents/LoadingParent";
import { APIRequest } from "../../APIRequest";
import { API_URL } from "../../config";



export default function Annoucements({ roomId }) {
    const { request } = APIRequest();
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

                const data = await request("/meeting/room/getstatus", { method: "POST", body: { roomId } });
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

    const formatTimeAgo = (date) => {
        const d = date instanceof Date ? date : new Date(date);
        const diff = Math.floor((Date.now() - d.getTime()) / 1000);
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

   const categoryColors = {
        Info: "bg-sky-50 border-sky-400 text-sky-800",
        CodeAssignment: "bg-purple-50 border-purple-400 text-purple-800",
        ProjectAssignment: "bg-indigo-50 border-indigo-400 text-indigo-800",
        Quiz: "bg-amber-50 border-amber-400 text-amber-800",
        Material: "bg-slate-50 border-slate-400 text-slate-800",
        Lesson: "bg-teal-50 border-teal-400 text-teal-800",
        Extra: "bg-pink-50 border-pink-400 text-pink-800",
    };

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const data = await request("/announcement/fetchall", { method: "POST", body: { roomId } });
                console.log(data)
                setAnnoucements(data);
            } catch (err) {
                console.log("Failed to fetch lesson", err);
            }
        }
        if (roomId) {
            fetchAnnouncements();
        }
    }, [roomId, token])

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const createAnnouncement = async (e) => {
        e.preventDefault();
        try {
            const data = await request("/announcement/create", { method: "POST", body: { roomId, form, userId } });
            setAnnoucements(prev => [data.newAnnoucement, ...prev])
            setMessage(data.message)
            setPopUp(false);
            setAnnoucement(false);

        } catch (err) {
            console.log(err);
            setMessage('Internal server error');
        }
    }

    const createMeeting = async (e, type) => {
        e.preventDefault();
        try {
            const data = await request("/meeting/create", { method: "POST", body: { roomId, userId, type } });
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
                    <div className="flex-1 space-y-4">
                        {
                            announcements === null ?
                                <LoadingParent /> :
                                announcements.length === 0 ?
                                    <NullComponent
                                        text={'No announcments found!'}
                                    />
                                    :

                                    announcements?.map((item, i) => (
                                    <div
                                        key={i}
                                        className={`bg-white shadow-md mt-4 rounded-2xl border-l-2 ${categoryColors[item.category]}   transition hover:shadow-lg hover:scale-[1.01] duration-300 p-4`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {
                                                item?.user?.profile_pic ?
                                                    <img
                                                        src={`${API_URL}/profilephotos/${item.user.profile_pic}`}
                                                        alt={item.user.name}
                                                        className="w-8 h-8 rounded-full"
                                                    /> :
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                                                        {item?.user?.name[0].toUpperCase()}
                                                    </div>
                                            }

                                            <div className="flex flex-col">
                                                <h2 className="text-black text-base font-semibold">{item.title}</h2>
                                                <p className="text-xs text-gray-500">
                                                    {item?.user?.name} • {formatTimeAgo(item?.createdAt)}
                                                </p>
                                            </div>
                                            <span
                                                className={`ml-auto px-4 py-0.5 text-sm rounded-full ${categoryColors[item.category]}`}
                                            >
                                                {item.category}
                                            </span>
                                        </div>

                                        <div className="mt-4 border-t-[1px] border-gray-100">
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
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