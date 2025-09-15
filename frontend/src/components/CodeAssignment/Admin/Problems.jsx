import { useState, useEffect, useContext } from "react";
import PageTitle from "../../SharedComponents/PageTitle";
import Button from "../../SharedComponents/Button";
import PopUp from "../../SharedComponents/PopUp";
import { UIContext } from "../../../Contexts/UIContext/UIContext";
import MDEditor from "@uiw/react-md-editor";
import { AlertContext } from "../../../Contexts/AlertContext/AlertContext";
import NullComponent from "../../SharedComponents/NullComponent";
import InlineButton from "../../SharedComponents/InlineButton";
import { API_URL } from "../../../config";
import { sendAIRequest } from "../../../AIRequest";
import FloatingAIBox from "../../SharedComponents/FloatingAIBox";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";
import LoadingParent from "../../SharedComponents/LoadingParent";


export default function Problems({ assessmentId }) {
    const [isAIOpen, setIsAIOpen] = useState(false);
    const [problems, setProblems] = useState(null);
    const [problem, setProblem] = useState(false);
    const [edit, setEdit] = useState(false);           
    const [editProblemId, setEditProblemId] = useState(null);
    const [activeProblem, setActiveProblem] = useState(null);
    const { setMessage, setType } = useContext(AlertContext);
    const { popUp, setPopUp } = useContext(UIContext);
    const { token } = useContext(AuthContext);
    const [form, setForm] = useState({
        title: '',
        statement: '',
        fullmarks: ''
    })

    const handleChange = e => { setForm({ ...form, [e.target.name]: e.target.value }) };

    const createProblem = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/problem/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ assessmentId, form })
            })

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            setProblems(prev =>
                [...prev, data.newProblem]);
            setProblem(false);
            setActiveProblem(data.newProblem);
            setMessage(data.message);
        }
        catch (err) {
            console.log(err)
            setMessage('Could not  create problem')
        }
    }

    const updateProblem = async (e) => {
        e.preventDefault();
        console.log(form)
        try {
            const res = await fetch(`${API_URL}/problem/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ editProblemId, form })
            })

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            console.log(data);
            setProblems(prev =>
                prev.map(p => p.id === editProblemId ? data.problem : p)
            );
            setPopUp(false);
            setEdit(false);
            setMessage(data.message);
            setActiveProblem(data.problem);

        } catch (err) {
            console.log(err)
            setMessage('Could not  create problem')
        }
    }

    const deleteProblem = async (problemId) => {
        try {
            const res = await fetch(`${API_URL}/problem/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ problemId })
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();

            setProblems(prev => {
                const updated = prev.filter(problem => problem.id !== problemId);
                setActiveProblem(updated[0] || null);
                return updated;
            });
            setMessage(data.message)

        } catch (err) {
            console.log(err);
            setMessage('Failed to delete')
            setType('error')
        }
    }

    async function handleSend(input) {
        const res = await sendAIRequest('generate/problem', input);
        console.log(res);
        setForm((prev) => ({
            ...prev,
            statement: res,
        }));
    }


    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const res = await fetch(`${API_URL}/problem/fetchall`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ assessmentId })
                })

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                setProblems(data);
                setActiveProblem(data[0]);

            } catch (err) {
                console.error("Failed to fetch lessons:", err);
            }
        };
        if (assessmentId) {
            fetchProblems();
        }
    }, [assessmentId, token])


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

            <div className="flex items-center gap-4">
                <label className="w-28 text-gray-700 font-medium" htmlFor="fullmarks">
                    Full marks
                </label>
                <input
                    required
                    id="fullmarks"
                    name="fullmarks"
                    type="number"
                    value={form.fullmarks}
                    placeholder="Enter Full fullmarks"
                    onChange={handleChange}

                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>


            <div className="flex flex-col items-start gap-4">
                <div className="flex justify-between">
                    <label className=" text-gray-700 font-medium pt-2" htmlFor="description">
                        Statement :
                    </label>

                    <button type="button" onClick={() => setIsAIOpen(true)}>use AI </button>
                    <FloatingAIBox
                        isOpen={isAIOpen}
                        onClose={() => setIsAIOpen(false)}
                        onSend={handleSend}
                    />
                </div>
                <MDEditor
                    className="w-full"
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

            <div className="flex items-center gap-4">
                <label className="w-28 text-gray-700 font-medium" htmlFor="fullmarks">
                    Full marks
                </label>
                <input
                    required
                    id="fullmarks"
                    name="fullmarks"
                    type="number"
                    value={form.fullmarks}
                    placeholder="Enter Full fullmarks"
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
                        text={`Problems ${problems === null ? 0 : problems.length}`}
                    />
                    <Button
                        onClickAction={() => setProblem(true)}
                        buttonLabel={'Create a new Problem'}
                    />
                </div>

                {/* <div className=" min-w-full pt-4  flex flex-col gap-2  rounded-2xl transition duration-1000">
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
                                        <div className="px-4">
                                            Full fullmarks : {item.fullmarks}
                                        </div>
                                        <div className="justify-end " >
                                            <InlineButton
                                                buttonLabel={'Edit'}
                                                onClickAction={() => {
                                                    setEditProblemId(item.id);
                                                    setForm({ title: item.title, statement: item.statement, fullmarks: item.fullmarks });
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

                </div> */}

                {problems === null ? <LoadingParent />
                    :


                    <div className="grid pt-8 grid-cols-16 gap-4">


                        <div className="col-span-3 flex flex-col">
                            {

                                problems.map((item, index) => (
                                    activeProblem === item ?
                                        <div key={index} className=" bg-green-400 w-full text-lg px-4 py-2" onClick={() => setActiveProblem(item)}>
                                            Problem {index + 1}
                                        </div>
                                        : <div key={index} className="bg-cyan-100 w-full text-lg px-4 py-2" onClick={() => setActiveProblem(item)}>
                                            Problem {index + 1}
                                        </div>
                                ))}

                        </div>
                        <div className="col-span-13">

                            {
                                activeProblem &&
                                <div className="shadow-md border-fuchsia-200 flex-col rounded-2xl transition duration-500 flex w-full "
                                >
                                    <div className="flex flex-1 bg-gray-200 gap-2 rounded-2xl items-center px-4">

                                        <div className="flex flex-1">
                                            <div className="px-4 py-2 flex-1 text-xl self-center">{activeProblem.title}</div>
                                        </div>
                                        <div className="px-4">
                                            Full marks : {activeProblem.fullmarks}
                                        </div>
                                        <div className="justify-end " >
                                            <InlineButton
                                                buttonLabel={'Edit'}
                                                onClickAction={() => {
                                                    setEditProblemId(activeProblem.id);
                                                    setForm({ title: activeProblem.title, statement: activeProblem.statement, fullmarks: activeProblem.fullmarks });
                                                    setEdit(true);
                                                }}
                                            />
                                        </div>

                                        <div className="justify-end" >
                                            <InlineButton
                                                buttonLabel={'Delete'}
                                                onClickAction={() => {
                                                    if (confirm("Are you sure you want to delete this problem?")) {
                                                        deleteProblem(activeProblem.id);
                                                    }

                                                }}
                                            /> </div>
                                    </div>

                                    <div className="pl-8 py-2 flex-1 overflow-hidden">
                                        <MDEditor.Markdown source={activeProblem.statement} />
                                    </div>

                                </div>
                            }
                        </div>

                    </div>

                }


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
            </div>

        </>
    )
}