import { useState, useEffect, useContext } from "react";
import PageTitle from "../../SharedComponents/PageTitle";
import Button from "../../SharedComponents/Button";
import InlineButton from "../../SharedComponents/InlineButton";
import { UIContext } from "../../../Contexts/UIContext/UIContext";
import MDEditor from "@uiw/react-md-editor";
import { AlertContext } from "../../../Contexts/AlertContext/AlertContext";
import { API_URL } from "../../../config";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";
import LoadingParent from "../../SharedComponents/LoadingParent";


function ProblemCard({ problem, onEdit, onDelete ,index}) {
    return (
        <div className="bg-white shadow-lg rounded-2xl p-5 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            {/* Header */}
            <div className="flex justify-between items-start">
                <h3 className="text-base font-semibold text-gray-900 leading-snug">
                 { index+1 }. {problem.title}
                </h3>
                <span className="text-sm font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                    {problem.fullmarks} Marks
                </span>
            </div>

            {/* MCQ Options */}
            {problem.type === "MCQ" && problem.options?.length > 0 && (
                <div className="mt-4">
                    <ul className="space-y-2">
                        {problem.options.map((opt, i) => (
                            <li
                                key={i}
                                className={`px-3 py-2 rounded-lg border text-sm ${opt === problem.correctAnswer
                                        ? "bg-green-50 border-green-400 text-green-700 font-medium"
                                        : "bg-gray-50 border-gray-200 text-gray-700"
                                    }`}
                            >
                                {opt}
                                {opt === problem.correctAnswer && (
                                    <span className="ml-2 text-xs font-semibold text-green-600">
                                        ✓ Correct
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Short Question Answer */}
            {problem.type === "ShortQuestion" && (
                <div className="mt-3 text-sm">
                    <span className="font-semibold text-gray-800">Answer:</span>{" "}
                    <span className="text-gray-700">{problem.correctAnswer}</span>
                </div>
            )}

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 mt-5 border-t pt-3">
                <button
                    onClick={onEdit}
                    className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                    ✏️ Edit
                </button>
                <button
                    onClick={onDelete}
                    className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                    🗑️ Delete
                </button>
            </div>
        </div>

    );
}


const defaultMCQState = {
    title: "",
    options: ["", ""],
    correctAnswer: "",
    fullMarks: "",
};

function MCQForm({ initialData, onSubmit, onCancel }) {
    const [form, setForm] = useState(initialData || defaultMCQState);
    console.log(form);
    useEffect(() => {
        setForm(initialData || defaultMCQState);
    }, [initialData]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleOptionChange = (index, value) => {
        const newOptions = [...form.options];
        newOptions[index] = value;
        setForm({ ...form, options: newOptions });
    };

    const addOption = () => {
        setForm({ ...form, options: [...form.options, ""] });
    };

    const removeOption = (index) => {
        setForm({ ...form, options: form.options.filter((_, i) => i !== index) });
    };

    const handleSubmit = (e) => {
        console.log("nre");
        e.preventDefault();
        if (!form.title || !form.fullMarks || form.options.some(opt => !opt) || !form.correctAnswer) {
            alert("Please fill all fields.");
            return;
        }
        onSubmit(form);
    };


    return (
        <form onSubmit={handleSubmit} className="bg-gray-50  rounded-xl p-4 space-y-4">
            <div>
                <label className="text-sm font-medium">Question</label>
                <input
                    type="text" name="title" value={form.title} onChange={handleChange}
                    placeholder="Enter question" className="w-full border-[0.5px] p-2 rounded text-sm mt-1" required
                />
            </div>
            <div>
                <label className="text-sm font-medium">Full Marks</label>
                <input
                    type="number" name="fullMarks" value={form.fullMarks} onChange={handleChange}
                    placeholder="e.g., 5" className="w-full border-[0.5px] p-2 rounded text-sm mt-1" required
                />
            </div>
            <div>
                <label className="text-sm font-medium">Options</label>
                <div className="space-y-2 mt-1">
                    {form.options.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <input
                                type="text" value={opt} onChange={(e) => handleOptionChange(i, e.target.value)}
                                placeholder={`Option ${i + 1}`} className="flex-1 border-[0.5px] p-2 rounded text-sm" required
                            />
                            <button type="button" onClick={() => removeOption(i)} className="text-red-500 hover:text-red-700 text-xl">
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-between gap-4">
                <select name="correctAnswer" value={form.correctAnswer} onChange={handleChange} className="flex-1 border-[0.5px] p-2 rounded text-sm" required>
                    <option value="">Select Correct Answer</option>
                    {form.options.filter(opt => opt).map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                </select>
                <button type="button" onClick={addOption} className="px-3 py-1 border-[0.5px] rounded text-sm hover:bg-gray-100">
                    ➕ Add Option
                </button>
            </div>
            <div className="flex justify-end gap-2  pt-3 mt-3">
                <button type="button" className="bg-green-500 px-4 py-1 rounded-2xl hover:cursor-pointer text-white transition" onClick={onCancel} >Cancel </button>
                <button type="submit" className="bg-green-500 px-4 py-1 rounded-2xl hover:cursor-pointer text-white transition">{initialData ? "Update MCQ" : "Save MCQ"}</button>
            </div>
        </form>
    );
}


const defaultShortQuestionState = {
    title: "",
    correctAnswer: "",
    fullMarks: "",
};

function ShortQuestionForm({ initialData, onSubmit, onCancel }) {
    const [form, setForm] = useState(initialData || defaultShortQuestionState);

    useEffect(() => {
        setForm(initialData || defaultShortQuestionState);
    }, [initialData]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title || !form.fullMarks) {
            alert("Please fill all fields.");
            return;
        }
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 border-[0.5px] rounded-xl p-4 space-y-4">
            <div>
                <label className="text-sm font-medium">Question</label>
                <input
                    type="text" name="title" value={form.title} onChange={handleChange}
                    placeholder="Enter the question" className="w-full border-[0.5px] p-2 rounded text-sm mt-1" required
                />
            </div>
            <div>
        <label className="text-sm font-medium">Correct Answer</label>
        <input
            type="text" name="correctAnswer" value={form.correctAnswer} onChange={handleChange}
            placeholder="Enter the correct answer" className="w-full border-[0.5px] p-2 rounded text-sm mt-1" required
        />
    </div>
            
            <div>
                <label className="text-sm font-medium">Full Marks</label>
                <input
                    type="number" name="fullMarks" value={form.fullMarks} onChange={handleChange}
                    placeholder="e.g., 10" className="w-full border-[0.5px] p-2 rounded text-sm mt-1" required
                />
            </div>

            <div className="flex justify-end gap-2  pt-3 mt-3">
                <button type="button" onClick={onCancel}  className="bg-green-500 px-4 py-1 rounded-2xl hover:cursor-pointer text-white transition">Cancel</button>
                <button type="submit" className="bg-green-500 px-4 py-1 rounded-2xl hover:cursor-pointer text-white transition">{initialData ? "Update Question" : "Save Question"} </button>
            </div>
        </form>
    );
}


export default function Problems({ assessmentId }) {

    const [problems, setProblems] = useState([]);
    const [activeFilter, setActiveFilter] = useState("MCQ");
    const [formType, setFormType] = useState(null);
    const [editingProblem, setEditingProblem] = useState(null);

    const { setMessage, setType } = useContext(AlertContext);
    const { token } = useContext(AuthContext);
    console.log({ activeFilter, formType, editingProblem });
    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const res = await fetch(`${API_URL}/problem/fetchall`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ assessmentId }),
                });
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                console.log(data);
                setProblems(data);
            } catch (err) {
                console.error("Failed to fetch problems:", err);
                setMessage("Failed to load problems");
                setType("error");
            }
        };
        if (assessmentId) fetchProblems();
    }, [assessmentId, token, setMessage, setType]);
    console.log(problems);

    const handleFormSubmit = async (formData) => {
        console.log(formData)
        if (editingProblem) {
            await updateProblem({ ...formData, problemId: editingProblem.id });
        } else {
            await createProblem(formData, formType);
        }
    };

    const createProblem = async (form, type) => {
        try {
            console.log({ assessmentId, form, type });
            const res = await fetch(`${API_URL}/problem/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ assessmentId, form, type }),
            });


            if (!res.ok) {
                const errorData = await res.json();
                console.error("Server responded with an error:", errorData);
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            console.log(data);
            setProblems((prev) => [...prev, data.newProblem]);
            setMessage(data.message || "Problem created successfully!");
            setType("success");
            setFormType(null);
        } catch (err) {
            console.log(err);
            setMessage("Could not create problem. Check the console for details.");
            setType("error");
        }
    };

    const updateProblem = async (form) => {
        try {
            console.log(form);
            const res = await fetch(`${API_URL}/problem/update`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({form,type :form.type, editProblemId:form.problemId}),
            });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            setProblems(
                problems.map((p) => (p.id === data.problem.id ? data.problem : p))
            );
            setMessage(data.message);
            setType("success");
            setEditingProblem(null);
            setFormType(null);
        } catch (err) {
            console.log(err);
            setMessage("Could not update problem");
            setType("error");
        }
    };

    const deleteProblem = async (problemId) => {
        if (!confirm("Are you sure you want to delete this problem?")) return;
        try {
            const res = await fetch(`${API_URL}/problem/delete`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ problemId }),
            });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            setProblems((prev) => prev.filter((p) => p.id !== problemId));
            setMessage(data.message);
            setType("success");
        } catch (err) {
            console.log(err);
            setMessage("Failed to delete problem");
            setType("error");
        }
    };

    const handleAddNew = (type) => {
        setEditingProblem(null);
        setFormType(type);
    };

    const handleEdit = (problem) => {
        setEditingProblem(problem);
        setFormType(problem.type);
    };

    const handleCancelForm = () => {
        setEditingProblem(null);
        setFormType(null);
    };

    const filteredProblems = problems?.filter((p) => p.type == activeFilter) || [];
    console.log(filteredProblems);
    if (problems === null) {
        return <LoadingParent />;
    }

    return (
        <div className="mt-2">
            <div className="grid grid-cols-12 gap-6">

                <div className="col-span-8">
                    {/* <PageTitle text={`${activeFilter === "MCQ" ? "MCQs" : "Short Questions"} (${filteredProblems.length})`} /> */}
                    <ul className="flex justify-center  ">
                        <li className="flex-1">
                            <button onClick={() => setActiveFilter("MCQ")} className={`w-full  text-center px-4 py-2 rounded-md ${activeFilter === "MCQ" ? "bg-green-400 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
                                MCQs
                            </button>
                        </li>
                        <li className="flex-1">
                            <button onClick={() => setActiveFilter("ShortQuestion")} className={`w-full text-center px-4 py-2 rounded-md ${activeFilter === "ShortQuestion" ? "bg-green-400 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
                                Short Questions
                            </button>
                        </li>
                    </ul>
                    <div className="mt-4 space-y-4 max-h-[75vh] overflow-y-auto pr-2">
                        {filteredProblems.length > 0 ? (
                            filteredProblems.map((problem,index) => (
                                <ProblemCard key={problem.id} problem={problem} onEdit={() => handleEdit(problem)} index={index} onDelete={() => deleteProblem(problem.id)} />
                            ))
                        ) : (
                            <div className="text-center text-gray-500 mt-10">
                                No {activeFilter === "MCQ" ? "MCQs" : "Short Questions"} found. Add one!
                            </div>
                        )}
                    </div>
                </div>


                <div className="col-span-4">
                    {formType ? (
                        <div>
                            <h3 className="text-lg font-semibold mb-3">
                                {editingProblem ? `Edit ${formType}` : `Add New ${formType}`}
                            </h3>
                            {formType === "MCQ" && <MCQForm initialData={editingProblem} onSubmit={handleFormSubmit} onCancel={handleCancelForm} />}
                            {formType === "ShortQuestion" && <ShortQuestionForm initialData={editingProblem} onSubmit={handleFormSubmit} onCancel={handleCancelForm} />}
                        </div>
                    ) : (
                        <div className="space-y-3 flex flex-col">
                            <h3 className="text-lg text-center font-semibold mb-3">Actions</h3>
                            <button onClick={() => handleAddNew("MCQ")} className="bg-amber-300 rounded-2xl px-4 py-2 text-center">➕ Add New MCQ</button>
                            <button onClick={() => handleAddNew("ShortQuestion")} className=" bg-amber-300 rounded-2xl px-4 py-2  text-center">➕ Add New Short Question</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}