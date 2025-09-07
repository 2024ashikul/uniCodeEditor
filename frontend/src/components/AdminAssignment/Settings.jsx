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
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";


export default function Settingss({ assignmentId }) {
    const [assignment, setAssignment] = useState('');
    const { setMessage, setType } = useContext(AlertContext);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const res = await fetch(`${API_URL}/assignment/fetchone`, {
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
                console.log("Failed to fetch assignemnet", err);
            }
        }
        if (assignmentId) {
            fetchAssignment();
        }
    }, [assignmentId, token])

    async function changeResultAcess() {
        try {
            const res = await fetch(`${API_URL}/assignment/admin/changewhocanseeresults`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                 },
                body: JSON.stringify({ assignmentId })
            });


            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();

            setMessage(data.message);
            setType('success');
        }
        catch (err) {
            console.log(err);
            setMessage('Internal server error');
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
                <div className="flex justify-between">
                    <p >Change who can see results</p>
                    {assignment.everyoneseesresults ? 'everyone' : 'only self'}
                    <button className="px-4 py-2 bg-cyan-500" onClick={changeResultAcess}>Change</button>
                </div>
            </div>
        </>
    )
}