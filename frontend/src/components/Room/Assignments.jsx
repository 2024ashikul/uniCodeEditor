import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../SharedComponents/PageTitle";
import NullComponent from "../SharedComponents/NullComponent";
import { API_URL } from "../../config";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import LoadingParent from "../SharedComponents/LoadingParent";

export default function Assignements({ roomId }) {
    const [assignments, setAssignments] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const {token} = useContext(AuthContext);

    useEffect(() => {
        fetch(`${API_URL}/assignment/user/fetchall`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ roomId })
        })
            .then((res) => res.json())
            .then((data) => { console.log(data); setAssignments(data) })
            .catch((err) => console.log(err))
    }, [roomId,token])
    const navigate = useNavigate();

    const filteredAssignments = assignments?.filter((lesson) =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    
    return (
        <>
            <div className={`flex flex-col  `}>
                <div className="flex mt-2 justify-between">
                    <PageTitle
                        text={'Assignments'}
                    />
                    <input
                        type="text"
                        placeholder="Search Assignments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-64"
                    />
                </div>
                <div className=" min-w-full pt-4  flex flex-col gap-2  rounded-2xl transition duration-1000">
                    <div className="grid grid-cols-6 bg-gray-100 rounded-xl font-semibold text-gray-700 px-4 py-3 shadow-sm">
                        <div className="px-4">ID</div>
                        <div className="col-span-2">Title</div>
                        <div className="px-4">Created</div>
                        <div className="px-4">Status</div>
                        <div className="text-center">Actions</div>
                    </div>
                    <div className="min-w-full pt-4  flex flex-col gap-2  rounded-2xl transition duration-1000">
                        {
                            assignments === null ?
                            <LoadingParent />
                            :
                            filteredAssignments?.length === 0 ?
                                <NullComponent text={'No assignements assigned'} />
                                : filteredAssignments?.map((item, i) => (
                                    <div className="grid grid-cols-6 items-center bg-white rounded-xl shadow hover:shadow-md transition cursor-pointer
                                    "
                                        key={i}
                                        onClick={() => navigate(`/assignment/${item.id}`)}>

                                        <div className="px-4 py-2 ">{i + 1}</div>
                                        <div className="px-4 py-2 col-span-2">{item.title}</div>
                                        <div className="px-4 py-2 ">{item.scheduleTime.slice(2, 10) + " " + item.scheduleTime.slice(11, 18)}</div>
                                        <div className="px-4">{item.status}</div>
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