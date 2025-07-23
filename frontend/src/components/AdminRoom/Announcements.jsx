import { useContext, useEffect, useState } from "react";
import PopUp from "../PopUp";
import PageTitle from "../PageTitle";
import Button from "../Button";
import { UIContext } from "../../Contexts/UIContext/UIContext";



export default function Annoucements({ roomId }) {
    const [announcements, setAnnoucements] = useState([]);
    const [announcement, setAnnoucement] = useState(false);
    const {popUp } = useContext(UIContext);
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
        await fetch('http://localhost:3000/createannoucemnet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomId, form })
        })
            .then((res) => res.json())
            .then((data) => { setAnnoucements(prev => [...prev, data]) })
            .catch((err) => console.log(err))
    }

    return (

        <>
            <div className={`flex flex-col ${popUp && 'transition duration-500 blur pointer-events-none'}`}>
                <div className="flex mt-2 justify-between">
                    <PageTitle
                        text={'Announcements'}
                    />
                    <Button
                        onClickAction={() => { setAnnoucement(true); }}
                        buttonLabel={'Create a New Announcement'}
                    />
                </div>
                <div className=" min-w-full pt-4  flex flex-col gap-2  rounded-2xl transition duration-1000">
                    {announcements.map((item, i) => (
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