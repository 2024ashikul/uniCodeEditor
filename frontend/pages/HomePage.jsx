
import { useContext } from "react";
import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../src/Contexts/AuthContext/AuthContext";




export default function HomePage() {
    const [roomId, setRoomId] = useState(null);
    const { userId, role } = useContext(AuthContext);
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    console.log(token);


    async function joinRoom() {
        console.log(userId);
        console.log(role);
        await fetch('http://localhost:3000/joinroom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomId, userId, role })
        })
            .then((res) => res.json())
            .then((data) => { console.log(data);
                if(data.message){
                    navigate(`/room/${roomId}`);
                }
             })
            .catch((err) => console.log(err))


        //navigate(`/room/${roomId}`);
    }


    return (
        <>
            <div className="flex flex-col p-4">
                <div className="text-2xl self-center">
                    Welcome to Uni CoDE eDITOR
                </div>
                <div className="flex flex-col gap-2">
                    
                    <div onClick={() => navigate('/login')} className="px-8 py-2 bg-amber-300">  Login</div>
                    <div onClick={() => navigate('/signup')} className="px-8 py-2 bg-amber-300">  Sign Up</div>
                    <label for='room'></label>
                    <input name="room" placeholder="join room" value={roomId} onChange={(e) => setRoomId(e.target.value)}>

                    </input>
                    <button onClick={joinRoom}>Join</button>
                </div>
            </div>
        </>
    )
}