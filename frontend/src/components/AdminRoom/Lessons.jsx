import { useState, useEffect, useContext } from "react";
import PopUp from "../SharedComponents/PopUp"

import { useNavigate } from "react-router-dom";
import PageTitle from "../SharedComponents/PageTitle";
import Button from "../SharedComponents/Button";
import { UIContext } from "../../Contexts/UIContext/UIContext";
import NullComponent from "../SharedComponents/NullComponent";
import { API_URL } from "../../config";
import { AlertContext } from "../../Contexts/AlertContext/AlertContext";

export default function Lessons({ roomId }) {
    const { popUp } = useContext(UIContext);
    const { setMessage } = useContext(AlertContext);

    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/fetchlessons`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomId })
        })
            .then((res) => res.json())
            .then((data) => { console.log(data); setLessons(data.lessons) })
            .catch((err) => console.log(err))
    }, [roomId])
    const navigate = useNavigate();

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

                    {/* Header Row */}
                    <div className="grid grid-cols-6 bg-gray-100 rounded-xl font-semibold text-gray-700 px-4 py-3 shadow-sm">
                        <div className="px-4">ID</div>
                        <div className="col-span-2">Title</div>
                        <div className="px-4">Created</div>
                        {/* <div>Description</div> */}
                        <div className="px-4">Status</div>
                        <div className="text-center">Actions</div>
                    </div>


                    {lessons.length === 0 ? (
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
                                {/* <div className="px-4 py-2 whitespace-pre-line overflow-hidden text-sm text-gray-600">
          {item.description}
        </div> */}
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
                                        onClick={()=> deleteLesson(item.id)}
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