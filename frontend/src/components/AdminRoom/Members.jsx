import { useContext, useEffect, useState } from "react";
import PageTitle from "../SharedComponents/PageTitle";
import { API_URL } from "../../config";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import LoadingParent from "../SharedComponents/LoadingParent";



export default function Members({ roomId }) {
    const [members, setMembers] = useState(null);
        const {token} = useContext(AuthContext);
        useEffect(() => {
        const members = async () => {
            try {
                const res = await fetch(`${API_URL}/room/members`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ roomId })
                })

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                 setMembers(data);
            } catch (err) {
                console.log("Failed to fetch lesson", err);
            }
        }

        if (roomId) {
            members();
        }
    }, [roomId, token])

    return (
        <>
            <div className=" min-w-full pt-4  flex flex-col gap-2  rounded-2xl transition duration-1000">
                <PageTitle 
                    text={'Members '+( members=== null ? 1 : members.length)}
                />
                <div className="flex flex-col gap-2 rounded-2xl">
                    {
                    members===null ? <LoadingParent /> :
                    members.map((item,index) => (
                        <div className="flex gap-2  shadow px-2 py-2" key={index}>
                            <p className="text-lg flex-1">{index+1}</p>
                            <p className="text-lg flex-1">{item.name}</p>
                            <p className="text-lg flex-1">{item.role}</p>
                            <p className="text-lg flex-1">{item.email}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}