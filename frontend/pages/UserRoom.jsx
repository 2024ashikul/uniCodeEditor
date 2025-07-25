import { useContext, useEffect } from "react"
import { Users, Notebook, Megaphone, Book } from 'lucide-react';
import { useState } from "react";
import { useParams } from "react-router-dom";

import { AuthContext } from "../src/Contexts/AuthContext/AuthContext";
import TopBanner from "../src/components/TopBanner";
import TopBar from "../src/components/TopBar";
import Assignements from "../src/components/Room/Assignments";
import Members from "../src/components/Room/Members";
import Announcements from "../src/components/Room/Announcements";
import Chat from "../src/components/Room/Chat";
import { UIContext } from "../src/Contexts/UIContext/UIContext";
import { AccessContext } from "../src/Contexts/AccessContext/AccessContext";
import Lessons from "../src/components/Room/Lessons";


export default function UserRoom() {

    const { roomId } = useParams();
    const { setTitle, setScrollHeight } = useContext(UIContext);
    
    const [activeTab, setActiveTab] = useState('announcements');


    useEffect(() => { 
        setTitle('This Is room')
        setScrollHeight(80);
    }, [setTitle, setScrollHeight])

    
    const tabs = [
        { title: 'Annoucements', keyword: 'announcements', icon: Megaphone },
        { title: 'Assignments', keyword: 'assignments', icon: Notebook },
        { title: 'Members', keyword: 'members', icon: Users },
        { title: 'Chats', keyword: 'chats', icon: Users },
        {title : 'Lessons', keyword : 'lessons', icon : Book}
    ]


    return (
        <>
            <div>
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
                        <Announcements
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
                    ) :activeTab === 'chats' ? (
                        <Chat />
                    ) : activeTab ==='lessons' ? (
                        <Lessons />
                    ) : <></>
                    }
                </div >
            </div >
        </>

    )
}