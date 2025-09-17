import { Users, Notebook, Megaphone, Book } from 'lucide-react';
import { useEffect, useMemo, useState } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";

import TopBanner from "../src/components/SharedComponents/TopBanner";
import TopBar from "../src/components/SharedComponents/TopBar";
import Assignements from "../src/components/Room/Assessments";
import Members from "../src/components/Room/Members";
import Announcements from "../src/components/Room/Announcements";
import Lessons from "../src/components/Room/Lessons";
import Materials from '../src/components/Room/Materials';



export default function UserRoom() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('announcements');
    const { roomId } = useParams();
    console.log(roomId);


    const tabs = useMemo(() => [
        { title: 'Annoucements', keyword: 'announcements', icon: Megaphone },
        { title: 'Assessments', keyword: 'Assessments', icon: Notebook },
        
        { title: 'Materials', keyword: 'materials', icon: Users },
        { title: 'Lessons', keyword: 'lessons', icon: Book },
        { title: 'Members', keyword: 'members', icon: Users },
    ], []);

    useEffect(() => {
        const lastSegment = window.location.pathname.split("/").pop();
        if (!lastSegment || lastSegment === roomId) {
            setActiveTab("announcements");
            navigate(`/room/${roomId}/announcements`, { replace: true });
        } else {
            setActiveTab(lastSegment);
        }
    }, [roomId, navigate]);



    console.log(activeTab);
    return (
        <>
            <div>
                <TopBanner
                />
            </div>
            <TopBar
                tabs={tabs}
                // activeTab={activeTab}
                // setActiveTab={setActiveTab}
                activeTab={window.location.pathname.split("/").pop()}
                setActiveTab={(tab) => navigate(`/room/${roomId}/${tab}`)}
            />
            <div className="flex flex-col p-8 ">

                <div>
                    <Routes>

                        <Route path="announcements" element={<Announcements roomId={roomId} />} />
                        <Route path="assessments" element={<Assignements roomId={roomId} />} />
                       
                        <Route path="lessons" element={<Lessons roomId={roomId} />} />
                        <Route path="materials" element={<Materials roomId={roomId} />} />
                         <Route path="members" element={<Members roomId={roomId} />} />
                        <Route path="*" element={<Announcements roomId={roomId} />} />
                    </Routes>
                </div >
            </div >
        </>

    )
}