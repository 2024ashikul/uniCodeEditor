import { useContext, useState } from "react";
import { UIContext } from "../../../Contexts/UIContext/UIContext";
import PopUp from "../../SharedComponents/PopUp";
import Button from "../../SharedComponents/Button";
import PopUpLayout from "../../SharedComponents/PopUpLayout";
import { AlertContext } from "../../../Contexts/AlertContext/AlertContext";
import { API_URL } from "../../../config";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";




export default function UpdateAssignmentInfo({ assignmentId, title, description }) {
    const [Assignment, setAssignment] = useState(false);
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
            const res = await fetch(`${API_URL}/Assignment/create`, {
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
                    <p>Change Assignment Info</p>
                    <button
                        onClick={() => setAssignment(true)}
                        className="px-4 py-2 w-50 text-white bg-green-500 rounded-xl shadow-md hover:bg-green-600 hover:scale-[1.05] transition"
                    >
                    Update 
                        </button>
                </div>

            </PopUpLayout>
            {Assignment &&
                <PopUp
                    name={Assignment}
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