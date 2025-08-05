import { useContext, useEffect, useState } from "react";
import PopUp from "../PopUp";
import PageTitle from "../PageTitle";
import Button from "../Button";
import { UIContext } from "../../Contexts/UIContext/UIContext";
import NullComponent from "../NullComponent";
import { AlertContext } from "../../Contexts/AlertContext/AlertContext";



export default function Annoucements({ roomId }) {
    const [announcements, setAnnoucements] = useState([]);
    const [announcement, setAnnoucement] = useState(false);
    const { popUp,setPopUp } = useContext(UIContext);
    const {setMessage, setType} = useContext(AlertContext);
    const [form, setForm] = useState({
        title: '',
        description: ''
    });

    useEffect(() => {
        fetch('http://localhost:3000/fetchannouncements', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomId })
        })
            .then((res) => res.json())
            .then((data) => { console.log(data); setAnnoucements(data) })
            .catch((err) => console.log(err))
    }, [roomId])

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const createAnnouncement = async (e) => {
        e.preventDefault();
        console.log(form);
        try {
            const res = await fetch('http://localhost:3000/createannoucemnet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ roomId, form })
            })

            const data = await res.json();
            if (res.ok) {
                setAnnoucements(prev => [...prev, data.newAnnoucement])
                setMessage(data.message)
                setPopUp(false);
                setAnnoucement(false);
            }
        } catch (err) {
            console.log(err);
            setMessage('Internal server error');
            setType('error');
        }
    }

    return (

        <>
            <div className={`flex flex-col ${ popUp && 'transition duration-500 blur pointer-events-none'}`}>
                <div className="flex mt-2 justify-between">
                    <PageTitle
                        text={'Announcements'}
                    />
                    <Button
                        onClickAction={() => { setAnnoucement(true) }}
                        buttonLabel={'Create a New Announcement'}
                    />
                </div>
                <div className=" min-w-full pt-4  flex flex-col gap-2  rounded-2xl transition duration-1000">
                    {
                        announcements.length === 0 ?
                            <NullComponent
                                text={'No announcments found!'}
                            />
                            : announcements.map((item, i) => (
                                <div className="shadow-md border-fuchsia-200 flex-col rounded-2xl transition duration-500 flex w-full 
                                hover:bg-slate-300 "
                                    key={i}>

                                    <div className="flex">
                                        <div className="px-4 py-2 text-2xl self-center">{item.title}</div>
                                        <div className="px-4 py-2 flex-1 self-end text-sm">{item.createdAt}</div>
                                    </div>
                                    <div className="pl-8 py-2 flex-1 overflow-hidden">{item.description}</div>

                                </div>
                            ))}

                </div>
            </div>
            {announcement &&
                <PopUp
                    form={form}
                    name={announcement}
                    setName={setAnnoucement}
                    onChange={handleChange}
                    onSubmit={createAnnouncement}
                    extraFields={null}
                    title={'Create a new Annoucement'}
                    buttonTitle={'Create Annoucement'}
                />
            }
        </>
    )
}