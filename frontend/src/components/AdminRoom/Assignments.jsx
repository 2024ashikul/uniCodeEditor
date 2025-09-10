import { useState, useEffect, useContext } from "react";
import PopUp from "../SharedComponents/PopUp"

import { useNavigate } from "react-router-dom";
import PageTitle from "../SharedComponents/PageTitle";
import Button from "../SharedComponents/Button";
import { UIContext } from "../../Contexts/UIContext/UIContext";
import NullComponent from "../SharedComponents/NullComponent";
import { AlertContext } from "../../Contexts/AlertContext/AlertContext";
import { API_URL } from "../../config";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import LoadingParent from "../SharedComponents/LoadingParent";

export default function Assignements({ roomId }) {
    const { popUp, setPopUp, setTitle } = useContext(UIContext);
    const { token,userId } = useContext(AuthContext);
    const [form, setForm] = useState({
        title: '',
        description: ''
    });

    const { setMessage, setType } = useContext(AlertContext);
    const [assignment, setAssignment] = useState(false);
    const [assignments, setAssignments] = useState(null);
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const res = await fetch(`${API_URL}/assignment/admin/fetchall`, {
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
                setAssignments(data)
            } catch (err) {
                console.error("Failed to fetch lessons:", err);
            }
        };
        if (roomId) {
            fetchAssignments();
        }
    }, [roomId, token])

    const navigate = useNavigate();
    const createAssignment = async (e) => {
        e.preventDefault();
        console.log(form);
        try {
            const res = await fetch(`${API_URL}/assignment/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ roomId, form ,userId})
            })
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            setAssignments((prev) => [...prev, data.newAssignment]);
            setMessage(data.message)
            setPopUp(false);
            setAssignment(false);

        } catch (err) {
            console.log(err);
            setMessage('Internal server error');
            setType('error')
        }
    }

    return (
        <>
            <div className={`flex flex-col ${popUp && 'transition duration-500 blur pointer-events-none'} `}>
                <div className="flex mt-2 justify-between">
                    <PageTitle
                        text={'Assignments'}
                    />
                    <Button
                        onClickAction={() => setAssignment(true)}
                        buttonLabel={'Create a new Assignment'}
                    />
                </div>
                <div className=" min-w-full pt-4  flex flex-col gap-2  rounded-2xl transition duration-1000">
                    <div className="grid grid-cols-6 bg-gray-100 rounded-xl font-semibold text-gray-700 px-4 py-3 shadow-sm">
                        <div className="px-4">ID</div>
                        <div className="px-4 col-span-2">Title</div>
                        <div className="px-4">Created</div>

                        <div className="px-4">Status</div>
                        <div className="text-center">Actions</div>
                    </div>
                    {
                        assignments === null ?
                        <LoadingParent />
                        :
                        assignments.length === 0 ?
                            <NullComponent text={'No assignments found'} />

                            : assignments.map((item, i) => (
                                <div className="grid grid-cols-6 items-center bg-white
                        shadow  hover:shadow-md transition cursor-pointer
                                    "
                                    key={i}
                                    onClick={() => { setTitle(item.title); navigate(`/assignment/${item.id}`) }}>

                                    <div className="px-4 py-2 ">{item.id}</div>
                                    <div className="px-4 py-2 col-span-2">{item.title}</div>
                                    <div className="px-4 py-2 ">{item.createdAt.slice(2, 10)}</div>
                                    <div className="px-4 py-2 ">{item.status.toUpperCase()}</div>
                                    <div className="flex justify-between items-center m-auto">
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
            {assignment &&
                <PopUp

                    form={form}
                    name={assignment}
                    setName={setAssignment}
                    onChange={handleChange}
                    onSubmit={createAssignment}
                    extraFields={null}
                    title={'Create a new Asssignment'}
                    buttonTitle={'Create Assignment'}
                />
            }

        </>
    )
}