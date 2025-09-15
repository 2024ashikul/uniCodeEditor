import { useState, useEffect, useContext } from "react";

import MDEditor from "@uiw/react-md-editor";


import { useNavigate } from "react-router-dom";


import PageTitle from "../../SharedComponents/PageTitle";
import { API_URL } from "../../../config";
import NullComponent from "../../SharedComponents/NullComponent";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";
import LoadingParent from "../../SharedComponents/LoadingParent";

export default function Problems({ assessmentId }) {
    const [problems, setProblems] = useState(null);
    const [activeProblem, setActiveProblem] = useState(null);
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const res = await fetch(`${API_URL}/problem/fetchall`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ assessmentId })
                })

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                setProblems(data);
                setActiveProblem(data[0]);
                console.log(data)

            } catch (err) {
                console.error("Failed to fetch lessons:", err);
            }
        };
        if (assessmentId) {
            fetchProblems();
        }
    }, [assessmentId, token])


    return (
        <>
            <div className={`flex flex-col `}>
                <div className="flex mt-2 justify-between">
                    <PageTitle
                        text={`Problems ${problems?.length || 0}`}
                    />
                </div>

                {
                problems === null ? 
                <LoadingParent />
                :

                problems?.length === 0 ?
                    <NullComponent text={'No problems found'} />
                    :
                    <div className="grid pt-8 grid-cols-16 gap-4">
                        <div className="col-span-3 flex flex-col">
                            {problems?.map((item, index) => (
                                activeProblem === item ?
                                    <div className=" bg-green-400 w-full text-lg px-4 py-2" onClick={() => setActiveProblem(item)}>
                                        Problem {index + 1}
                                    </div>
                                    :
                                    <div className="bg-cyan-100 w-full text-lg px-4 py-2" onClick={() => setActiveProblem(item)}>
                                        Problem {index + 1}
                                    </div>
                            ))}

                        </div>
                        <div className="col-span-13">

                            {
                                activeProblem &&
                                <div className="shadow-md border-fuchsia-200 flex-col rounded-2xl transition duration-500 flex w-full "
                                >
                                    <div className="flex flex-1 bg-gray-200 gap-2 rounded-2xl items-center px-4">

                                        <div className="flex flex-1">
                                            <div className="px-4 py-2 flex-1 text-xl self-center">{activeProblem.title}</div>
                                        </div>
                                        <div className="px-4">
                                            Full marks : {activeProblem.fullmarks}
                                        </div>

                                        <div
                                            className="px-4 py-2 bg-blue-400 rounded-full text-white
                                            hover:scale-105 transition"
                                            onClick={() => navigate(`/problem/${activeProblem.id}`)}>
                                            Solve
                                        </div>
                                    </div>
                                    <div className="pl-8 py-2 flex-1 overflow-hidden">
                                        <MDEditor.Markdown source={activeProblem.statement} />
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                }
            </div>
        </>
    )
}