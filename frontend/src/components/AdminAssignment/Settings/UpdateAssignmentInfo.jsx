import { useContext, useState } from "react";
import { UIContext } from "../../../Contexts/UIContext/UIContext";
import PopUp from "../../SharedComponents/PopUp";
import Button from "../../SharedComponents/Button";
import PopUpLayout from "../../SharedComponents/PopUpLayout";
import { AlertContext } from "../../../Contexts/AlertContext/AlertContext";
import { API_URL } from "../../../config";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";




export default function UpdateAssignmentInfo({ assignmentId, title, description }) {
    const [assignment, setAssignment] = useState(false);
    const { setMessage, setType } = useContext(AlertContext);
    const { setPopUp, setTitle } = useContext(UIContext);
    const {token} =useContext(AuthContext);
    const [form, setForm] = useState({
        title: title,
        description: description
    });
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });



    const updateAssignment = async (e) => {
        e.preventDefault();
        console.log(form);
        try {
            const res = await fetch(`${API_URL}/assignment/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ assignmentId, form })
            })
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            setAssignment(false);
            setPopUp(false);
            setMessage(data.message);
            setTitle(data.updatedAssignment.title);
            setType('success');
        } catch (err) {
            console.log(err);
            setMessage('Internal server error');
            setType('error')
        }
    }

    return (
        <>
            <PopUpLayout>
                <div className="flex items-center justify-between">
                    <p>Change assingment name and description</p>
                    <Button
                        onClickAction={() => setAssignment(true)}
                        buttonLabel={'Update assignment info'}
                    />
                </div>

            </PopUpLayout>
            {assignment &&
                <PopUp
                    name={assignment}
                    setName={setAssignment}
                    onChange={handleChange}
                    onSubmit={updateAssignment}
                    extraFields={null}
                    title={'Update Asssignment'}
                    buttonTitle={'Update Assignment'}
                    form={form}
                />
            }
        </>
    )
}