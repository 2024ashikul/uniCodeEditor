import { useContext } from "react";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { useEffect } from "react";
import { AlertContext } from "../src/Contexts/AlertContext/AlertContext";
import { AuthContext } from "../src/Contexts/AuthContext/AuthContext";
import { API_URL } from "../src/config";
export default function Login() {
    const navigate = useNavigate();
    const { token, setToken, setEmail } = useContext(AuthContext);


    const { setMessage } = useContext(AlertContext);
    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    useEffect(() => {
    if (token) {
        try {
            const decoded = jwtDecode(token);
            if (decoded) {
                navigate('/user');
            }
        } catch (err) {
            console.log(err)
            navigate('/login');
        }
    }
}, [token]);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ form })
            })
            const data = await res.json();
            if (res.ok && data.token) {
                localStorage.setItem("token", data.token);
                setToken(data.token);
                setEmail(data.user.email);
                if(data.user.profile_pic){
                    localStorage.setItem("profile_pic",data.user.profile_pic);
                }
                if(data.user.name){
                    localStorage.setItem("name",data.user.name);
                }
                setMessage('Logged in successfully');
            } else {
                setMessage(data?.message || 'Failed to login');
            }
        } catch (err) {
            console.error(err);
            setMessage('Network error! Try Again!');
        }

    }

    return (
        <>
            <div className="flex flex-col  mx-50 rounded-4xl shadow-2xl py-10 gap-8 items-center justify-between mt-20 ">
                <div className="flex text-3xl gap-8 self-center font-bold justify-between">Log In</div>
                <form method="POST" onSubmit={handleSubmit} className="flex flex-col h-full gap-2 items-center justify-center min-w-[4xl]" >
                    <div className="px-10  gap-8 py-6 w-full min-w-3xl mx-auto space-y-4  rounded-xl">

                        <div className="flex items-start gap-4">
                            <label className="w-28 text-gray-700 font-medium pt-2" htmlFor="email">
                                Email
                            </label>
                            <input required
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter email"
                                value={form.email}
                                autoComplete="on"
                                onChange={handleChange}
                                className="flex-1  px-4 py-2 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="w-28 text-gray-700 font-medium" htmlFor="password">
                                Password
                            </label>
                            <input
                                required
                                id="name"
                                name="password"
                                type="text"
                                placeholder="Your Password"
                                autoComplete="on"
                                value={form.password}
                                onChange={handleChange}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>


                    <div className="flex flex-col items-center gap-4 mt-6">

                        <button
                            type="submit"
                            className="w-80 py-2 rounded-2xl bg-green-400 text-white font-semibold
               shadow-md hover:bg-blue-500 hover:scale-105 transition duration-300"
                        >
                            Log In
                        </button>


                        <div
                            onClick={() => navigate('/signup')}
                            className="w-80 py-2 rounded-2xl bg-green-400 text-white font-semibold text-center
               shadow-md cursor-pointer hover:bg-blue-500 hover:scale-105 transition duration-300"
                        >
                            Don’t have an Account? Sign up
                        </div>
                    </div>

                </form>
            </div>
        </>
    )
}