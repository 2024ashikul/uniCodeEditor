import { useState, useEffect, useContext } from "react";
import PageTitle from "../PageTitle";
import Button from "../Button";
import PopUp from "../PopUp";
import { UIContext } from "../../Contexts/UIContext/UIContext";
import MDEditor from "@uiw/react-md-editor";
import { AlertContext } from "../../Contexts/AlertContext/AlertContext";
import NullComponent from "../NullComponent";
import InlineButton from "../InlineButton";

export default function Problems({ assignmentId }) {
    const [problems, setProblems] = useState([]);
    const [problem, setProblem] = useState(false);
    const [edit, setEdit] = useState(false);           // for "Edit Problem" popup
    const [editProblemId, setEditProblemId] = useState(null);
    const { setMessage, setType } = useContext(AlertContext);
    const { popUp, setPopUp } = useContext(UIContext);
    // const [markDownValue, setMarkDownValue] = useState("");
    const [form, setForm] = useState({
        title: '',
        statement: ''
    })
    const handleChange = e => { setForm({ ...form, [e.target.name]: e.target.value }) };
    console.log(form);

    const createProblem = async (e) => {
        console.log("here")

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
                setProblem(false);
                setMessage('Problem created successfully')
            })
            .catch((err) => console.log(err))
    }

    const updateProblem = async (e) => {


        e.preventDefault();
        console.log(form)
        try {
            const res = await fetch('http://localhost:3000/updateproblem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ editProblemId, form })
            })
            const data = await res.json();
            if (res.ok) {
                console.log(data);
                setProblems(prev =>
                    prev.map(p => p.id === editProblemId ? data.problem : p)
                );
                setPopUp(false);
                setEdit(false);
                setMessage(data.message);
            }
        } catch (err) {
            console.log(err)
            setMessage('Problem created successfully')
        }
    }

    const deleteProblem = async (problemId) => {
        console.log("here")
        try {

            const res = await fetch('http://localhost:3000/deleteproblem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ problemId })
            });
            const data = await res.json();

            console.log(data);
            if (res.ok) {
                setProblems(prev => prev.filter(problem => problem.id !== problemId));
                setMessage(data.message)
            }

        } catch (err) {
            console.log(err);
            setMessage('Failed to delete')
            setType('error')
        }


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

    const PopUpCode = (<form method="POST" onSubmit={createProblem} className="flex flex-col h-full gap-2 items-center justify-center"
    >
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
                    value={form.title}
                    placeholder="Enter title"
                    onChange={handleChange}

                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>


            <div className="flex items-start gap-4">
                <label className="w-28 text-gray-700 font-medium pt-2" htmlFor="description">
                    Statement
                </label>
                <MDEditor
                    value={form.statement}
                    onChange={(value) => setForm({ ...form, statement: value })}
                />

            </div>
        </div>


        <div onClick={() => { }}><button type="submit" className="border px-10 py-1 rounded-2xl transition duration-500
                        hover:bg-blue-500 hover:text-white hover:transition hover:duration-500">
            Create</button></div>
    </form>);

    const PopUpCodeEdit = (<form method="POST" onSubmit={updateProblem} className="flex flex-col h-full gap-2 items-center justify-center"
    >
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
                    value={form.title}
                    placeholder="Enter title"
                    onChange={handleChange}

                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>


            <div className="flex items-start gap-4">
                <label className="w-28 text-gray-700 font-medium pt-2" htmlFor="description">
                    Statement
                </label>
                <MDEditor
                    value={form.statement}
                    onChange={(value) => setForm({ ...form, statement: value })}
                />

            </div>
        </div>


        <div onClick={() => { }}><button type="submit" className="border px-10 py-1 rounded-2xl transition duration-500
                        hover:bg-blue-500 hover:text-white hover:transition hover:duration-500">
            Update</button></div>
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
                    {
                        problems.length === 0 ?
                            <NullComponent

                                text={'No problems found'}
                            />
                            : problems.map((item, i) => (
                                <div className="shadow-md border-fuchsia-200 flex-col rounded-2xl transition duration-500 flex w-full "
                                    key={i}>
                                    <div className="flex flex-1 bg-gray-200 gap-2 rounded-2xl items-center px-4">
                                        <p>Problem {i + 1}</p>
                                        <div className="flex flex-1">
                                            <div className="px-4 py-2 flex-1 text-xl self-center">{item.title}</div>

                                        </div>
                                        <div className="justify-end " >
                                            <InlineButton
                                                buttonLabel={'Edit'}
                                                onClickAction={() => {
                                                    setEditProblemId(item.id);
                                                    setForm({ title: item.title, statement: item.statement });
                                                    setEdit(true);
                                                }}
                                            />
                                        </div>

                                        <div className="justify-end" >
                                            <InlineButton
                                                buttonLabel={'Delete'}
                                                onClickAction={() => deleteProblem(item.id)}
                                            /> </div>
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
                    form={form}
                />
            }

            {edit && (
                <PopUp
                    name={edit}
                    setName={setEdit}
                    title="Edit Problem"
                    ManualCode={PopUpCodeEdit}
                    ManualEdit={true}
                />
            )}


        </>
    )
}