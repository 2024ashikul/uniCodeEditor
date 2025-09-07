
import { useContext, useEffect,useState } from "react"
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import TopBar from "../src/components/SharedComponents/TopBar";
import { Users, Notebook, Megaphone, Book } from 'lucide-react';
import Annoucements from "../src/components/AdminRoom/Announcements";
import Assignements from "../src/components/AdminRoom/Assignments";
import Members from "../src/components/AdminRoom/Members";
import { UIContext } from "../src/Contexts/UIContext/UIContext";
import TopBanner from "../src/components/SharedComponents/TopBanner";
import Lessons from "../src/components/AdminRoom/Lessons";



export default function AdminRoom() {

    const { roomId } = useParams();
    const navigate = useNavigate();
    const { popUp } = useContext(UIContext);
    const [activeTab, setActiveTab] = useState('announcements');


    const tabs = [
        { title: 'Annoucements', keyword: 'announcements', icon: Megaphone },
        { title: 'Lessons', keyword: 'lessons', icon: Book },
        { title: 'Assignments', keyword: 'assignments', icon: Notebook },
        { title: 'Members', keyword: 'members', icon: Users },
    ]


    useEffect(() => {
        const lastSegment = window.location.pathname.split("/").pop();
        if (!lastSegment || lastSegment === roomId) {
            setActiveTab("problems");
            navigate(`/room/${roomId}/announcements`, { replace: true });
        } else {
            setActiveTab(lastSegment);
        }
    }, [roomId, navigate]);

    return (
        <>
            <div className={`${popUp && 'transition duration-500 blur pointer-events-none'}`}>
                <TopBanner
                />
            </div>
            <TopBar
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={(tab) => navigate(`/room/${roomId}/${tab}`)}
            />
            <div className="flex flex-col p-8 ">

                <div>
                    <Routes>

                        <Route path="announcements" element={<Annoucements roomId={roomId} />} />
                        <Route path="members" element={<Members roomId={roomId} />} />
                        <Route path="assignments" element={<Assignements roomId={roomId} />} />
                        <Route path="lessons" element={<Lessons roomId={roomId} />} />
                        <Route path="*" element={<Annoucements roomId={roomId} />} />
                    </Routes>
                </div >
            </div >
        </>
    )
}