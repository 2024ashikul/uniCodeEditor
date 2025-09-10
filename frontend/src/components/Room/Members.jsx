import { useContext, useEffect, useState } from "react";
import PageTitle from "../SharedComponents/PageTitle";
import { API_URL } from "../../config";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import LoadingParent from "../SharedComponents/LoadingParent";
import { APIRequest } from "../../APIRequest";
import { AlertContext } from "../../Contexts/AlertContext/AlertContext";

export default function Members({ roomId }) {
    

    const [members, setMembers] = useState(null);
    const [admins, setAdmins] = useState(null);
    const { token, userId } = useContext(AuthContext);


    useEffect(() => {

        console.log({ userId });
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

            fetchMembers();
        }
    }, [roomId, token, userId]);



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
                                    className="grid grid-cols-6 mx-30 items-center justify-between bg-white shadow-md rounded-xl px-4 py-3 border border-gray-100 hover:shadow-lg transition"
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

                                </div>
                            ))}
                    </div>




                    {/* section tow */}

                    <div className="grid grid-cols-2 gap-3">
                        {
                            members == null ?
                                'No members found'
                                :

                                members.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex  items-center justify-between bg-white shadow-md rounded-xl px-4 py-3 border border-gray-100 hover:shadow-lg transition"
                                    >
                                        <div className="flex flex-1 items-center gap-3 ">
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

                                    </div>
                                ))}
                    </div>
                </>
            )}



        </div>

    )
}