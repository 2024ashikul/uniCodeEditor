import { useState, useEffect, useContext } from "react";

import { API_URL } from "../../../config";
import PageTitle from "../../SharedComponents/PageTitle";
import NullComponent from "../../SharedComponents/NullComponent";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";

export default function Results({ assessmentId }) {
    const [results, setResults] = useState([]);
    const [result, setResult] = useState([]);
    const { userId, token } = useContext(AuthContext);
    const [isPublished, setIsPublished] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API_URL}/submission/user/project/results`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ assessmentId, userId }),
                });
                const data = await res.json();
                console.log(data);
                setIsPublished(data.published);
                setResults(data.results);
                setResult(data.result);

            } catch (err) {
                console.error("Failed to fetch results:", err);
            }
        })();
    }, [assessmentId, isPublished, userId, token]);





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


            <div className="w-full pt-0  rounded-2xl flex flex-col">
                <div className="w-full mb-6 rounded-2xl" >
                    <div className="text-2xl flex justify-between  mb-2">

                        <div>  Your Result
                        </div>
                        <div>
                            Total Score : {result?.FinalScore}
                        </div>
                    </div>

                    <div className="w-full bg-white rounded-xl shadow hover:shadow-md transition p-4">

                        <div className="grid grid-cols-4 gap-2 items-center border-b pb-2 mb-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            <div className="px-2">Name</div>
                            <div className="px-2">Time</div>
                            <div className="px-2">Final Score</div>
                            <div className="px-2 text-center">Actions</div>
                        </div>


                        <div className="grid grid-cols-4 gap-2 items-center">
                            <div className="px-2 py-1 text-gray-800">{result?.user?.name}</div>
                            <div className="px-2 py-1 text-gray-800">{result?.time.slice(11, 19)}</div>
                            <div className="px-2 py-1 text-gray-800 font-medium">{result?.FinalScore}</div>

                            <div className="flex gap-2 justify-center px-2">
                                <a
                                    href={`${API_URL}/files/${result?.file}.txt`}
                                    target="_blank"
                                    className="px-3 py-1 rounded-full text-sm bg-green-500 text-white hover:bg-green-600 shadow-sm"
                                >
                                    View
                                </a>
                                <a
                                    href={`${API_URL}/files/${result?.file}.${result?.ext}`}
                                    target="_blank"
                                    className="px-3 py-1 rounded-full text-sm bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
                                >
                                    Download
                                </a>
                            </div>
                        </div>
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
                                    <th className="px-3 py-2 text-left">Download</th>
                                    <th className="px-3 py-2 text-right">Total Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results?.map((result, idx) => (
                                    <tr
                                        key={result.id ?? idx}
                                        className={`border-t ${result.member.id === userId ? "bg-blue-50" : "bg-red-500"}`}
                                    >
                                        <td className="px-3 py-2 text-center">{idx + 1}</td>
                                        <td className="px-3 py-2">{result?.member?.name}</td>
                                        <td className="px-3 py-2">{result?.member?.email}</td>
                                        <td className="px-3 py-2">Download</td>
                                        <td className="px-3 py-2 text-right font-semibold">
                                            {result.submission.FinalScore}
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
