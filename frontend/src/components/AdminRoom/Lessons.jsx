import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../SharedComponents/PageTitle";
import Button from "../SharedComponents/Button";
import { UIContext } from "../../Contexts/UIContext/UIContext";
import NullComponent from "../SharedComponents/NullComponent";
import { API_URL } from "../../config";
import { AlertContext } from "../../Contexts/AlertContext/AlertContext";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import LoadingParent from "../SharedComponents/LoadingParent";

export default function Lessons({ roomId }) {
    const { popUp } = useContext(UIContext);
    const { setMessage } = useContext(AlertContext);
    const [lessons, setLessons] = useState(null);
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const res = await fetch(`${API_URL}/lesson/fetchall`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ roomId })
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                setLessons(data.lessons);
            } catch (err) {
                console.error("Failed to fetch lessons:", err);
            }
        };
        if (roomId) {
            fetchLessons();
        }
    }, [roomId, token]);


    const deleteLesson = async (lessonId) => {
        try {
            const res = await fetch(`${API_URL}/lesson/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ lessonId })
            });
            const data = res.json();
            if (res.ok) {
                setMessage(data.message);
                console.log(data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <div className={`flex flex-col ${popUp && 'transition duration-500 blur pointer-events-none'} `}>
                <div className="flex mt-2 justify-between">
                    <PageTitle
                        text={'Lessons'}
                    />
                    <Button
                        onClickAction={() => navigate(`/room/${roomId}/createlesson`)}
                        buttonLabel={'Create a new Lesson'}
                    />
                </div>
                <div className="min-w-full pt-4 flex flex-col gap-2 rounded-2xl transition duration-500">
                    <div className="grid grid-cols-6 bg-gray-100 rounded-xl font-semibold text-gray-700 px-4 py-3 shadow-sm">
                        <div className="px-4">ID</div>
                        <div className="col-span-2">Title</div>
                        <div className="px-4">Created</div>
                        <div className="px-4">Status</div>
                        <div className="text-center">Actions</div>
                    </div>

                    {
                    
                    lessons === null ? <LoadingParent /> : 
                    lessons.length === 0 ? (
                        <NullComponent text={"No lessons found!"} />
                    ) : (
                        lessons?.map((item, i) => (
                            <div
                                className="grid grid-cols-6 items-center bg-white rounded-xl shadow hover:shadow-md transition cursor-pointer"
                                key={i}
                            >
                                <div className="px-4 py-2">{item.id}</div>
                                <div className="px-4 py-2 col-span-2">{item.title}</div>
                                <div className="px-4 py-2">{item.createdAt.slice(2, 10)}</div>
                                <div className="px-4 py-2">{item.status}</div>
                                <div className="flex gap-2 justify-center px-4 py-2">
                                    <button
                                        onClick={() => navigate(`/updatelesson/${item.id}`)}
                                        className="px-3 py-1 rounded-full text-sm bg-blue-500 text-white hover:bg-blue-600"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => navigate(`/lesson/${item.id}`)}
                                        className="px-3 py-1 rounded-full text-sm bg-green-500 text-white hover:bg-green-600"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => deleteLesson(item.id)}
                                        className="px-3 py-1 rounded-full text-sm bg-red-500 text-white hover:bg-blue-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>


        </>
    )
}