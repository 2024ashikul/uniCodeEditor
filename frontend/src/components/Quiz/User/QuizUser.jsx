import { Navigate, Route, Router, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FileQuestionMark, Send, Dot, Book } from "lucide-react";
import Problems from "./Problems";
import TopBar from "../../SharedComponents/TopBar";
import NullComponent from "../../SharedComponents/NullComponent";
import Results from "./Results";



export default function QuizUser({ assessmentId, phase , durationLeft }) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('problems');


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
                    phase == "Scheduled" || phase == "Not Scheduled" ? (
                        <NullComponent
                            text={'You can see the problems once the Quiz starts'}
                        />)
                        :
                        <Routes>
                            <Route path="problems" element={<Problems assessmentId={assessmentId} phase={phase} duration={Math.round(durationLeft / 1000)} />} />
                            <Route path="results" element={<Results assessmentId={assessmentId} />} />
                            <Route path="*" element={<Navigate to="problems" replace />} />
                        </Routes>
                }

            </div>
        </>
    )
}