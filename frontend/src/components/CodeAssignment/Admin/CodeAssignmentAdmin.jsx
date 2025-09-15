import {  useEffect, useState } from "react"
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";

import { FileQuestionMark, Send, Settings, MedalIcon } from "lucide-react";
import TopBar from "../../SharedComponents/TopBar";
import Problems from "./Problems";
import { UIContext } from "../../../Contexts/UIContext/UIContext";
import Results from "./Results";
import Submissions from "./Submissions";
import Settingss from "./Settings";
import TopBanner from "../../SharedComponents/TopBanner";


export default function CodeAssignmentAdmin({ roomId }) {
    const [activeTab, setActiveTab] = useState('problem');
    const navigate = useNavigate();
    const { assessmentId } = useParams();
    
    // useEffect(() => {
    //     const fetchAssessment = async () => {
    //         const res = await fetch(`${API_URL}/assessment/fetchone`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${token}`
    //             },
    //             body: JSON.stringify({ assessmentId })
    //         })

    //         if (!res.ok) {
    //             throw new Error(`HTTP error! status: ${res.status}`);
    //         }

    //         const data = await res.json();
    //         setTitle('Assessment : ' + data.title);
    //     }
        
    //     if (roomId) {
    //         fetchAssessment();
    //     }

    // }, [assessmentId, token, roomId, setTitle])

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