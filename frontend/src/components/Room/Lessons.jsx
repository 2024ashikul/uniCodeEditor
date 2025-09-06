import { useState, useEffect, useContext } from "react";
import PopUp from "../SharedComponents/PopUp"

import { useNavigate } from "react-router-dom";
import PageTitle from "../SharedComponents/PageTitle";
import Button from "../SharedComponents/Button";
import { UIContext } from "../../Contexts/UIContext/UIContext";
import NullComponent from "../SharedComponents/NullComponent";
import { API_URL } from "../../config";

export default function Lessons({ roomId }) {
    const { popUp } = useContext(UIContext);
    const [lessons, setLessons] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

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
    const filteredLessons = lessons.filter((lesson) =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className={`flex flex-col ${popUp && 'transition duration-500 blur pointer-events-none'} `}>
                <div className="flex mt-2 justify-between items-center">
                    <PageTitle text={'Lessons'} />
                    
                    
                    <input
                        type="text"
                        placeholder="Search lessons..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-64"
                    />
                </div>
                <div className="min-w-full pt-4 flex flex-col gap-2 rounded-2xl transition duration-500">
                    <div className="grid grid-cols-5 bg-gray-100 rounded-xl font-semibold text-gray-700 px-4 py-3 shadow-sm">
                        <div className="px-4">ID</div>
                        <div className="col-span-2">Title</div>
                        <div className="px-4">Created</div>
                        <div className="text-center">Actions</div>
                    </div>

                    <div className=" min-w-full pt-4  flex flex-col gap-2  rounded-2xl transition duration-1000">
                        {
                            filteredLessons.length === 0 ?
                                <NullComponent text={'No lessons yet'} />
                                : filteredLessons.map((item, i) => (
                                    <div className="grid grid-cols-5 items-center bg-white rounded-xl shadow hover:shadow-md transition cursor-pointer
                                    "
                                        key={i}
                                        >

                                        <div className="px-4 py-2 ">{item.id}</div>
                                        <div className="px-4 py-2 col-span-2">{item.title}</div>
                                        <div className="px-4 py-2 ">{item.createdAt.slice(2, 10)}</div>
                                        
                                        <div className="flex gap-2 justify-center px-4 py-2">

                                            <button
                                                onClick={() => navigate(`/lesson/${item.id}`)}
                                                className="px-3 py-1 rounded-full text-sm bg-green-500 text-white hover:bg-green-600"
                                            >
                                                View
                                            </button>
                                        </div>
                                    </div>
                                ))}

                    </div>
                </div>
            </div>


        </>
    )
}