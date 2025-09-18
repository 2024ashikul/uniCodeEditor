import { useState, useEffect, useContext } from "react";
import MDEditor from "@uiw/react-md-editor";
import { AlertContext } from "../../../Contexts/AlertContext/AlertContext";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";
import { sendAIRequest } from "../../../AIRequest";
import PageTitle from "../../SharedComponents/PageTitle";
import NullComponent from "../../SharedComponents/NullComponent";
import LoadingParent from "../../SharedComponents/LoadingParent";
import FloatingAIBox from "../../SharedComponents/FloatingAIBox";
import { APIRequest } from "../../../APIRequest";

function ProblemForm({ initialFormState, handleSubmit, handleCancel, submitButtonText }) {
    const [form, setForm] = useState(initialFormState);
    const [isAIOpen, setIsAIOpen] = useState(false);
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleAISend = async (input) => {
        const res = await sendAIRequest('generate/problem', input);
        setForm(prev => ({ ...prev, statement: res }));
        setIsAIOpen(false);
    };

    const onFormSubmit = (e) => {
        e.preventDefault();
        handleSubmit(form);
    };

    return (
        <form onSubmit={onFormSubmit} className="flex flex-col h-full gap-4 items-center justify-center p-4 bg-gray-50 rounded-lg">
            <div className="w-full gap-2 max-w-full  mx-auto space-y-4">
                <div className="flex items-center  gap-4">
                    {/* <div className="flex-1"> */}
                    <label className=" text-gray-700 font-medium" htmlFor="title">Title</label>
                    <input required id="title" name="title" type="text" value={form.title} placeholder="Enter title" onChange={handleChange} className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    {/* </div> */}
                    {/* <div className="flex items-center gap-4"> */}
                    <label className=" text-gray-700 font-medium" htmlFor="fullmarks">Full Marks</label>
                    <input required id="fullmarks" name="fullmarks" type="number" value={form.fullmarks} placeholder="Enter Full marks" onChange={handleChange} className=" px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    {/* </div> */}
                </div>

                <div className="flex flex-col items-start gap-2">
                    <div className="flex justify-between w-full items-center">
                        <label className="text-gray-700 font-medium" htmlFor="description">Statement</label>
                        <button type="button" onClick={() => setIsAIOpen(true)} className="text-blue-500 hover:underline">Use AI ✨</button>
                        <FloatingAIBox isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} onSend={handleAISend} />
                    </div>
                    <MDEditor className="w-full min-h-[500px]" value={form.statement} onChange={(value) => setForm({ ...form, statement: value })} />
                </div>
            </div>
            <div className="flex gap-4">
                <button type="button" onClick={handleCancel} className="border px-10 py-2 rounded-2xl transition duration-300 hover:bg-gray-200">
                    Cancel
                </button>
                <button type="submit" className="border px-10 py-2 rounded-2xl transition duration-300 bg-blue-500 text-white hover:bg-blue-600">
                    {submitButtonText}
                </button>
            </div>
        </form>
    );
}

function DisplayProblem({ problem, onEdit, onDelete }) {
    return (
        <div className="p-6 bg-white shadow-md rounded-lg mt-4">
            <div className="flex justify-between items-center pb-4 border-b">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{problem?.title}</h2>
                    <p className="text-gray-500">Full Marks: {problem?.fullmarks}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={onEdit} className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition">Edit</button>
                    <button onClick={onDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">Delete</button>
                </div>
            </div>
            <div className="pt-4">
                <MDEditor.Markdown source={problem?.statement} style={{ padding: 15 }} />
            </div>
        </div>
    );
}

function InitialView({ onCreate, onUpload }) {
    return (
        <div className="flex flex-col justify-center items-center font-bold min-h-[400px] mx-auto text-center">
            <p className="text-xl text-gray-600 mb-6">You have not set the Task Yet!</p>
            <div className="flex gap-4">
                <button onClick={onUpload} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                    Upload PDF (Coming Soon)
                </button>
                <button onClick={onCreate} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                    Create Manually
                </button>
            </div>
        </div>
    );
}

export default function Problems({ assessmentId }) {
    const [view, setView] = useState('loading'); // 'loading', 'choose', 'display', 'create', 'edit'
    const [problem, setProblem] = useState(null);
    const { setMessage } = useContext(AlertContext);
    const { token } = useContext(AuthContext);
    const { request } = APIRequest();

    const EMPTY_FORM = { title: '', statement: '', fullmarks: '' };

    useEffect(() => {
        const fetchProblem = async () => {
            if (!assessmentId) return;
            try {
                setView('loading');
                const data = await request("/problem/fetchone/project", { body: { assessmentId } });
                console.log(data)
                if (data.problem) {
                    setProblem(data.problem);
                    setView('display');
                } else {
                    setProblem(null);
                    setView('choose');
                }
            } catch (err) {
                console.error("Failed to fetch problem:", err);
                setView('choose');
            }
        };
        fetchProblem();
    }, [assessmentId, token]);

    const handleCreateProblem = async (form) => {
        try {
            const data = await request("/problem/create", { body: { assessmentId, form, type: "ProjectAssignment" } });
            setProblem(data.newProblem);
            setView('display');
        } catch (err) {
            console.error(err);
            setMessage('Could not create problem');
        }
    };

    const handleUpdateProblem = async (form) => {
        try {
            const data = await request("/problem/update", { body: { editProblemId: problem.id, form, type: "ProjectAssignment" } });
            setProblem(data.problem);
            setView('display');
            setMessage(data.message || 'Problem updated successfully!');
        } catch (err) {
            console.error(err);
            setMessage('Could not update problem');
        }
    };

    const handleDeleteProblem = async () => {
        if (!window.confirm("Are you sure you want to delete this problem?")) return;
        try {
            await request("/problem/delete", { body: { problemId: problem.id} });
            setProblem(null);
            setView('choose');
        } catch (err) {
            console.error(err);
            setMessage('Failed to delete problem');
        }
    };

    const renderContent = () => {
        switch (view) {
            case 'loading':
                return <LoadingParent />;
            case 'choose':
                return <InitialView onCreate={() => setView('create')} onUpload={() => alert('Upload feature coming soon!')} />;
            case 'display':
                return <DisplayProblem problem={problem} onEdit={() => setView('edit')} onDelete={handleDeleteProblem} />;
            case 'create':
                return <ProblemForm initialFormState={EMPTY_FORM} handleSubmit={handleCreateProblem} handleCancel={() => setView('choose')} submitButtonText="Create Task" />;
            case 'edit':
                return <ProblemForm initialFormState={problem} handleSubmit={handleUpdateProblem} handleCancel={() => setView('display')} submitButtonText="Update Task" />;
            default:
                return <NullComponent text="Something went wrong." />;
        }
    };

    return (
        <div className="flex flex-col">
            <div className="flex mt-2 justify-between">
                <PageTitle text="Assignment Task" />
            </div>
            <div className="mt-4">
                {renderContent()}
            </div>
        </div>
    );
}