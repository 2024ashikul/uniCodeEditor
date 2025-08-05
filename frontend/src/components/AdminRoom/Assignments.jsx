import { useState, useEffect, useContext } from "react";
import PopUp from "../PopUp"

import { useNavigate } from "react-router-dom";
import PageTitle from "../PageTitle";
import Button from "../Button";
import { UIContext } from "../../Contexts/UIContext/UIContext";
import NullComponent from "../NullComponent";
import { AlertContext } from "../../Contexts/AlertContext/AlertContext";

export default function Assignements({ roomId }) {
    const {popUp ,setPopUp,setTitle } = useContext(UIContext);
    const [form, setForm] = useState({
        title: '',
        description: ''
    });

    const {setMessage , setType} = useContext(AlertContext);
    const [assignment, setAssignment] = useState(false);
    const [assignments, setAssignments] = useState([]);
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
    useEffect(() => {
        fetch('http://localhost:3000/assignments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomId })
        })
            .then((res) => res.json())
            .then((data) => { console.log(data); setAssignments(data) })
            .catch((err) => console.log(err))
    }, [roomId])
    const navigate = useNavigate();

    const createAssignment = async (e) => {
        e.preventDefault();
        console.log(form);
        try{
        const res = await fetch('http://localhost:3000/updateassignment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomId, form })
        })
        const data = await res.json();
            if(res.ok){
                console.log(data); 
                setAssignment
                setMessage(data.message)
                setPopUp(false);
                setAssignment(false);
            }
            
    }catch(err){ console.log(err);
            setMessage('Internal server error');
            setType('error') 
        }
    }



    return (
        <>
            <div className={`flex flex-col ${ popUp && 'transition duration-500 blur pointer-events-none'} `}>
                <div className="flex mt-2 justify-between">
                    <PageTitle
                        text={'Assignments'}
                    />
                    <Button
                        onClickAction={() => setAssignment(true)}
                        buttonLabel={'Create a new Assignment'}
                    />
                </div>
                <div className=" min-w-full pt-4  flex flex-col gap-2  rounded-2xl transition duration-1000">
                    {
                    assignments.length === 0 ? 
                    <NullComponent text={'No assignments found'} />
                    
                   : assignments.map((item, i) => (
                        <div className="shadow-sm items-center rounded-2xl cursor-pointer transition flex w-full 
                                  hover:bg-slate-300
                                    "
                            key={i}
                            onClick={() => {setTitle(item.title); navigate(`/assignment/${item.id}`) }}>

                            <div className="px-4 py-2 flex-1">{item.id}</div>
                            <div className="px-4 py-2 flex-1">{item.title}</div>
                            <div className="px-4 py-2 flex-1">{item.createdAt.slice(2, 10)}</div>
                            <div className="px-4 py-2 flex-1 whitespace-pre-line  overflow-hidden">{item.description}</div>
                            <div className="px-4 py-2 flex-1">{item.status.toUpperCase()}</div>
                        </div>
                    ))}

                </div>
            </div>
            {assignment &&
                <PopUp
                    
                    form = {form}
                    name={assignment}
                    setName={setAssignment}
                    onChange={handleChange}
                    onSubmit={createAssignment}
                    extraFields={null}
                    title={'Create a new Asssignment'}
                    buttonTitle={'Create Assignment'}
                />
            }

        </>
    )
}