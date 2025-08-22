import { useParams } from "react-router-dom";
import CodeEditor from "../src/components/CodeEditor";
import EditorPage from "./EditorPage";
import { useContext, useEffect, useState } from "react";
import { UIContext } from "../src/Contexts/UIContext/UIContext";
import { FileQuestionMark, Send, Dot } from "lucide-react";
import TopBanner from "../src/components/SharedComponents/TopBanner";
import TopBar from "../src/components/SharedComponents/TopBar";

import Submissions from "../src/components/Assignment/Submissions";
import Problems from "../src/components/Assignment/Problems";
import { AuthContext } from "../src/Contexts/AuthContext/AuthContext";
import { AccessContext } from "../src/Contexts/AccessContext/AccessContext";
import NullComponent from "../src/components/SharedComponents/NullComponent";


export default function UserAssignment() {
    const [activeTab, setActiveTab] = useState('problem');
    const { popUp } = useContext(UIContext);
    const { setTitle, setScrollHeight } = useContext(UIContext);
   // const [authorized, setAuthorized] = useState(false);
  //  const {  userId } = useContext(AuthContext);
    const { assignmentId } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [timleft, setTimeleft] = useState(null);
    const currentTime = new Date().toISOString().slice(0, 16);
    



    useEffect(() => {
        fetch('http://localhost:3000/fetchassignment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ assignmentId })
        })
            .then((res) => res.json())
            .then((data) => { setAssignment(data); console.log(data) })
            .catch((err) => console.log(err))
    }, [assignmentId])

    



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
        { title: 'Problems', keyword: 'problem', icon: FileQuestionMark },
        { title: 'My Submissions', keyword: 'submissions', icon: Send }
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
                setActiveTab={setActiveTab}
            />


            <div className="flex flex-col p-8 ">

                {activeTab === 'problem' ? (

                    currentTime < assignment?.scheduleTime ? (
                        <NullComponent
                            text={'You can see the problems once the Time starts'}
                        />
                            
            
                    ) : (
                        <Problems
                            assignmentId={assignmentId}
                        />
                    )


                ) : activeTab === 'submissions' ? (
                    <Submissions
                        assignmentId={assignmentId}
                    />
                ) : (<>
                    hi
                </>)
                }
            </div>
        </>
    )
}