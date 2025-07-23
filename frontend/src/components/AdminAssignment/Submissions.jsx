import { useState, useEffect } from "react";



export default function Submissions({ assignmentId }) {

    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/getsubmissions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ assignmentId })
        })
            .then((res) => res.json())
            .then((data) => { setSubmissions(data); console.log(data); })
            .catch((err) => console.log(err))
    }, [assignmentId])
    return (
        <>
            <div className="flex mt-2 justify-between">
                <p className="text-3xl py-2 ">Submissions</p>

            </div>

            There are total of {submissions?.length} submissions
            <div className=" min-w-full pt-4  flex flex-col gap-2  rounded-2xl transition duration-1000">
                {submissions?.length === 0 ? 'no SUbmittiosn found' :

                    submissions.map((item) => (
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
                                <a href={`http://localhost:3000/files/${item?.file}.txt`} target="_blank">View</a>
                            </div>
                            <div className="px-4 w-auto hover:bg-blue-100 border-1 rounded-2xl">
                                <a href={`http://localhost:3000/files/${item?.file}.${item?.ext}`} className="items-center justify-between" target="_blank">Download</a>
                            </div>

                        </div>
                    )) || null}
            </div>
        </>
    )
}