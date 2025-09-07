import { Navigate, Route, Router, Routes, useNavigate, useParams } from "react-router-dom";

import { useContext, useEffect, useState } from "react";
import { UIContext } from "../src/Contexts/UIContext/UIContext";
import { FileQuestionMark, Send, Dot, Book } from "lucide-react";
import TopBanner from "../src/components/SharedComponents/TopBanner";
import TopBar from "../src/components/SharedComponents/TopBar";

import Submissions from "../src/components/Assignment/Submissions";
import Problems from "../src/components/Assignment/Problems";

import NullComponent from "../src/components/SharedComponents/NullComponent";
import { API_URL } from "../src/config";
import Results from "../src/components/Assignment/Results";
import { AuthContext } from "../src/Contexts/AuthContext/AuthContext";


export default function UserAssignment() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('problems');
    const { popUp } = useContext(UIContext);
    const { setTitle, setScrollHeight } = useContext(UIContext);
    const { token } = useContext(AuthContext);
    const { assignmentId } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [timleft, setTimeleft] = useState(null);
    const currentTime = new Date().toISOString().slice(0, 16);

    useEffect(() => {
        const lastSegment = window.location.pathname.split("/").pop();
        if (!lastSegment || lastSegment === assignmentId) {
            setActiveTab("announcements");
            navigate(`/assignment/${assignmentId}/problems`, { replace: true });
        } else {
            setActiveTab(lastSegment);
        }
    }, [assignmentId, navigate]);


    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const res = await fetch(`${API_URL}/assignment/fetchone/user`, {
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
                setAssignment(data);
            } catch (err) {
                console.log("Failed to fetch lesson", err);
            }
        }

        if (assignmentId) {
            fetchAssignment();
        }
    }, [assignmentId, token])


    useEffect(() => {
        setTitle('Assignment');
        setScrollHeight(100);
    }, [setTitle, setScrollHeight, assignment])


    useEffect(() => {
        if (assignment?.scheduleTime) {
            const temp = assignment.scheduleTime.toString();
            CalculateTimeLeft(currentTime, temp).then((result) => {
                setTimeleft(result);
            });
        }
    }, [assignment, currentTime, setTimeleft]);


    async function CalculateTimeLeft(current, scheduled) {
        if (!scheduled || !current) return "";

        const years = parseInt(scheduled.slice(0, 4)) - parseInt(current.slice(0, 4));
        let months = parseInt(scheduled.slice(5, 7)) - parseInt(current.slice(5, 7));
        let days = parseInt(scheduled.slice(8, 10)) - parseInt(current.slice(8, 10));
        let hrs = parseInt(scheduled.slice(11, 13)) - parseInt(current.slice(11, 13));
        let mins = parseInt(scheduled.slice(14, 16)) - parseInt(current.slice(14, 16));

        if (days < 0) { days += 30; months--; }
        if (hrs < 0) { hrs += 24; days--; }
        if (mins < 0) { mins += 60; hrs--; }
        let ans = "";
        if (years !== 0) ans += `${years} yrs `;
        if (months !== 0) ans += `${months} mths `;
        if (days !== 0) ans += `${days} days `;
        if (hrs !== 0) ans += `${hrs} hrs `;
        if (mins !== 0) ans += `${mins} mins `;

        return ans;
    }


    const temp = assignment?.scheduleTime?.toString();
    console.log(CalculateTimeLeft(currentTime, temp));

    const extraInfo = (
        <div className="flex justify-center gap-2">
            <div>{assignment?.status.toUpperCase()} </div>  <Dot />
            <div>{timleft} left </div> <Dot />
            <div className="flex"> Duration : {assignment?.duration} mins</div>
        </div>
    );

    const tabs = [
        { title: 'Problems', keyword: 'problems', icon: FileQuestionMark },
        { title: 'My Submissions', keyword: 'submissions', icon: Send },
        { title: 'Results', keyword: 'results', icon: Book }
    ]


    return (
        <>

            <div className={`${popUp && 'transition duration-500 blur pointer-events-none'}} `}>
                <TopBanner
                    extraInfo={extraInfo}
                />

            </div>
            <TopBar
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={(tab) => navigate(`/assignment/${assignmentId}/${tab}`)}
            />


            <div className="flex flex-col p-8 ">
                {currentTime < assignment?.scheduleTime ? (
                    <NullComponent
                        text={'You can see the problems once the Time starts'}
                    />)
                    : <>
                        <Routes>
                            <Route path="problems" element={<Problems assignmentId={assignmentId} />} />
                            <Route path="submissions" element={<Submissions assignmentId={assignmentId} />} />
                            <Route path="results" element={<Results assignmentId={assignmentId} isPublished={assignment?.resultpublished} />} />
                            <Route path="*" element={<Navigate to="problems" replace />} />
                        </Routes>
                    </>
                }


            </div>
        </>
    )
}