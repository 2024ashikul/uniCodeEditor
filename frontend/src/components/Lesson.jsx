import MDEditor from "@uiw/react-md-editor";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


export default function Lesson() {

    const [lesson, setLesson] = useState(null);
    const [contents, setContents] = useState(null);



    const { lessonId } = useParams();
    useEffect(() => {
        fetch('http://localhost:3000/fetchlesson', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ lessonId })
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setLesson(data.lesson);
                setContents(data.lesson?.contents)
            })
            .catch((err) => console.log(err))
    }, [lessonId])
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
            <div className="mx-20 ">
                <div> {lesson?.title}</div>
                <div className="flex flex-col gap-10 text-3xl py-4 justify-center items-center">

                    {contents?.map((item, index) => {

                        if (item.type === "text") {
                            return <MDEditor.Markdown className="w-full" source={item.content} />
                        }



                        if (item.type === "video") {

                            return (
                                <div className="flex aspect-w-16 aspect-h-9 aspect-auto overflow-hidden w-[600px] h-auto justify-between align-center">
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