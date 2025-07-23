import { useState, useEffect, useContext } from "react";
import PageTitle from "../PageTitle";
import Button from "../Button";
import PopUp from "../PopUp";
import { UIContext } from "../../Contexts/UIContext/UIContext";
import MDEditor from "@uiw/react-md-editor";

export default function Problems({ assignmentId }) {
    const [problems, setProblems] = useState([]);
    const [problem, setProblem] = useState(false);
    const { popUp, setPopUp } = useContext(UIContext);
    const [markDownValue, setMarkDownValue] = useState("");
    const [form, setForm] = useState({
        title: '',
        statement: ''
    })
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });




    const createProblem = async (e) => {
        console.log("here")
        form.statement = markDownValue;
        e.preventDefault();
        console.log(form)
        await fetch('http://localhost:3000/createproblem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ assignmentId, form })
        })
            .then((res) => res.json())
            .then((data) => { 
                console.log(data); 
                setProblems(prev => [...prev, data]); 
                setPopUp(false);
                setProblem(false);})
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        fetch('http://localhost:3000/fetchproblems', {
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

    const PopUpCode = (<form method="POST" onSubmit={createProblem} className="flex flex-col h-full gap-2 items-center justify-center" onChange={handleChange}>
        <div className="px-10 py-6 w-full max-w-2xl mx-auto space-y-4  rounded-xl">

            <div className="flex items-center gap-4">
                <label className="w-28 text-gray-700 font-medium" htmlFor="title">
                    Title
                </label>
                <input
                    required
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Enter title"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>


            <div className="flex items-start gap-4">
                <label className="w-28 text-gray-700 font-medium pt-2" htmlFor="description">
                    Statement
                </label>
                <MDEditor
                    value={markDownValue}
                    onChange={setMarkDownValue}
                />

            </div>
        </div>


        <div onClick={() => { }}><button type="submit" className="border px-10 py-1 rounded-2xl transition duration-500
                        hover:bg-blue-500 hover:text-white hover:transition hover:duration-500">
            Create</button></div>
    </form>);



    return (
        <>
            <div className={`flex flex-col ${popUp && 'transition duration-500 blur pointer-events-none'}`}>
                <div className="flex mt-2 justify-between">
                    <PageTitle
                        text={`Problems ${problems.length}`}
                    />
                    <Button
                        onClickAction={() => setProblem(true)}
                        buttonLabel={'Create a new Problem'}
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
                                <div className="justify-end" >Edit</div>
                            </div>





                            <div className="pl-8 py-2 flex-1 overflow-hidden">
                                <MDEditor.Markdown source={item.statement} />
                            </div>

                        </div>
                    ))}




                </div>


            </div>
            {problem &&
                <PopUp
                    name={problem}
                    setName={setProblem}
                    onSubmit={createProblem}
                    onChange={handleChange}
                    extraFields={null}
                    title={'Problem'}
                    buttonTitle={'Create a new Problem'}
                    ManualCode={PopUpCode}
                    ManualEdit={true}
                />
            }
        </>
    )
}