import { useState, useEffect, useContext } from "react";

import PageTitle from "../../SharedComponents/PageTitle";
import Button from "../../SharedComponents/Button";
import { AlertContext } from "../../../Contexts/AlertContext/AlertContext";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";
import LoadingParent from "../../SharedComponents/LoadingParent";
import { API_URL } from "../../../config";

 function ProblemCard({ problem, index, answers }) {
   

    return (
        <div className="bg-white shadow-md rounded-xl w-[800px] p-4 border border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
                {index + 1}. {problem.title}{" "}
                <span className="ml-2 text-sm text-gray-600">({problem.fullmarks} marks)</span>
            </h3>

            {problem.type === "MCQ" && (
                <ul className="space-y-2">
                    {problem.options?.map((opt, i) => (
                        <li key={i} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name={`q-${problem.id}`}
                                value={opt}
                                checked={answers[problem.id] === opt}
                                disabled
                            />
                            <label className="flex gap-10 text-sm">{opt}{opt===problem.correctAnswer && (<p className="text-green-800 font-bold">( Correct) </p>)}</label>
                        </li>
                    ))}
                </ul>
            )}

            {problem.type === "ShortQuestion" && (
                <textarea
                    className="w-full border rounded-md p-2 text-sm"
                    rows={3}
                    placeholder="Type your answer..."
                    value={problem.correctAnswer || ""}  
                    disabled
                />
            )}
        </div>
    );
}


export default function Results({ assessmentId }) {
    // const [members, setMembers] = useState(null);
    const [problems, setProblems] = useState(null);
    const [answers, setAnswers] = useState({});
    const [results, setResults] = useState(null);
    const { token } = useContext(AuthContext);
    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await fetch(`${API_URL}/submission/user/results/quiz`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ assessmentId })
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                setProblems(data.problems);
                console.log(data);
                const initialAnswers = {};
                data.submissions.forEach(sub => {

                    initialAnswers[sub.problemId] = sub.submittedoption || sub.submittedanswer || '';
                });
                setAnswers(initialAnswers);
                //setMembers(data.results);
                setResults(data.results);

            } catch (err) {
                console.error("Failed to fetch results:", err);
            }
        };
        fetchResults();
    }, [assessmentId, token]);

   
   

    return (
        <div className="flex flex-col mt-2">
            <div className="flex mb-2 justify-between">
                <PageTitle text={'Quiz results'} />

            </div>

            <div className="w-full rounded-2xl">
                {results?.length === 0 ? (
                    <NullComponent text={"No results to display. Check back later."} />
                ) : (
                    <table className="w-full text-sm border rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-3 py-2 text-center">#</th>
                                <th className="px-3 py-2 text-left">Name</th>
                                <th className="px-3 py-2 text-left">Email</th>
                                <th className="px-3 py-2 text-right">Total Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results?.map((r, idx) => (
                                <tr
                                    key={r.id ?? idx}
                                    className={`border-t ${r.member.id === '1' ? "bg-blue-50" : ""}`}
                                >
                                    <td className="px-3 py-2 text-center">{idx + 1}</td>
                                    <td className="px-3 py-2">{r?.member?.name}</td>
                                    <td className="px-3 py-2">{r?.member?.email}</td>
                                    <td className="px-3 py-2 text-right font-semibold">
                                        {r.totalscore}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="space-y-6 mt-4 mx-auto">
                {problems?.map((problem, index) => (
                    <ProblemCard
                        key={problem.id}
                        problem={problem}
                        index={index}
                        answers={answers}
                    />
                ))}
            </div>


        </div>
    );
}