import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom";
import PopUp from "../src/components/PopUp";

import { FileQuestionMark, Send, Settings, MedalIcon } from "lucide-react";

import TopBar from "../src/components/TopBar";
import Button from "../src/components/Button";
import PageTitle from "../src/components/PageTitle";
import Problems from "../src/components/AdminAssignment/Problems";
import Submissions from "../src/components/AdminAssignment/Submissions";
import Settingss from "../src/components/AdminAssignment/Settings";
import { UIContext } from "../src/Contexts/UIContext/UIContext";
import TopBanner from "../src/components/TopBanner";
import Results from "../src/components/AdminAssignment/Results";


export default function AdminAssignment({ roomId }) {
    const { popUp } = useContext(UIContext);
    const [activeTab, setActiveTab] = useState('problem');
    const { assignmentId } = useParams();
    const { setTitle, setScrollHeight } = useContext(UIContext);
    useEffect(() => {


        fetch('http://localhost:3000/fetchassignment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ assignmentId })
        })
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    console.log(data)
                    setTitle(data.title);
                    setScrollHeight(20);
                }})

            .catch((err) => {
                console.log(err);
                setTitle('Assignment');
                setScrollHeight(20);
            })

    }, [setTitle, setScrollHeight, assignmentId])

    const tabs = [
        { title: 'Problems', keyword: 'problem', icon: FileQuestionMark },
        { title: 'Submissions', keyword: 'submissions', icon: Send },
        { title: 'Settings', keyword: 'settings', icon: Settings },
        { title: 'Results', keyword: 'results', icon: MedalIcon }
    ]

    return (
        <>
            <div className={`${popUp && 'transition duration-500 blur pointer-events-none'}} `}>
                <TopBanner />

            </div>
            <TopBar
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            <div className="flex flex-col p-8 ">

                {activeTab === 'problem' ? (
                    <Problems
                        assignmentId={assignmentId}
                    />

                ) : activeTab === 'submissions' ? (
                    <Submissions
                        assignmentId={assignmentId}
                    />
                ) : activeTab === 'settings' ? (
                    <>
                        <Settingss
                            assignmentId={assignmentId}
                        />
                    </>
                ) : activeTab === 'results' ? (
                    <>
                        <Results
                            assignmentId={assignmentId}
                            roomId={roomId}
                        />
                    </>
                ) : (
                    <>
                    </>
                )
                }
            </div>
        </>
    )
}