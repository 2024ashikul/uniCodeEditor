import { useState, useEffect, useContext } from "react";

import PageTitle from "../../SharedComponents/PageTitle";
import Button from "../../SharedComponents/Button";
import { AlertContext } from "../../../Contexts/AlertContext/AlertContext";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";
import LoadingParent from "../../SharedComponents/LoadingParent";
import { API_URL } from "../../../config";


export default function Results({ assessmentId }) {
    // const [members, setMembers] = useState(null);
    const [results, setResults] = useState(null);
    const { setMessage, setType } = useContext(AlertContext);
    const { token } = useContext(AuthContext);
    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await fetch(`${API_URL}/submission/admin/results/quiz`, {
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
                console.log(data);
                //setMembers(data.results);
                setResults(data.results);

            } catch (err) {
                console.error("Failed to fetch results:", err);
            }
        };
        fetchResults();
    }, [assessmentId, token]);

    const handlePublish = async () => {
        try {
            const res = await fetch(`${API_URL}/assessment/admin/publishresults`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ assessmentId })
            })
            const data = await res.json();
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            setMessage(data.message)
            setType(data.type)

        } catch (err) {
            console.log(err)
            setMessage('Internal server error');
            setType('error');
        }
    }

    return (
        <div className="flex flex-col mt-2">
            <div className="flex mb-2 justify-between">
                <PageTitle text={'Quiz results'} />
                <Button
                    onClickAction={handlePublish}
                    buttonLabel={'Publish the result'}
                />
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


        </div>
    );
}