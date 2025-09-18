import { useState, useEffect, useContext } from "react";
import { API_URL } from "../../../config";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";
import LoadingParent from "../../SharedComponents/LoadingParent";
import { AlertContext } from "../../../Contexts/AlertContext/AlertContext";

// Timer Component
function Timer({ duration, onTimeUp }) {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp();
            return;
        }
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, onTimeUp]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="text-right text-lg font-semibold text-red-600">
            Time Left: {formatTime(timeLeft)}
        </div>
    );
}

function ProblemCard({ problem, index, answers, setAnswers, isSubmitted }) {
    const handleAnswerChange = (value) => {
        setAnswers((prev) => ({ ...prev, [problem.id]: value }));
    };

    return (
        <div className="bg-white shadow-md rounded-xl w-[800px] p-4 border border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
                {index + 1}. {problem.title}{" "}
                <span className="ml-2 text-sm text-gray-600">({problem.fullmarks} marks)</span>
            </h3>

            {problem.type === "MCQ" && (
                <ul className="space-y-2">
                    {problem.options?.map((opt, i) => (
                        <li key={i} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name={`q-${problem.id}`}
                                value={opt}
                                checked={answers[problem.id] === opt}
                                onChange={(e) => handleAnswerChange(e.target.value)}
                                disabled={isSubmitted} // <-- Disable the input if submitted
                            />
                            <label className="text-sm">{opt}</label>
                        </li>
                    ))}
                </ul>
            )}

            {problem.type === "ShortQuestion" && (
                <textarea
                    className="w-full border rounded-md p-2 text-sm"
                    rows={3}
                    placeholder="Type your answer..."
                    value={answers[problem.id] || ""}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    disabled={isSubmitted} // <-- Disable the textarea if submitted
                />
            )}
        </div>
    );
}



export default function Problems({ assessmentId, duration = 600, phase }) {
    const [submitted, setSubmitted] = useState(false);
    const [problems, setProblems] = useState(null);
    const [answers, setAnswers] = useState({});
    const { token } = useContext(AuthContext);
    const { setMessage } = useContext(AlertContext);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const res = await fetch(`${API_URL}/problem/fetchall/quiz`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ assessmentId }),
                });
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                console.log(data);
                setProblems(data.problems);
                setSubmitted(data.submitted);
                if (data.submitted && data.submissions) {
                    const initialAnswers = {};
                    data.submissions.forEach(sub => {

                        initialAnswers[sub.problemId] = sub.submittedoption || sub.submittedanswer || '';
                    });
                    setAnswers(initialAnswers);
                }
            } catch (err) {
                console.error("Failed to fetch problems:", err);
            }
        };
        if (assessmentId) fetchProblems();
    }, [assessmentId, token]);

    const handleSubmit = async () => {

        if (Object.keys(answers).length === 0) {
            alert("Please answer at least one question before submitting.");
            return;
        }

        const payload = {
            assessmentId: assessmentId,
            answers: {},
        };

        problems.forEach(problem => {

            const userAnswer = answers[problem.id] || '';
            payload.answers[problem.id] = {
                answer: userAnswer,
                type: problem.type,
            };
        });

        console.log("Submitting payload:", payload);

        try {
            const res = await fetch(`${API_URL}/submission/bulk`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                throw new Error('Failed to submit answers.');
            }
            
            const result = await res.json();
            setMessage(result.message);

        } catch (err) {
            console.error(err);
            setMessage("An error occurred. Please try again.");
        }
    };

    if (problems === null) return <LoadingParent />;
    if (problems == []) return <p>no problems found</p>;
    return (
        <div className="mt-4 max-w-4xl mx-auto">



            {!submitted && phase == 'Finished' ?
                'Time is over' :
                submitted ?
                    'Already Submitted' :
                    phase == 'Finished' ?
                        'Quiz Finished'
                        :
                        <Timer duration={duration} onTimeUp={handleSubmit} />}



            <div className="space-y-6 mt-4">
                {problems.map((problem, index) => (
                    <ProblemCard
                        key={problem.id}
                        problem={problem}
                        index={index}
                        answers={answers}
                        setAnswers={setAnswers}
                        isSubmitted={submitted || phase=='Finished'}
                    />
                ))}
            </div>


            <div className="mt-8 text-center">

                <div className="bg-green-500 text-white px-6 py-2 rounded-2xl hover:bg-green-600 transition"
                >
                    {!submitted && phase == 'Finished' ?
                        'Time is over' :
                        submitted ?
                            'Already Submitted' :
                            phase == 'Finished' ?
                                'Quiz Finished'
                                :
                                <button
                                    onClick={handleSubmit}
                                >
                                    Submit Answers
                                </button>
                    }
                </div>

            </div>
        </div>
    );
}
