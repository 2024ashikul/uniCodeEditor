import { useContext, useEffect, useState } from "react";
import { AlertContext } from "../../../Contexts/AlertContext/AlertContext";
import { UIContext } from "../../../Contexts/UIContext/UIContext";
import Button from "../../SharedComponents/Button";
import PopUp from "../../SharedComponents/PopUp";
import PopUpLayout from "../../SharedComponents/PopUpLayout";
import PopUpLayoutTemp from "../../SharedComponents/PopUpLayoutTemp";
import { API_URL } from "../../../config";




export default function Schedule({ assignmentId }) {
    const { setMessage, setType } = useContext(AlertContext);

    const [assigned, setAssigned] = useState(null);
    const [duration, setDuration] = useState('');
    const [dateTime, setDateTime] = useState('');

    const [dateTimeEdit, setDateTimeEdit] = useState(false);
    const [form, setForm] = useState({
        datetime: '',
        duration: '',
        assigned: null
    });
    const { setPopUp } = useContext(UIContext);


    useEffect(() => {
        const currentTime = new Date().toISOString();
        console.log(currentTime);
        console.log(dateTime);
        if (dateTime < currentTime) {
            setMessage("Scheduled time can not be in past");
            setType('warning');
        }
    }, [dateTime, setMessage, setType])
    async function applyScehdule(e) {
        e.preventDefault();
        console.log(form);
        await fetch(`${API_URL}/scheduleassignments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ assignmentId, form })
        })
            .then((res) => res.json())
            .then((data) => {
                setAssigned(data.status);
                setDateTimeEdit(false);
                setPopUp(false);
                console.log(data)
                setMessage('Changed time succesfully');
            })
            .catch((err) => console.log(err))
    }




    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
    const PopUpCode = (<form method="POST" onSubmit={applyScehdule} onChange={handleChange}>
        <div className="flex flex-col justify-center  px-30 gap-4 pt-10">
            <div className="flex justify-between items-center">
                <div>Set Time</div>
                <div className="w-60 px-1 ">
                    <input name="datetime" value={dateTime}
                        className="focus:text-white-200 rounded-2xl px-4 py-1"
                        onChange={(e) => { setDateTime(e.target.value) }}
                        required
                        placeholder="YYYY-MM-DDTHH:MM"
                        type="datetime-local"></input>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <div>Set Duration</div>
                <div className="w-60 px-1">
                    <input
                        className="px-4 border border-white rounded-2xl py-1"
                        name="duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                        placeholder="Duration "
                        type="text"></input>
                </div>
            </div>
            <div className="flex justify-center gap-4">
                <div className="flex gap-2 items-center">
                    <input name="assigned" value={'true'} type="radio" id="true"></input>
                    <label htmlFor="true">Assign</label>
                </div>
                <div className="flex gap-2 items-center">
                    <input name="assigned" value={'false'} type="radio" id="false"></input>
                    <label htmlFor="false">Not Assign</label>
                </div>
            </div>
            <div className="flex justify-center">

                <button type="submit">Submit</button>
            </div>
        </div>
    </form>
    );



    return (
        <>
            <PopUpLayout>

                <div className="flex flex-col gap-2 pt-4">
                    <div className="flex  justify-between">
                        <div>Status</div>
                        <div>{assigned}</div>
                        <div>
                            <Button
                                onClickAction={() => setDateTimeEdit(true)}
                                buttonLabel={'Change the time'}
                            />
                        </div>
                    </div>
                </div>
            </PopUpLayout>

            {dateTimeEdit &&
                <PopUp
                    name={dateTimeEdit}
                    setName={setDateTimeEdit}
                    onSubmit={applyScehdule}
                    onChange={handleChange}
                    extraFields={null}
                    title={'Edit Schedule'}
                    buttonTitle={'Change Schedule'}
                    ManualCode={PopUpCode}
                    ManualEdit={true}
                />
            }

        </>
    )
}