import { useState, useEffect } from "react";
import PopUp from "../SharedComponents/PopUp"

import { useNavigate } from "react-router-dom";
import PageTitle from "../SharedComponents/PageTitle";
import Button from "../SharedComponents/Button";
import { UIContext } from "../../Contexts/UIContext/UIContext";
import NullComponent from "../SharedComponents/NullComponent";
import { API_URL } from "../../config";

export default function Assignements({ roomId }) {
    
    const [assignments, setAssignments] = useState([]);
    
    useEffect(() => {
        fetch(`${API_URL}/scheduleassignmentsuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomId })
        })
            .then((res) => res.json())
            .then((data) => { console.log(data); setAssignments(data) })
            .catch((err) => console.log(err))
    }, [roomId])
    const navigate = useNavigate();

    console.log("hi there it iss git testing")
    return (
        <>
            <div className={`flex flex-col  `}>
                <div className="flex mt-2 justify-between">
                    <PageTitle
                        text={'Assignments'}
                    />
                </div>
                <div className=" min-w-full pt-4  flex flex-col gap-2  rounded-2xl transition duration-1000">
                    {
                    assignments.length === 0 ? 
                    <NullComponent text={'No assignements assigned'} />
                   : assignments.map((item, i) => (
                        <div className="shadow-sm items-center rounded-2xl cursor-pointer transition flex w-full 
                                  hover:bg-slate-300
                                    "
                            key={i}
                            onClick={() => navigate(`/assignment/${item.id}`)}>

                            <div className="px-4 py-2 flex-1">{i+1}</div>
                            <div className="px-4 py-2 flex-1">{item.title}</div>
                            <div className="px-4 py-2 flex-1">{item.createdAt.slice(2, 10)}</div>
                            <div className="px-4 py-2 flex-1 whitespace-pre-line  overflow-hidden">{item.description}</div>
                            <div className="px-4 py-2 flex-1">{item.status}</div>
                        </div>
                    ))}

                </div>
            </div>

        </>
    )
}