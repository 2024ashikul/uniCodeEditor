import { useContext, useEffect, useState } from "react"
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import PopUp from "../src/components/SharedComponents/PopUp";

import { FileQuestionMark, Send, Settings, MedalIcon } from "lucide-react";

import TopBar from "../src/components/SharedComponents/TopBar";
import Button from "../src/components/SharedComponents/Button";
import PageTitle from "../src/components/SharedComponents/PageTitle";
import Problems from "../src/components/AdminAssignment/Problems";
import Submissions from "../src/components/AdminAssignment/Submissions";
import Settingss from "../src/components/AdminAssignment/Settings";
import { UIContext } from "../src/Contexts/UIContext/UIContext";
import TopBanner from "../src/components/SharedComponents/TopBanner";
import Results from "../src/components/AdminAssignment/Results";
import { API_URL } from "../src/config";
import { AuthContext } from "../src/Contexts/AuthContext/AuthContext";


export default function AdminAssignment({ roomId }) {
    const { popUp } = useContext(UIContext);
    const [activeTab, setActiveTab] = useState('problem');
    const navigate = useNavigate();
    const { assignmentId } = useParams();
    const { token } = useContext(AuthContext);
    const { setTitle } = useContext(UIContext);
    useEffect(() => {
        const fetchAssignment = async () => {
            const res = await fetch(`${API_URL}/Assignment/fetchone`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ assignmentId })
            })

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            setTitle('Assignment : ' + data.title);
        }
        
        if (roomId) {
            fetchAssignment();
        }

    }, [assignmentId, token, roomId, setTitle])

    useEffect(() => {
        const lastSegment = window.location.pathname.split("/").pop();
        if (!lastSegment || lastSegment === assignmentId) {
            setActiveTab("problems");
            navigate(`/Assignment/${assignmentId}/problems`, { replace: true });
        } else {
            setActiveTab(lastSegment);
        }
    }, [assignmentId, navigate]);

    const tabs = [
        { title: 'Problems', keyword: 'problems', icon: FileQuestionMark },
        { title: 'Submissions', keyword: 'submissions', icon: Send },
        { title: 'Results', keyword: 'results', icon: MedalIcon },
        { title: 'Settings', keyword: 'settings', icon: Settings },
        
    ]

    return (
        <>
            <div className={`${popUp && 'transition duration-500 blur pointer-events-none'}} `}>
                <TopBanner />

            </div>
            <TopBar
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={(tab) => navigate(`/Assignment/${assignmentId}/${tab}`)}
            />

            <div className="flex flex-col p-8 ">

                <Routes>
                    <Route path="problems" element={<Problems assignmentId={assignmentId} />} />
                    <Route path="submissions" element={<Submissions assignmentId={assignmentId} />} />
                    <Route path="settings" element={<Settingss assignmentId={assignmentId} />} />
                    <Route path="results" element={<Results assignmentId={assignmentId} roomId={roomId} />} />

                </Routes>

            </div>
        </>
    )
}