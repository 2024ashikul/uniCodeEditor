import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import NullComponent from "../SharedComponents/NullComponent";
import { API_URL } from "../../config";


export default function Submissions({ assignmentId }) {
    const [submissions, setSubmissions] = useState([]);
    const {userId} = useContext(AuthContext);
    useEffect(() => {
        fetch(`${API_URL}/fetchsubmissionsind`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ assignmentId,userId })
        })
            .then((res) => res.json())
            .then((data) => { setSubmissions(data); console.log(data); })
            .catch((err) => console.log(err))
    }, [assignmentId,userId])

    return (
        <>
            <div className="flex mt-2 justify-between">
                <p className="text-3xl py-2 ">Submissions</p>

            </div>

            
            <div className=" min-w-full pt-4  flex flex-col gap-2  rounded-2xl transition duration-1000">
                {submissions?.length === 0 ? 
                    <NullComponent
                        text={'No submissions found'}
                    />
                :
                  <> <p>There are total of {submissions?.length} submissions</p> 
                    {submissions.map((item) => (
                        <div key={item?.id} className="shadow-sm items-center rounded-2xl px-4 gap-2 flex cursor-pointer transition w-full 
                                    hover:bg-slate-300  ">
                            <div className="flex-1">{1}</div>
                            <div className=" flex-1 flex-col items-center">
                                <p className="text-lg">{item?.user?.name}</p>
                                <p className="text-sm">{item?.user?.email}</p>
                            </div>
                            <div className="flex-1">{item?.AIscore}</div>
                            <div className="flex-1">{item?.time.slice(11, 19)}</div>
                            <div className="px-4 hover:bg-blue-100 border-1 rounded-2xl">
                                <a href={`${API_URL}/files/${item?.file}.txt`} target="_blank">View</a>
                            </div>


                        </div>
                    )) || null}
                    </>
                }
            </div>
        </>
    )
}
