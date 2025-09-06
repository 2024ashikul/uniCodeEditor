import { useContext, useEffect, useState } from "react"
import PageTitle from "../SharedComponents/PageTitle";
import { UIContext } from "../../Contexts/UIContext/UIContext";
import PopUp from "../SharedComponents/PopUp";
import Button from "../SharedComponents/Button";
import { AlertContext } from "../../Contexts/AlertContext/AlertContext";
import Schedule from "./Settings/Schedule";
import UpdateAssignmentInfo from "./Settings/UpdateAssignmentInfo";
import PopUpLayout from "../SharedComponents/PopUpLayout";
import { API_URL } from "../../config";


export default function Settingss({ assignmentId }) {
    const [assignment, setAssignment] = useState('');
    const { setMessage, setType } = useContext(AlertContext);
    useEffect(() => {
        fetch(`${API_URL}/fetchassignment`, {
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

    async function changeResultAcess() {
        try {
            const res = await fetch(`${API_URL}/changewhocanseeresults`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assignmentId })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('Result access updated succesfully');
                setType('success');
            }else{
                setMessage('Could not  update result access succesfully');
                setType('error');
            }
            console.log(data);
        } catch (err) {
            console.log(err);
            setMessage('Internal server errro');
            setType('error');
        }
    }


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
                <div  className="flex justify-between">
                    <p >Change who can see results</p>
                    {assignment.everyoneseesresults ? 'everyone' : 'only self'}
                    <button className="px-4 py-2 bg-cyan-500" onClick={changeResultAcess}>Change</button>
                </div>
            </div>
        </>
    )
}