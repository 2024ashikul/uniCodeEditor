import { useState, useEffect, useContext } from "react";
import PageTitle from "../SharedComponents/PageTitle";
import MDEditor from "@uiw/react-md-editor";
import { API_URL } from "../../config";
import NullComponent from "../SharedComponents/NullComponent";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";

export default function Problems({ assignmentId }) {
    const [problems, setProblems] = useState([]);
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
                    body: JSON.stringify({ assignmentId })
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
        if (assignmentId) {
            fetchProblems();
        }
    }, [assignmentId, token])


    return (
        <>
            <div className={`flex flex-col `}>
                <div className="flex mt-2 justify-between">
                    <PageTitle
                        text={`Problems ${problems.length}`}
                    />
                </div>

                {problems?.length === 0 ?
                    <NullComponent text={'No problems found'} />
                    :
                    <div className="grid pt-8 grid-cols-16 gap-4">
                        <div className="col-span-3 flex flex-col">
                            {problems.map((item, index) => (
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
                                            className="px-4 py-2 bg-blue-400 rounded-full text-white"
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