import { useState, useEffect, useContext } from "react";

import PageTitle from "../../SharedComponents/PageTitle";
import Button from "../../SharedComponents/Button";
import { AlertContext } from "../../../Contexts/AlertContext/AlertContext";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";
import LoadingParent from "../../SharedComponents/LoadingParent";
import { API_URL } from "../../../config";



export default function Results({ assessmentId }) {
    const [members, setMembers] = useState(null);
    const { setMessage, setType } = useContext(AlertContext);
    const {token} = useContext(AuthContext);
    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await fetch(`${API_URL}/submission/admin/results`, {
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
                setMembers(data.result);

            } catch (err) {
                console.error("Failed to fetch results:", err);
            }
        };
        fetchResults();
    }, [assessmentId,token]);

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
            <div className="flex justify-between">
                <PageTitle text={'Assingments results'} />
                <Button
                    onClickAction={handlePublish}
                    buttonLabel={'Publish the result'}
                />
            </div>
            <div className="w-full pt-4 flex flex-col gap-4 rounded-2xl">
                {
                members === null ? <LoadingParent /> :
                members.length === 0 ? (
                    <p className="text-gray-500 text-center">No results to display. Check back later.</p>
                ) : (
                    members.map((item, index) => (
                        <div key={item.member.id} className="bg-white rounded-lg shadow-md p-4 transition-transform duration-300 hover:scale-[1.01] hover:shadow-lg">
                            {/* Member Info Section */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-2 mb-2">
                                <div className="flex-1 flex items-center gap-4 mb-2 md:mb-0">
                                    <p className="text-xl font-bold text-gray-800">{index + 1}.</p>
                                    <div>
                                        <p className="text-lg font-semibold text-gray-700">{item.member.name}</p>
                                        <p className="text-sm text-gray-500">{item.member.email}</p>
                                    </div>
                                </div>
                                {/* Total Score Calculation */}
                                <div className="text-lg font-bold text-gray-900">
                                    Total Score: {item.submission.flat().reduce((sum, sub) => sum + (sub.AIscore || 0), 0)}
                                </div>
                            </div>

                            {/* Submissions Section */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                                {item.submission.map((group, problemIndex) => (
                                    <div key={problemIndex} className="p-3 bg-gray-100 rounded-lg">
                                        <h4 className="font-medium text-gray-800 mb-2">Problem {problemIndex + 1}</h4>
                                        {group.length > 0 ? (
                                            <div className="flex flex-col gap-2">
                                                {group.map((submission, subIndex) => (
                                                    <div key={subIndex} className="text-sm border-b last:border-b-0 pb-2">
                                                        <div className="flex justify-between items-center">
                                                            <p className="font-semibold text-gray-600">Submission {subIndex + 1}</p>
                                                            <p className="font-bold text-blue-600">{submission.AIscore || 0}</p>
                                                        </div>
                                                        <a
                                                            href={`${API_URL}/files/${submission?.file}.txt`}
                                                            className="text-blue-500 hover:text-blue-700 underline text-xs"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            View Code
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-500 italic">Not Submitted</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}