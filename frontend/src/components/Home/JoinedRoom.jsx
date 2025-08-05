import { useContext } from "react"

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { AlertContext } from "../../Contexts/AlertContext/AlertContext";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import PageTitle from "../PageTitle";
import { UIContext } from "../../Contexts/UIContext/UIContext";
import Button from "../Button";
import PopUp from "../PopUp";
import NullComponent from "../NullComponent";


export default function JoinedRoom() {
    const { setMessage, setType } = useContext(AlertContext);
    const [joining, setJoining] = useState(null);
    const navigate = useNavigate();
    const { email, userId, token } = useContext(AuthContext);
    const { popUp, setPopUp,setTitle } = useContext(UIContext);

    const [rooms, setRooms] = useState([]);
    const [form, setForm] = useState({
        roomId: ''
    })

    console.log({ email, userId, token });

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    const joinRoom = async (e) => {
        e.preventDefault();
        const roomId = form.roomId;
        console.log(userId);
        console.log(roomId);
        const role = 'user';
        try {
            const res = await fetch('http://localhost:3000/joinroom', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ roomId, userId, role })
            })
            const data = await res.json();

            if (!res.ok) {
                setMessage(data.message);
                setType(data.type);
            } else {
                setMessage(data.message);
                setType(data.type);
                setPopUp(false);
                navigate(`/room/${roomId}`);
            }
        } catch (err) {
            setMessage('Could not connect to server');
            setType('error');
            console.log(err);
        }
    }

    useEffect(() => {
        const type = 'onlyUser';
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

    const PopUpCode = (
        <form method="POST" onSubmit={joinRoom} className="flex flex-col h-full gap-2 items-center justify-center" >
            <div className="px-10 py-6 w-full max-w-2xl mx-auto space-y-4  rounded-xl">

                <div className="flex items-center gap-4">
                    <label className="w-28 text-gray-700 font-medium" htmlFor="roomId">
                        Room Id
                    </label>
                    <input
                        required
                        id="roomId"
                        name="roomId"
                        type="text"
                        placeholder="Enter Room Id"
                        onChange={handleChange}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>


            <button type="submit" className="border px-10 py-1 rounded-2xl transition duration-500
                        hover:bg-blue-500 hover:text-white hover:transition hover:duration-500">
                Join</button>
        </form>
    );

    return (
        <>
            <div className={`flex flex-col ${popUp && 'transition duration-500 blur pointer-events-none'}`}>
                <div className="flex mt-2 justify-between">
                    <PageTitle
                        text={'Your joined rooms'}
                    />
                    <Button
                        onClickAction={() => { setJoining(true); }}
                        buttonLabel={'Join a new Room'}
                        
                    />
                    
                </div>
                <div className=" min-w-full pt-4  flex flex-col gap-2  rounded-2xl transition duration-1000">
                    {rooms.length === 0 ? 
                      <div>  <NullComponent text="No rooms joined"/></div>
                    :
                        rooms.map((item, i) => (
                            <div className="shadow-md border-fuchsia-200 flex-col rounded-2xl transition 
                            duration-500 flex max-w-[800px] py-2
                                        hover:bg-slate-300 "
                                key={i}
                                onClick={() => {setTitle(item.room.name); navigate(`/room/${item.roomId}`) }}
                            >
                                <div className="flex justify-between px-4 py-1 cursor-pointer">
                                    <div>{item.roomId}</div>
                                    <div>{item.room?.name}</div>
                                    <div>{item.role}</div>
                                    <div>{item.createdAt}</div>
                                    <div>{item.description}</div>
                                </div>

                            </div>
                        ))}

                </div>
            </div>
            {joining &&
                <PopUp
                    name={joining}
                    setName={setJoining}
                    onChange={handleChange}
                    onSubmit={joinRoom}
                    extraFields={null}
                    title={'Join a new Room'}
                    buttonTitle={'Join Room'}
                    ManualCode={PopUpCode}
                    ManualEdit={true}
                />
            }


        </>
    )
}