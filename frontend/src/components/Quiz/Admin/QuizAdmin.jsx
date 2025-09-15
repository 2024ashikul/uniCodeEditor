import {  useEffect, useState } from "react"
import { Link, Route, Routes, useNavigate } from "react-router-dom";

import { FileQuestionMark, Send, Settings, MedalIcon } from "lucide-react";
import TopBar from "../../SharedComponents/TopBar";

import Settingss from "./Settings";
import Problems from "./Problems";
import Results from "./Results";


export default function QuizAdmin({ phase,assessmentId }) {
    const [activeTab, setActiveTab] = useState('problems');
    const navigate = useNavigate();
    console.log("here");
    useEffect(() => {
        const lastSegment = window.location.pathname.split("/").pop();
        if (!lastSegment || lastSegment === assessmentId) {
            setActiveTab("problems");
            navigate(`/assessment/${assessmentId}/problems`, { replace: true });
        } else {
            setActiveTab(lastSegment);
        }
    }, [assessmentId, navigate]);

    const tabs = [
        { title: 'Problems', keyword: 'problems', icon: FileQuestionMark },
        { title: 'Results', keyword: 'results', icon: MedalIcon },
        { title: 'Settings', keyword: 'settings', icon: Settings },
        
    ]

    return (
        <>
            <TopBar
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={(tab) => navigate(`/assessment/${assessmentId}/${tab}`)}
            />


            <div className="flex flex-col p-8 ">
                <Routes>
                    <Route path="problems" element={<Problems assessmentId={assessmentId} phase={phase} />} />
                    <Route path="settings" element={<Settingss assessmentId={assessmentId} />} />
                    <Route path="results" element={<Results assessmentId={assessmentId}  />} />
                </Routes>
            </div>
        </>
    )
}