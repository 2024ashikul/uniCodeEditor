import { useContext } from "react"
import { AuthContext } from "../src/Contexts/AuthContext/AuthContext"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";


export default function CreateRoom() {
    const navigate = useNavigate();
    const { role, email,userId, token, setRole, setEmail,setToken } = useContext(AuthContext);
    const [roomName, setRoomName] = useState(null);
    const [rooms, setRooms] = useState([]);
    console.log(role);
    console.log(email);



    // useEffect(() => {
    //    if (role === null) return;
    //     if (role != 'admin') {
    //         navigate('/login');
    //     }
    // }, [role, navigate])

    async function createRoom() {
        console.log(email);
        await fetch('http://localhost:3000/createroom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ email, roomName })
        })
            .then((res) => res.json())
            .then((data) => { console.log(data); setRooms(prev => [...prev, data]) })
            .catch((err) => console.log(err))
    }

    function logOut() {
        localStorage.removeItem('token');
        setEmail(null);
        setRole(null);
        setToken(null);

    }
    useEffect(() => {
        if (!userId || !token) return;
        
        
        fetch('http://localhost:3000/loadrooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId })
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setRooms(data.room)
            })
            .catch((err) => console.log(err))
    }, [userId, token])

    return (
        <>

            <div className="flex flex-col">
                <h2 className="text-xl font-semibold mb-4">Hi {}</h2>
                <h2 className="text-xl font-semibold mb-4">Your Rooms</h2>

                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-100 text-gray-700 text-left">
                            <tr>
                                <th className="px-4 py-2">ID</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Created At</th>
                                <th className="px-4 py-2">Students</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map((item, index) => (
                                <tr
                                    key={index}
                                    onClick={() => navigate(`/admin/room/${item.id}`)}
                                    className="hover:bg-gray-50 cursor-pointer transition"
                                >
                                    <td className="px-4 py-2 border-t">{item.id}</td>
                                    <td className="px-4 py-2 border-t">{item.name}</td>
                                    <td className="px-4 py-2 border-t">{item.createdAt}</td>
                                    <td className="px-4 py-2 border-t">{item?.students}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
                <div className="flex gap-8 ">
                    Create a new Room
                    <input type="name" placeholder="Room Name" onChange={(e) => setRoomName(e.target.value)}></input>
                    <button onClick={createRoom}>Create</button>
                </div>
                <div>
                    <button onClick={logOut}> log out</button>
                </div>
            </div>
        </>
    )
}