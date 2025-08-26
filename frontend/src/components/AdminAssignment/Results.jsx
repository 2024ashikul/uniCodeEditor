
import { useState, useEffect } from "react";
import { API_URL } from "../../config";



export default function Results({ assignmentId }) {


    const [members, setMembers] = useState([]);
    useEffect(() => {
        fetch(`${API_URL}/roommembersforassigment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ assignmentId })
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setMembers(data.result);

            })
            .catch((err) => console.log(err))
    }, [assignmentId])
    console.log(members);
    return (
        <>
            <div className="flex mt-2 justify-between">
                <p className="text-3xl py-2 ">Results</p>

            </div>

            <div className=" min-w-full pt-4  flex flex-col gap-2  rounded-2xl transition duration-1000">
                {members.map(item => (
                    <div className="flex gap-2 flex-col shadow px-2 py-2" key={item.id}>
                        <div className="flex bg-gray-300">
                            <p className="text-lg flex-1">{1}</p>
                            <p className="text-lg flex-1">{item?.member.name}</p>
                            <p className="text-lg flex-1">{item?.member.email}</p>
                            <div>
                                Total Score: {item.submission.flat().reduce((sum, sub) => sum + (sub.AIscore || 0), 0)}
                            </div>
                        </div>
                        <div className="text-sm flex justify-between">


                            {item.submission.map((group, idx) => (
                                <div key={idx} className="flex gap-4 overflow-scroll justify-between">
                                    {group.length > 0 ?
                                        group.map(temp => (
                                            <div className="h-20 min-w-24  justify-center">
                                                <div className="justify-center">Problem {idx + 1}</div>
                                                <div className="justify-center"><a href={`${API_URL}/files/${temp?.file}.txt`} className="underline" target="_blank">View</a></div>
                                                <div className="justify-center">{temp.AIscore || 0}</div>
                                            </div>
                                        ))
                                        :
                                        <div className="h-20 min-w-24  justify-center">
                                            <div>Problem {idx + 1}</div>
                                            <div>'NaN'</div>
                                            <div>{0}</div>
                                        </div>
                                    }
                                </div>
                            ))}

                        </div>

                    </div>
                ))}

            </div>
            
        </>
    )
}