import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertContext } from "../../Contexts/AlertContext/AlertContext";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import { UIContext } from "../../Contexts/UIContext/UIContext";
import NullComponent from "../SharedComponents/NullComponent";
import PopUp from "../SharedComponents/PopUp";
import { API_URL } from "../../config";
import { Star } from "lucide-react";

export default function RoomSection() {
    const { setMessage, setType } = useContext(AlertContext);
    const navigate = useNavigate();
    const { userId, token } = useContext(AuthContext);
    const { setTitle } = useContext(UIContext);

    const [rooms, setRooms] = useState([]);
    const [form, setForm] = useState({ roomId: "", roomName: "" });
    const [joining, setJoining] = useState(false);
    const [creating, setCreating] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const joinRoom = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/joinroom`, {
                method: "POST",
                headers: { "Content-Type": "application/json" ,
                    Authorization: `Bearer ${token}`,
                },
                
                body: JSON.stringify({ roomId: form.roomId, userId}),
            });
            const data = await res.json();


            if (res.ok) {
                setMessage(data.message);
                setType(data.type || (res.ok ? "success" : "error"));
                setRooms((prev) => [...prev, data.newRoom]);
                setJoining(false);
                navigate(`/room/${form.roomId}`);
            }else{
                setMessage(data.message);
                setType(data.type || (res.ok ? "success" : "error"));
                setJoining(false);
            }
        } catch (err) {
            setMessage("Could not connect to server");
            setType("error");
            console.log(err);
        }
    };

    const createRoom = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/createroom`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId, roomName: form.roomName }),
            });
            const data = await res.json();

            setMessage(data.message);
            setType(res.ok ? "success" : "error");
            console.log(data);
            if (res.ok) {
                setRooms((prev) => [...prev, data.newRoom]);
                setCreating(false);
            }
            console.log(rooms);
        } catch (err) {
            setMessage("Failed to connect to server");
            setType("error");
            console.log(err);
        }
    };

    useEffect(() => {
        fetch(`${API_URL}/loadroomsjoined`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId, type: "" }),
        })
            .then((res) => res.json())
            .then((data) => setRooms(data.rooms || []))
            .catch((err) => console.log(err));
    }, [userId, token]);
    console.log(rooms);

    const JoinRoomPopUp = (
        <form
            method="POST"
            onSubmit={joinRoom}
            className="flex flex-col h-full gap-4 items-center justify-center"
        >
            <div className="px-10 py-6 w-full max-w-2xl mx-auto space-y-4 rounded-xl">
                <div className="flex items-center gap-4">
                    <label className="w-28 text-gray-700 font-medium" htmlFor="roomId">
                        Lab Id
                    </label>
                    <input
                        required
                        id="roomId"
                        name="roomId"
                        type="text"
                        placeholder="Enter Lab Id"
                        onChange={handleChange}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
            <button
                type="submit"
                className="border px-10 py-2 rounded-2xl transition duration-300 hover:bg-blue-500 hover:text-white"
            >
                Join
            </button>
        </form>
    );

    const CreateRoomPopUp = (
        <form
            method="POST"
            onSubmit={createRoom}
            className="flex flex-col h-full gap-4 items-center justify-center"
        >
            <div className="px-10 py-6 w-full max-w-2xl mx-auto space-y-4 rounded-xl">
                <div className="flex items-center gap-4">
                    <label className="w-28 text-gray-700 font-medium" htmlFor="roomName">
                        Lab Name
                    </label>
                    <input
                        required
                        id="roomName"
                        name="roomName"
                        type="text"
                        placeholder="Enter Lab Name"
                        onChange={handleChange}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
            </div>
            <button
                type="submit"
                className="border px-10 py-2 rounded-2xl transition duration-300 hover:bg-green-500 hover:text-white"
            >
                Create
            </button>
        </form>
    );

    return (
        <div className="w-full flex flex-col gap-6">

            <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-2xl font-semibold text-gray-800">Your Joined Labs</h2>
                <div className="flex gap-3">
                    <button
                        onClick={() => setJoining(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-xl shadow-md hover:bg-blue-600 transition"
                    >
                        Join Lab
                    </button>
                    <button
                        onClick={() => setCreating(true)}
                        className="px-4 py-2 bg-green-500 text-white rounded-xl shadow-md hover:bg-green-600 transition"
                    >
                        Create Lab
                    </button>
                </div>
            </div>


            {rooms.length === 0 ? (
                <div className="flex justify-center py-10">
                    <NullComponent text="You haven’t joined any rooms yet." />
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {rooms.map((item, i) => {
                        const isAdmin = item?.role === "admin";
                        return (
                            <div
                                key={i}
                                onClick={() => {
                                    setTitle(item.room?.name);
                                    navigate(`/room/${item.roomId}`);
                                }}
                                className="relative cursor-pointer bg-white shadow-lg rounded-2xl p-5 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300"
                            >
                                {isAdmin && (
                                    <div className="absolute top-3 right-3 text-yellow-500">
                                        <Star className="w-6 h-6 fill-yellow-400" />
                                    </div>
                                )}
                                <h3 className="text-lg font-bold text-blue-600">
                                    {item?.room?.name || "Untitled Lab"}
                                </h3>
                                <div className="mt-2 text-sm text-gray-600 space-y-1">
                                    <p>
                                        <span className="font-medium">Lab ID:</span> {item?.roomId}
                                    </p>
                                    <p>
                                        <span className="font-medium">Admin:</span> Admin Name
                                    </p>
                                    <p>
                                        <span className="font-medium">Created At:</span>{" "}
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </p>
                                    {item.description && (
                                        <p className="italic text-gray-500">{item.description}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}


            {joining && (
                <PopUp
                    name={joining}
                    setName={setJoining}
                    ManualCode={JoinRoomPopUp}
                    ManualEdit={true}
                    title={"Join a Lab"}
                />
            )}
            {creating && (
                <PopUp
                    name={creating}
                    setName={setCreating}
                    ManualCode={CreateRoomPopUp}
                    ManualEdit={true}
                    title={"Create a Lab"}
                />
            )}
        </div>
    );
}
