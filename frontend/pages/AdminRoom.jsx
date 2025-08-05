
import { useContext } from "react"
import { useParams } from "react-router-dom";
import { useState } from "react";

import { AuthContext } from "../src/Contexts/AuthContext/AuthContext";
import PopUp from "../src/components/PopUp";
import TopBar from "../src/components/TopBar";
import { Users, Notebook, Megaphone, Book } from 'lucide-react';
import Annoucements from "../src/components/AdminRoom/Announcements";
import Submissions from "../src/components/AdminAssignment/Submissions";
import Assignements from "../src/components/AdminRoom/Assignments";
import Members from "../src/components/AdminRoom/Members";
import { UIContext } from "../src/Contexts/UIContext/UIContext";
import TopBanner from "../src/components/TopBanner";
import Lessons from "../src/components/AdminRoom/Lessons";



export default function AdminRoom() {

    const { roomId } = useParams();

    const { popUp } = useContext(UIContext);
    const [activeTab, setActiveTab] = useState('announcements');


    const tabs = [
        { title: 'Annoucements', keyword: 'announcements', icon: Megaphone },
        { title: 'Lessons', keyword: 'lessons', icon: Book },
        { title: 'Assignments', keyword: 'assignments', icon: Notebook },
        { title: 'Members', keyword: 'members', icon: Users },

    ]

    return (
        <>
            <div className={`${popUp && 'transition duration-500 blur pointer-events-none'}`}>
                <TopBanner
                />
            </div>
            <TopBar
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            <div className="flex flex-col p-8 ">

                <div>
                    {activeTab === 'announcements' ? (
                        <Annoucements
                            roomId={roomId}
                        />
                    ) : activeTab === 'assignments' ? (
                        <Assignements
                            roomId={roomId}
                        />
                    ) : activeTab === 'members' ? (
                        <Members
                            roomId={roomId}
                        />
                    ) : activeTab === 'lessons' ? (
                        <Lessons
                            roomId={roomId}
                        />
                    ) :
                        <> hi</>
                    }
                </div >
            </div >
        </>
    )
}