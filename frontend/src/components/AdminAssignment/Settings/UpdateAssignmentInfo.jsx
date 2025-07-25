import { useContext, useState } from "react";
import { UIContext } from "../../../Contexts/UIContext/UIContext";
import PopUp from "../../PopUp";
import Button from "../../Button";
import PopUpLayout from "../../PopUpLayout";
import { AlertContext } from "../../../Contexts/AlertContext/AlertContext";




export default function UpdateAssignmentInfo({ assignmentId, title, description }) {
    const [assignment, setAssignment] = useState(false);
    const { setMessage, setType } = useContext(AlertContext);
    const { setPopUp,setTitle} = useContext(UIContext);
    const [form, setForm] = useState({
        title: title,
        description: description
    });
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    

    const updateAssignment = async (e) => {
        e.preventDefault();
        console.log(form);
        try {
            const res = await fetch('http://localhost:3000/updateassignment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ assignmentId, form })
            })

            const data = await res.json();
            if (res.ok) {
                setAssignment(false);
                setPopUp(false);
                setMessage(data.message);
                setTitle(data.updatedAssignment.title);
                setType('success');
            } else {
                setMessage(data.message);
                setType('error')
            }
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