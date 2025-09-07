import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import NullComponent from "../SharedComponents/NullComponent";
import { API_URL } from "../../config";


export default function Submissions({ assignmentId }) {
    const [submissions, setSubmissions] = useState([]);
    const { userId ,token} = useContext(AuthContext);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const res = await fetch(`${API_URL}/submission/user/fetchall`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ assignmentId, userId })
                })

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                setSubmissions(data); 
            } catch (err) {
                console.error("Failed to fetch lessons:", err);
            }
        };
        if (assignmentId) {
            fetchSubmissions();
        }
    }, [assignmentId, token,userId])

    return (
        <>
            <div className="flex mt-2 justify-between">
                <p className="text-3xl py-2 ">Submissions</p>

            </div>

            <div className=" min-w-full pt-4  flex flex-col gap-2  rounded-2xl transition duration-1000">
                <div className="grid grid-cols-5 bg-gray-100 rounded-xl font-semibold text-gray-700 px-4 py-3 shadow-sm">
                    <div className="px-4">ID</div>
                    <div className="">Name</div>
                    <div className="px-4">Time</div>
                    <div className="px-4">AI Score</div>
                    <div className="text-center">Actions</div>
                </div>
                <div className="min-w-full pt-4  flex flex-col gap-2  rounded-2xl transition duration-1000">
                    {submissions?.length === 0 ?
                        <NullComponent
                            text={'No submissions found'} />
                        :
                        submissions.map((item, index) => (
                            <div key={item?.id} className="grid grid-cols-5 items-center bg-white rounded-xl shadow hover:shadow-md transition cursor-pointer">
                                <div className="px-4 py-2 ">{index + 1}</div>
                                <div className=" px-4 py-2 ">{item?.user?.name}</div>
                                <div className="px-4 py-2 ">{item?.time.slice(11, 19)}</div>
                                <div className="px-4 py-2 ">{item?.AIscore}</div>

                                <div className="px-4 gap-2 flex">
                                    <a href={`${API_URL}/files/${item?.file}.txt`}
                                        className="px-3 py-1 rounded-full text-sm bg-green-500 text-white hover:bg-green-600" target="_blank">View</a>


                                    <a href={`${API_URL}/files/${item?.file}.${item?.ext}`} className="px-3 py-1 rounded-full text-sm bg-green-500 text-white hover:bg-green-600" target="_blank">Download</a>
                                </div>

                            </div>
                        )) || null}
                </div>
            </div>
        </>
    )
}
