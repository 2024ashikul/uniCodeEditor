import MDEditor from "@uiw/react-md-editor";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UIContext } from "../Contexts/UIContext/UIContext";
import TopBanner from "./SharedComponents/TopBanner";
import { API_URL } from "../config";
import { AuthContext } from "../Contexts/AuthContext/AuthContext";


export default function Lesson() {
    const [contents, setContents] = useState(null);
    const { setTitle, setScrollHeight } = useContext(UIContext);
    const { lessonId } = useParams();
    const {token} = useContext(AuthContext);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const res = await fetch(`${API_URL}/lesson/fetchone`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ lessonId })
                });
                
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                console.log(data)
                setTitle(data.lesson?.title);

                setContents(data.lesson.lessonContents)
            }catch(err){
                console.log("Failed to fetch lesson",err);
            }
        }

        if(lessonId){
            fetchLesson();
        }
    }, [lessonId, setTitle, setScrollHeight,token])


    function getYouTubeVideoId(url) {
        try {
            const parsed = new URL(url);
            if (parsed.hostname.includes("youtu.be")) return parsed.pathname.slice(1);
            if (parsed.hostname.includes("youtube.com")) return parsed.searchParams.get("v");
        } catch {
            return null;
        }
        return null;
    }

    return (
        <>
            <div className="mx-40 ">
                <TopBanner />
                <div className="flex w-full border-b">
                    {/* <span className="text-3xl font-semibold">{lesson?.title}</span> */}
                    {/* <span className="align-bottom ">{lesson?.createdAt.slice(0,10)}</span> */}
                </div>
                <div className="flex flex-col gap-10 text-3xl py-4 justify-center items-center">
                    {contents?.map((item, index) => {

                        if (item.type === "text") {
                            return <MDEditor.Markdown className="w-full" source={item.content} />
                        }

                        if (item.type === "video") {

                            return (
                                <div className="flex overflow-hidden min-w-[600px] h-auto aspect-video rounded-2xl justify-between align-center">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${getYouTubeVideoId(item.content)}`}
                                        allowFullScreen
                                        className="flex w-full h-full justify-between align-center"
                                    />
                                </div>
                            )
                        }

                        if (item.type === "image") {
                            return (
                                <img
                                    src={item.content}
                                    alt={`lesson-${index}`}
                                    className="w-full rounded max-h-52 max-w-52"
                                />
                            )

                        }
                    })}
                </div>
            </div>
        </>
    )
}