import {  useEffect, useState } from "react"
import PageTitle from "../SharedComponents/PageTitle";
import { UIContext } from "../../Contexts/UIContext/UIContext";
import PopUp from "../SharedComponents/PopUp";
import Button from "../SharedComponents/Button";
import { AlertContext } from "../../Contexts/AlertContext/AlertContext";
import Schedule from "./Settings/Schedule";
import UpdateAssignmentInfo from "./Settings/UpdateAssignmentInfo";
import PopUpLayout from "../SharedComponents/PopUpLayout";


export default function Settingss({ assignmentId }) {
    const [assignment, setAssignment] = useState(false);
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


    
    return (
        <>

            <div className={`flex flex-col `}>
                <PopUpLayout>
                    <PageTitle
                        text={'Settings'}
                    />
                </PopUpLayout>


            </div>
            <div className="flex flex-col">

                <Schedule
                    assignmentId={assignmentId}
                />
                <UpdateAssignmentInfo
                    title={assignment.title}
                    description={assignment.description}
                    assignmentId={assignmentId}
                />
            </div>
        </>
    )
}