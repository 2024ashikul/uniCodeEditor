import { useState, useEffect, useContext } from "react";
import PageTitle from "../../SharedComponents/PageTitle";
import Button from "../../SharedComponents/Button";
import { AlertContext } from "../../../Contexts/AlertContext/AlertContext";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";
import { API_URL } from "../../../config";
import { APIRequest } from "../../../APIRequest";


export default function Results({ assessmentId }) {
    // const [members, setMembers] = useState(null);
    const [results, setResults] = useState(null);
    const { setMessage, setType } = useContext(AlertContext);
    const { token } = useContext(AuthContext);
    const { request } = APIRequest();
    useEffect(() => {
        const fetchResults = async () => {
            try {
                const data = await request("/submission/admin/results/quiz", { body: { assessmentId } });
                setResults(data.results);
            } catch (err) {
                console.error("Failed to fetch results:", err);
            }
        };
        fetchResults();
    }, [assessmentId, token]);

    const handlePublish = async () => {
        try {
            await request("/assessment/admin/publishresults", { body: { assessmentId } });
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