import { useContext } from "react"

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { AlertContext } from "../../Contexts/AlertContext/AlertContext";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import { UIContext } from "../../Contexts/UIContext/UIContext";
import PopUp from "../PopUp";
import Button from "../Button";
import PageTitle from "../PageTitle";



export default function CreatedRoom() {

    const { setMessage, setType } = useContext(AlertContext);
    const [creating, setCreating] = useState(null);
    const { popUp, setPopUp } = useContext(UIContext);
    const navigate = useNavigate();
    const { email, userId, token } = useContext(AuthContext);

    const [rooms, setRooms] = useState([]);

    console.log({ email, userId, token });

    const [form, setForm] = useState({
        roomName: ''
    })

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    useEffect(() => {
        const type = 'onlyAdmin';
        fetch('http://localhost:3000/loadroomsjoined', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId, type })
        })
            .then((res) => res.json())
            .then((data) => {

                setRooms(data.rooms)
                console.log(data);
            })
            .catch((err) => console.log(err))
    }, [userId, token, setRooms])

    const createRoom = async (e) => {
        e.preventDefault();
        const roomName = form.roomName;

        console.log(userId);
        try {
            const res = await fetch('http://localhost:3000/createroom', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId, roomName })
            })
            const data = await res.json();
            if (!res.ok) {
                setMessage('Failed to connect to server');
                setType('error');
            }
            setMessage(data.message);
            setType('success');
            setRooms(prev => [...prev, data])
            setCreating(false);
            setPopUp(false);
        } catch (err) {
            console.log(err);
            setMessage('Failed to connect to server');
            setType('error');
        }

    }


    const PopUpCode = (
        <form method="POST" onSubmit={createRoom} className="flex flex-col h-full gap-2 items-center justify-center" >
            <div className="px-10 py-6 w-full max-w-2xl mx-auto space-y-4  rounded-xl">

                <div className="flex items-center gap-4">
                    <label className="w-28 text-gray-700 font-medium" htmlFor="roomId">
                        Room Name
                    </label>
                    <input
                        required
                        id="roomId"
                        name="roomId"
                        type="text"
                        placeholder="Enter your Room Name"
                        onChange={handleChange}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>


            <button type="submit" className="border px-10 py-1 rounded-2xl transition duration-500
                        hover:bg-blue-500 hover:text-white hover:transition hover:duration-500">
                Create </button>
        </form>
    );

    return (
        <>
            <div className={`flex flex-col ${popUp && 'transition duration-500 blur pointer-events-none'}`}>
                <div className="flex mt-2 justify-between">
                    <PageTitle
                        text={'Your Created rooms'}
                    />
                    <Button
                        onClickAction={() => { setCreating(true); }}
                        buttonLabel={'Create a new Room'}
                    />
                </div>
                <div className=" min-w-full pt-4  flex flex-col gap-2  rounded-2xl transition duration-1000">
                    {rooms.length === 0 ? 'No rooms joind' :
                        rooms.map((item, i) => (
                            <div className="shadow-md border-fuchsia-200 flex-col rounded-2xl transition duration-500 flex w-full 
                                                        hover:bg-slate-300 "
                                key={i}
                                onClick={() => { navigate(`/room/${item.roomId}`) }}
                            >

                                <div className="flex justify-between px-4 cursor-pointer">
                                    <div>{item.roomId}</div>
                                    <div>{item.room?.name}</div>
                                    <div>{item.role}</div>
                                    <div>{item.createdAt}</div>
                                    <div>{item.description}</div></div>

                            </div>
                        ))}

                </div>
            </div>

            {creating &&
                <PopUp
                    name={creating}
                    setName={setCreating}
                    onChange={handleChange}
                    onSubmit={createRoom}
                    extraFields={null}
                    title={'Create a new Room'}
                    buttonTitle={'Create Room'}
                    ManualCode={PopUpCode}
                    ManualEdit={true}
                />
            }


        </>
    )
}