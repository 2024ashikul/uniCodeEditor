import { Navigate, Route, Router, Routes } from "react-router-dom";

import { useEffect, useState } from "react";

import { FileQuestionMark, Send, Dot, Book } from "lucide-react";
import TopBanner from "../src/components/SharedComponents/TopBanner";
import CodeAssessment from "../src/components/Assessment/CodeAssignment/CodeAssessmentUser";


export default function UserAssessment({ assessmentType, duration, scheduleTime, status, assessmentId }) {

    const [timeleft, setTimeleft] = useState(null);
    const currentTime = new Date().toISOString().slice(0, 16);

    useEffect(() => {
        if (scheduleTime) {
            const temp = scheduleTime.toString();
            CalculateTimeLeft(currentTime, temp).then((result) => {
                setTimeleft(result);
            });
        }
    }, [currentTime, scheduleTime]);


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


    const temp = scheduleTime?.toString();
    console.log(CalculateTimeLeft(currentTime, temp));

    const extraInfo = (
        <div className="flex justify-center gap-2">
            <div>{status?.toUpperCase()} </div>  <Dot />
            <div>{timeleft} left </div> <Dot />
            <div className="flex"> Duration : {duration} mins</div>
        </div>
    );

    return (
        <>

            <div >
                <TopBanner
                    extraInfo={extraInfo}
                />
            </div>

            {assessmentType === "CodeAssignment" ?
                <CodeAssessment assessmentId={assessmentId}
                    scheduleTime={scheduleTime}
                /> :
                assessmentType === "ProjectAssignment" ?
                    <ProjectAssessment assessmentId={assessmentId}
                    scheduleTime={scheduleTime} /> : 'else'
            }


        </>
    )
}