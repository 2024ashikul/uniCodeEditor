import { useContext, useEffect, useState } from "react";
import PageTitle from "../SharedComponents/PageTitle";
import { API_URL } from "../../config";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import LoadingParent from "../SharedComponents/LoadingParent";
import { APIRequest } from "../../APIRequest";
import { AlertContext } from "../../Contexts/AlertContext/AlertContext";

export default function Members({ roomId }) {
    const { request } = APIRequest();
    const { setMessage } = useContext(AlertContext);
    const [members, setMembers] = useState(null);
    const [admins, setAdmins] = useState(null);
    const { token, userId } = useContext(AuthContext);
    const [rootAdmin, setRootAdmin] = useState(null);

    useEffect(() => {
        const fetchAdmin = async () => {
            const data = await request("/room/getadmin", { body: { roomId } });
            console.log(data);
            setRootAdmin(data.admin);
        };
        console.log({ userId, rootAdmin });
        const fetchMembers = async () => {
            try {
                const res = await fetch(`${API_URL}/room/members`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ roomId }),
                });

                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

                const data = await res.json();
                setAdmins(data.filter(user => user.role == 'admin'));
                setMembers(data.filter(user => user.role == 'member'));

            } catch (err) {
                console.log("Failed to fetch members", err);
            }
        };

        if (roomId) {
            fetchAdmin();
            fetchMembers();
        }
    }, [roomId, token, userId, rootAdmin]);

    async function changeAdmin(memberToAdmin) {
        try {
            const data = await request("/room/changeadmin", {
                body: { memberToAdmin, roomId },
            });
            setMessage(data.message);

            setAdmins((prevAdmins) => {
                const isCurrentlyAdmin = prevAdmins.some((a) => a.userId === memberToAdmin);

                if (isCurrentlyAdmin) {

                    const demoted = prevAdmins.find((a) => a.userId === memberToAdmin);
                    if (!demoted) return prevAdmins;

                    setMembers((prevMembers) => [
                        ...prevMembers.filter((m) => m.userId !== memberToAdmin),
                        { ...demoted, role: "member" },
                    ]);

                    return prevAdmins.filter((a) => a.userId !== memberToAdmin);
                } else {
                    const promoted = members.find((m) => m.userId === memberToAdmin);
                    if (!promoted) return prevAdmins;

                    setMembers((prevMembers) =>
                        prevMembers.filter((m) => m.userId !== memberToAdmin)
                    );

                    return [...prevAdmins, { ...promoted, role: "admin" }];
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

    async function kickMember(memberToKick) {
        try {
            const data = await request("/room/kickmember", { body: { memberToKick, roomId } });
            setMessage(data.message);
            setAdmins((prevAdmins) => prevAdmins.filter((a) => a.userId !== memberToKick));
            setMembers((prevMembers) => prevMembers.filter((m) => m.userId !== memberToKick));
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="min-w-full pt-4 flex flex-col gap-4">
            <PageTitle text={`Members (${members?.length + admins?.length || 0})`} />

            {admins == null ? (
                <LoadingParent />
            ) : (

                <>


                    <div className="grid grid-cols-1 gap-3">
                        {

                            admins?.map((item, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-6 items-center justify-between bg-white shadow-md rounded-xl px-4 py-3 border border-gray-100 hover:shadow-lg transition"
                                >
                                    <div className="flex items-center gap-3 col-span-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                                            {item?.name[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-gray-800 font-medium">{item?.name}</p>
                                            <p className="text-sm text-gray-500">{item?.email}</p>
                                        </div>
                                    </div>


                                    <div className="flex items-center">
                                        <span
                                            className={`px-2 py-0.5 text-md rounded-full ${item?.role === "admin"
                                                ? "bg-purple-100 text-purple-600"
                                                : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {item?.role}
                                        </span>
                                    </div>
                                    <div className="col-span-2 flex justify-center">
                                        {
                                            item?.userId != rootAdmin && (
                                                <div className="flex gap-2  items-center">

                                                    <button
                                                        onClick={() => changeAdmin(item?.userId)}
                                                        className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400 transition"
                                                    >
                                                        Remove Admin
                                                    </button>

                                                    <button
                                                        onClick={() => kickMember(item?.userId)}
                                                        className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
                                                    >
                                                        Kick
                                                    </button>
                                                </div>
                                            )

                                        }
                                    </div>
                                </div>
                            ))}</div>




                    {/* section tow */}

                    <div className="grid grid-cols-2 gap-3">
                        {
                            members == null ?
                                'No members found'
                                :

                                members.map((item, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-6 items-center justify-between bg-white shadow-md rounded-xl px-4 py-3 border border-gray-100 hover:shadow-lg transition"
                                    >
                                        <div className="flex items-center gap-3 col-span-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                                                {item.name[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-gray-800 font-medium">{item.name}</p>
                                                <p className="text-sm text-gray-500">{item.email}</p>
                                            </div>
                                        </div>


                                        <div className="flex items-center">
                                            <span
                                                className={`px-2 py-0.5 text-md rounded-full ${item.role === "admin"
                                                    ? "bg-purple-100 text-purple-600"
                                                    : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {item.role}
                                            </span>
                                        </div>
                                        <div className="col-span-2 flex justify-center">


                                            <div className="flex gap-2  items-center">

                                                <button
                                                    onClick={() => changeAdmin(item.userId)}
                                                    className="px-3 py-1 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition"
                                                >
                                                    Make Admin
                                                </button>

                                                <button
                                                    onClick={() => kickMember(item.userId)}
                                                    className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
                                                >
                                                    Kick
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                ))}</div>
                </>
            )}



        </div>

    )
}