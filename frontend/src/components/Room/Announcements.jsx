import { useEffect, useState } from "react";
import PageTitle from "../SharedComponents/PageTitle";
import NullComponent from "../SharedComponents/NullComponent";
import { API_URL } from "../../config";

export default function Announcements({ roomId }) {
    const [announcements, setAnnoucements] = useState([]);

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


    return (
        <>
            <div className={`flex flex-col `}>
                <div className="flex mt-2 justify-between">
                    <PageTitle
                        text={'Announcements'}
                    />
                </div>
                <div className=" min-w-full pt-4  flex flex-col gap-2  rounded-2xl transition duration-1000">
                    {announcements.length === 0 ?
                        <NullComponent
                            text={'No Announcements found'}
                        />
                        : announcements.map((item, i) => (
                            <div className="shadow-md border-fuchsia-200 flex-col rounded-2xl transition duration-500 flex w-full 
                                hover:bg-slate-300 "
                                key={i}>

                                <div className="flex">
                                    <div className="px-4 py-2 text-lg self-center font-semibold">{item.title}</div>
                                    <div className="px-4 py-2 flex-1 self-end text-sm">{new Date(item.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div className="pl-8 py-2 flex-1 text-md overflow-hidden">{item.description}</div>

                            </div>
                        ))}

                </div>
            </div>

        </>
    )
}

