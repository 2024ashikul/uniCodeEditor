import { useState, useEffect, useContext } from "react";

import { API_URL } from "../../../config";
import PageTitle from "../../SharedComponents/PageTitle";
import NullComponent from "../../SharedComponents/NullComponent";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";

export default function Results({ assessmentId, isPublished }) {
    const [results, setResults] = useState([]);
    const [result, setResult] = useState([]);
    const { userId } = useContext(AuthContext);

    useEffect(() => {
        if (!isPublished) return;
        (async () => {
            try {
                const res = await fetch(`${API_URL}/submission/user/results`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ assessmentId, userId }),
                });
                const data = await res.json();
                console.log(data);
                setResults(data.results);
                setResult(data.result);
                
            } catch (err) {
                console.error("Failed to fetch results:", err);
            }
        })();
    }, [assessmentId, isPublished, userId]);


    let selftotal = 0;
    if(result){
        result.map(submission => {
            selftotal += submission?.submission?.AIscore || 0;
        })
    }

    if (!isPublished) {
        return (
            <>
                <div className="flex justify-between">
                    <PageTitle text={"Assessment results"} />
                </div>
                <div className="w-full pt-4 flex flex-col gap-4 rounded-2xl">
                    <NullComponent text={"Result not published yet"} />
                </div>
            </>
        );
    }

    return (
        <div className="flex flex-col mt-2">
            <div className="flex justify-between">
                <PageTitle text={"Assessment results"} />
            </div>

            <div className="w-full pt-4 rounded-2xl flex flex-col">
                <div className="w-full pt-4 rounded-2xl" >
                    <div className="text-2xl flex justify-between border-b mb-2">
                        
                      <div>  Your Result
                        </div>
                        <div>
                            Total Score : {selftotal}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {result.map((group, problemIndex) => (
                            <div key={problemIndex} className="p-3 bg-gray-100 rounded-lg">
                                <h4 className="font-medium text-gray-800 mb-2">Problem {problemIndex + 1}</h4>
                                {group.submission ? (
                                    <div className="flex flex-col gap-2">

                                        <div key={1} className="text-sm border-b last:border-b-0 pb-2">
                                            <div className="flex justify-between items-center">
                                                <p className="font-semibold text-gray-600">Submission {1 + 1}</p>
                                                <p className="font-bold text-blue-600">{group.submission.AIscore || 0}</p>
                                            </div>
                                            <a
                                                href={`${API_URL}/files/${group.submission?.file}.txt`}
                                                className="text-blue-500 hover:text-blue-700 underline text-xs"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View Code
                                            </a>
                                        </div>

                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-500 italic">Not Submitted</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                    
                    <div className="text-2xl border-b my-2">Assessment Ranking</div>

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
                                        className={`border-t ${r.member.id === userId ? "bg-blue-50" : ""}`}
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
            </div>
        </div>
    );
}
