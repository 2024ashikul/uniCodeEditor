import { useContext, useEffect, useState } from "react";
import PopUp from "../SharedComponents/PopUp";
import PageTitle from "../SharedComponents/PageTitle";
import Button from "../SharedComponents/Button";
import { UIContext } from "../../Contexts/UIContext/UIContext";
import NullComponent from "../SharedComponents/NullComponent";
import { AlertContext } from "../../Contexts/AlertContext/AlertContext";
import InlineButton from "../SharedComponents/InlineButton";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";



export default function Annoucements({ roomId }) {
    const [announcements, setAnnoucements] = useState([]);
    const [announcement, setAnnoucement] = useState(false);
    const { popUp, setPopUp } = useContext(UIContext);
    const { setMessage, setType } = useContext(AlertContext);
    const [form, setForm] = useState({
        title: '',
        description: ''
    });
    const navigate = useNavigate();
    useEffect(() => {
        fetch(`${API_URL}/fetchannouncements`, {
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
            const res = await fetch(`${API_URL}/createannoucemnet`, {
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
            <div className={`flex flex-col ${popUp && 'transition duration-500 blur pointer-events-none'}`}>
                <div className="flex mt-2 justify-between">
                    <PageTitle
                        text={'Announcements'}
                    />
                    <Button
                        onClickAction={() => { setAnnoucement(true) }}
                        buttonLabel={'Create a New Announcement'}
                    />
                </div>
                <div className=" min-w-full pt-4  flex  gap-2  rounded-2xl transition duration-1000">
                    <div className="w-7/12">
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
                                            <div className="px-4 py-2 font-semibold text-lg self-center">{item.title}</div>
                                            <div className="px-4 py-2 flex-1 self-end text-sm">{new Date(item.createdAt).toLocaleDateString()}</div>
                                        </div>
                                        <div className="pl-8 py-2 flex-1 overflow-hidden">{item.description}</div>

                                    </div>
                                ))
                        }

                    </div>
                    <div className="flex-1">
                        <div className="w-[400px]">
                            <InlineButton buttonLabel={'Create a new CollabClass'}
                                onClickAction={() => {

                                    navigate(`/collaborateclassroom/${roomId}`)
                                }
                                }
                            />
                        </div>
                        <div className="w-[400px]">
                            <InlineButton buttonLabel={'Create a new CollabMeet'}
                                onClickAction={() => {

                                    navigate(`/collaborateroom/${roomId}`)
                                }
                                }
                            />
                        </div>
                    </div>
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