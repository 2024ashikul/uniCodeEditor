
import { useContext, useEffect, useState } from "react";

import socket from "../../socket"
import {  useParams } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
export default function Chat() {
    const [admin, setAdmin] = useState([]);
    const { email } = useContext(AuthContext);
    const {roomId } =useParams();
    const [chat, setChat] = useState([]);
    const [message, setMessage] = useState("");
    useEffect(() => {
        fetch('http://localhost:3000/getadmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomId })
        })
            .then((res) => res.json())
            .then((data) => setAdmin(data))
            .catch((err) => console.log(err))
    }, [roomId])


    const leaveRoom = () => {
        // socket.emit('leave', roomId);
        // console.log('leaving')
    }

    const sendMessage = () => {
        const sender = email;
        socket.emit('send-message', { roomId, message, sender });
        setMessage("");
    }

    useEffect(() => {
        socket.emit('join-room', roomId);
        socket.on('receive-message', (msgData) => {
            console.log(msgData);
            setChat(prev => [...prev, msgData])
        });

        return () => {
            socket.emit("leave", roomId);
            socket.off("receive-message");
        };
    }, [roomId])

    return (
        <>
            <div className="p-4 border hidden">
                <div className="h-64 overflow-y-auto mb-2 border-b">
                    {chat.map((msg, i) => (
                        <div key={i}>

                            <> <strong>{msg.sender || 'system'}</strong>: {msg.message}</>

                        </div>
                    ))}
                </div>
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                    className="border p-1 mr-2"
                />
                <button onClick={sendMessage} className="bg-blue-500 text-white px-2 py-1">
                    Send
                </button>
            </div>
            <p>{admin.name}</p>
            <div>
                <button onClick={leaveRoom}>Leave</button>
            </div>
        </>

        
    )
}