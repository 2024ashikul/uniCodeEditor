import { Navigate, Route, Router, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FileQuestionMark, Send, Dot, Book } from "lucide-react";
import Problems from "./Problems";
import Submissions from "./Submissions";
import TopBar from "../../SharedComponents/TopBar";
import NullComponent from "../../SharedComponents/NullComponent";
import Results from "./Results";



export default function ProjectAssessment({ assessmentId, scheduleTime }) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('problems');

    const currentTime = new Date().toISOString().slice(0, 16);

    useEffect(() => {
        const lastSegment = window.location.pathname.split("/").pop();
        if (!lastSegment || lastSegment === assessmentId) {
            setActiveTab("announcements");
            navigate(`/assessment/${assessmentId}/problems`, { replace: true });
        } else {
            setActiveTab(lastSegment);
        }
    }, [assessmentId, navigate]);

    const tabs = [
        { title: 'Problems', keyword: 'problems', icon: FileQuestionMark },
        { title: 'My Submissions', keyword: 'submissions', icon: Send },
        { title: 'Results', keyword: 'results', icon: Book }
    ]

    return (
        <>
            <TopBar
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={(tab) => navigate(`/assessment/${assessmentId}/${tab}`)}
            />

            <div className="flex flex-col p-8 ">
                {
                    currentTime < scheduleTime ? (
                        <NullComponent
                            text={'You can see the Contents once the Test/Assignments Commences'}
                        />)
                        :
                        <Routes>
                            <Route path="problems" element={<Problems assessmentId={assessmentId} />} />
                            <Route path="submissions" element={<Submissions assessmentId={assessmentId} />} />
                            <Route path="results" element={<Results assessmentId={assessmentId} />} />
                            <Route path="*" element={<Navigate to="problems" replace />} />
                        </Routes>
                }

            </div>
        </>
    )
}