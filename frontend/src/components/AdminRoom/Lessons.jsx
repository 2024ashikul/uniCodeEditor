import { useState, useEffect, useContext } from "react";
import PopUp from "../SharedComponents/PopUp"

import { useNavigate } from "react-router-dom";
import PageTitle from "../SharedComponents/PageTitle";
import Button from "../SharedComponents/Button";
import { UIContext } from "../../Contexts/UIContext/UIContext";
import NullComponent from "../SharedComponents/NullComponent";
import { API_URL } from "../../config";

export default function Lessons({ roomId }) {
    const {popUp } = useContext(UIContext);
    
    
    const [lessons, setLessons] = useState([]);
    
    useEffect(() => {
        fetch(`${API_URL}/fetchlessons`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomId })
        })
            .then((res) => res.json())
            .then((data) => { console.log(data); setLessons(data.lessons) })
            .catch((err) => console.log(err))
    }, [roomId])
    const navigate = useNavigate();

    
    return (
        <>
            <div className={`flex flex-col ${ popUp && 'transition duration-500 blur pointer-events-none'} `}>
                <div className="flex mt-2 justify-between">
                    <PageTitle
                        text={'Lessons'}
                    />
                    <Button
                        onClickAction={() => navigate(`/room/${roomId}/createlesson`)}
                        buttonLabel={'Create a new Lesson'}
                    />
                </div>
                <div className=" min-w-full pt-4  flex flex-col gap-2  rounded-2xl transition duration-1000">
                    {
                    lessons.length === 0 ? 
                    <NullComponent
                        text={'No lessons found!'}
                    />
                    
                    : lessons?.map((item, i) => (
                        <div className="shadow-sm items-center rounded-2xl transition flex w-full 
                                  
                                    "
                            key={i}
                            >

                            <div className="px-4 py-2">{item.id}</div>
                            <div className="px-4 py-2 flex-1">{item.title}</div>
                            <div className="px-4 py-2 ">{item.createdAt.slice(2, 10)}</div>
                            <div className="px-4 py-2  whitespace-pre-line  overflow-hidden">{item.description}</div>
                            <div className="px-4 py-2 ">{item.status}</div>
                            
                            <div 
                            onClick={()=>navigate(`/updatelesson/${item.id}`)}
                            className="px-4 py-2 rounded-3xl hover:bg-gray-400 hover:text-white underline">Update</div>
                            <div 
                            onClick={()=>navigate(`/lesson/${item.id}`)}
                            className="px-4 py-2 rounded-3xl hover:bg-gray-400 hover:text-white underline ">View</div>
                        </div>
                    ))}

                </div>
            </div>


        </>
    )
}