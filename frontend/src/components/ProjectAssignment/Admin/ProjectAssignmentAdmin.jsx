import {  useEffect, useState } from "react"
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";

import { FileQuestionMark, Send, Settings, MedalIcon } from "lucide-react";
import TopBar from "../../SharedComponents/TopBar";


import Submissions from "./Submissions";
import Settingss from "./Settings";
import Problems from "./Problems";
import Results from "./Results";


export default function ProjectAssignmentAdmin({ roomId }) {
    const [activeTab, setActiveTab] = useState('problems');
    const navigate = useNavigate();
    const { assessmentId } = useParams();

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
        { title: 'Submissions', keyword: 'submissions', icon: Send },
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
                    <Route path="problems" element={<Problems assessmentId={assessmentId} />} />
                    <Route path="submissions" element={<Submissions assessmentId={assessmentId} />} />
                    <Route path="settings" element={<Settingss assessmentId={assessmentId} />} />
                    <Route path="results" element={<Results assessmentId={assessmentId} roomId={roomId} />} />
                </Routes>
            </div>
        </>
    )
}