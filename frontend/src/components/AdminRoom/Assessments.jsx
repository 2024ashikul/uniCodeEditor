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

export default function Assessments({ roomId }) {
    const { popUp, setPopUp, setTitle } = useContext(UIContext);
    const { token, userId } = useContext(AuthContext);
    const [form, setForm] = useState({
        title: '',
        description: ''
    });

    const { setMessage, setType } = useContext(AlertContext);
    const [Assessment, setAssessment] = useState(false);
    const [Assessments, setAssessments] = useState(null);
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const res = await fetch(`${API_URL}/assessment/admin/fetchall`, {
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
                setAssessments(data)
            } catch (err) {
                console.error("Failed to fetch lessons:", err);
            }
        };
        if (roomId) {
            fetchAssessments();
        }
    }, [roomId, token])

    const navigate = useNavigate();
    const createAssessment = async (e) => {
        e.preventDefault();
        console.log(form);
        try {
            const res = await fetch(`${API_URL}/assessment/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ roomId, form, userId })
            })

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            setAssessments((prev) => [...prev, data.newAssessment]);
            setMessage(data.message)
            setPopUp(false);
            setAssessment(false);

        } catch (err) {
            console.log(err);
            setMessage('Internal server error');
            setType('error')
        }
    }

    const PopUpCode = (<form
        method="POST"
        onSubmit={createAssessment}
        onChange={handleChange}
        className="flex flex-col gap-6"
    >

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <label className="w-full sm:w-28 text-gray-700 font-medium" htmlFor="title">
                Title
            </label>
            <input
                required
                value={form?.title || ""}
                id="title"
                name="title"
                type="text"
                placeholder="Enter title"
                onChange={handleChange}
                className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition duration-300"
            />
        </div>


        <div className="flex flex-col sm:flex-row items-start gap-4">
            <label className="w-full sm:w-28 text-gray-700 font-medium pt-2" htmlFor="description">
                Description
            </label>
            <textarea
                value={form?.description || ""}
                id="description"
                name="description"
                placeholder="Enter description"
                onChange={handleChange}
                className="flex-1 w-full h-28 px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition duration-300"
            />
        </div>


        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <label className="w-full sm:w-28 text-gray-700 font-medium" htmlFor="category">
                Category
            </label>
            <select
                required
                id="category"
                name="category"
                value={form?.category || ""}
                onChange={handleChange}
                className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition duration-300"
            >
                <option value="">Select category</option>
                <option value="CodeAssignment">Code Assignment</option>
                <option value="ProjectAssignment">Project Assignment</option>
                <option value="Quiz">Quiz</option>
            </select>
        </div>


        <div className="flex justify-center">
            <button
                type="submit"
                className="relative flex items-center justify-center px-12 py-3 font-semibold rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-xl hover:-translate-y-1"
            >
                Create Assessment
            </button>
        </div>
    </form>);




    return (
        <>
            <div className={`flex flex-col ${popUp && 'transition duration-500 blur pointer-events-none'} `}>
                <div className="flex mt-2 justify-between">
                    <PageTitle
                        text={'Assessments'}
                    />
                    <Button
                        onClickAction={() => setAssessment(true)}
                        buttonLabel={'Create a new Assessment'}
                    />
                </div>
                <div className=" min-w-full pt-4  flex flex-col gap-2  rounded-2xl transition duration-1000">
                    <div className="grid grid-cols-12 bg-gray-100 rounded-xl font-semibold text-gray-700  py-3 shadow-sm">
                        <div className="px-2">ID</div>
                        <div className="px-2 col-span-4">Title</div>
                        <div className="px-2 col-span-2">Type</div>
                        <div className="px-2 col-span-2">Created</div>
                        <div className="px-2 col-span-2">Status</div>
                        <div className="px-2 text-center">Actions</div>
                    </div>
                    {
                        Assessments === null ?
                            <LoadingParent />
                            :
                            Assessments.length === 0 ?
                                <NullComponent text={'No Assessments found'} />

                                : Assessments?.map((item, i) => (
                                        <div className="grid grid-cols-12 py-2 items-center bg-white rounded-xl shadow hover:shadow-md transition cursor-pointer
                                    "
                                            key={i}
                                            onClick={() => navigate(`/assessment/${item.id}`)}>

                                            <div className="px-2  ">{i + 1}</div>
                                            <div className="px-2  col-span-4 text-blue-700">{item.title}</div>
                                            <div className="px-2  col-span-2 ">{item.category}</div>
                                            <div className="px-2  col-span-2">{item?.scheduleTime?.slice(2, 10) + " " + item?.scheduleTime?.slice(11, 18) || 'NOT SPECIFIED'}</div>
                                            <div className="px-2  col-span-2">{item.status}</div>
                                            <div className="flex gap-2 justify-center px-2 ">

                                                <button
                                                    onClick={() => navigate(`/assessment/${item.id}`)}
                                                    className="px-3 py-1 rounded-full text-sm bg-green-500 text-white hover:bg-green-600"
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                </div>
            </div>
            {Assessment &&
                <PopUp


                    name={Assessment}
                    setName={setAssessment}
                    onChange={handleChange}
                    onSubmit={createAssessment}
                    ManualEdit={true}
                    ManualCode={PopUpCode}
                    extraFields={null}
                    title={'Create a new Assessment'}

                />
            }

        </>
    )
}