import { useEffect, useState } from "react";
import PageTitle from "../PageTitle";



export default function Members({ roomId }) {
    const [members, setMembers] = useState([]);
    
    useEffect(() => {
        fetch('http://localhost:3000/roommembers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomId })
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setMembers(data);
            })
            .catch((err) => console.log(err))
    }, [roomId])

    return (
        <>
            <div className=" min-w-full pt-4  flex flex-col gap-2  rounded-2xl transition duration-1000">
                <PageTitle 
                    text={'Members'}
                />
                <div className="flex flex-col gap-2 rounded-2xl">
                    {members.map(item => (
                        <div className="flex gap-2  shadow px-2 py-2" key={item.id}>
                            <p className="text-lg flex-1">{1}</p>
                            <p className="text-lg flex-1">{item.name}</p>
                            <p className="text-lg flex-1">{item.email}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}