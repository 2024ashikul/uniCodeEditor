
import { useContext } from "react";


import { useNavigate } from "react-router-dom";
import { AuthContext } from "../src/Contexts/AuthContext/AuthContext";
import { AlertContext } from "../src/Contexts/AlertContext/AlertContext";


export default function HomePage() {

    const navigate = useNavigate();
    const { setMessage } = useContext(AlertContext);
    const { token } = useContext(AuthContext);
    console.log(token);

    if (token) {
        setTimeout(() => {
            setMessage('Welcome!!!');
            navigate('/user');
        }, 1000);

    }

    return (
        <>

            <div
                className="min-h-screen fade-in transition-all duration-500 bg-cover bg-center flex items-center justify-center px-6"
                style={{ backgroundImage: "url('../pages/background.jpg')" }}
            >
                <div className="bg-black bg-opacity-60 rounded-2xl p-10 text-center shadow-2xl animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-down">
                        Welcome to Uni Code Editor
                    </h1>

                    <div className="flex flex-col md:flex-row gap-4 justify-center mt-6 animate-fade-up">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition">
                            Log In
                        </button>
                        <button
                            onClick={() => navigate('/signup')}

                            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition">
                            Sign Up
                        </button>
                        <button
                            onClick={() => navigate('/editor')}
                            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl shadow-md transition">
                            Code Now
                        </button>
                        <button
                            onClick={() => navigate('/collaborateclass')}
                            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black rounded-xl shadow-md transition">
                            ClassCode
                        </button>
                                                <button
                            onClick={() => navigate('/collaborate')}
                            className="px-6 py-3 bg-red-500 hover:bg-cyan-600 text-black rounded-xl shadow-md transition">
                            CollabCode
                        </button>
                    </div>
                </div>
            </div>



        </>
    )
}