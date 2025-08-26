import { useState, useEffect } from "react";
import PageTitle from "../SharedComponents/PageTitle";
import Button from "../SharedComponents/Button";
import PopUp from "../SharedComponents/PopUp";
import { UIContext } from "../../Contexts/UIContext/UIContext";
import MDEditor from "@uiw/react-md-editor";
import { API_URL } from "../../config";

export default function Problems({ assignmentId }) {
    const [problems, setProblems] = useState([]);

    

    useEffect(() => {
        fetch(`${API_URL}/fetchproblems`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ assignmentId })
        })
            .then((res) => res.json())
            .then((data) => { setProblems(data); console.log(data) })
            .catch((err) => console.log(err))
    }, [assignmentId])

    return (
        <>
            <div className={`flex flex-col `}>
                <div className="flex mt-2 justify-between">
                    <PageTitle
                        text={`Problems ${problems.length}`}
                    />

                </div>

                <div className=" min-w-full pt-4  flex flex-col gap-2  rounded-2xl transition duration-1000">
                    {problems.map((item, i) => (
                        <div className="shadow-md border-fuchsia-200 flex-col rounded-2xl transition duration-500 flex w-full "
                            key={i}>
                            <div className="flex flex-1 bg-gray-200 rounded-2xl items-center px-4">
                                <p>Problem {i + 1}</p>
                                <div className="flex flex-1">
                                    <div className="px-4 py-2 flex-1 text-xl self-center">{item.title}</div>

                                </div>
                                <div className="justify-end" >

                                    <a href={`/problem/${item.id}`}> Solve </a>
                                </div>
                            </div>

                            <div className="pl-8 py-2 flex-1 overflow-hidden">
                                <MDEditor.Markdown source={item.statement} />
                            </div>


                        </div>
                    ))}




                </div>


            </div>

        </>
    )
}