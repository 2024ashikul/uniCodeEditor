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

    useEffect(() => {
        if (token) {
            navigate('/user')
        }
    }, [token, navigate])

    const { setMessage } = useContext(AlertContext);
    const [form, setForm] = useState({
        name: '',
        email: ''
    });
    useEffect(() => {
        if (token != null) {
            const decoded = jwtDecode(token);
            console.log(token);
            if (decoded) {
                navigate('/user');
            }
            else {
                navigate('/login');
            }
        }
    }, [token, navigate])

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            console.log(form);
            const res = await fetch(`${API_URL}/login`, {
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
                setEmail(data.email);
                setMessage('Logged in successfully');
                navigate('/user');
            } else {
                setMessage(data?.message || 'Failed to login');
            }
        } catch (err) {
            console.error(err);
            setMessage('An error occured');
        }

    }

    return (
        <>
            <div className="flex flex-col gap-2 items-center justify-between mt-20 ">
            <div className="flex text-2xl self-center justify-between">Log In</div>
            <form method="POST" onSubmit={handleSubmit} className="flex flex-col h-full gap-2 items-center justify-center" >
                <div className="px-10 py-6 w-full max-w-2xl mx-auto space-y-4  rounded-xl">

                    <div className="flex items-center gap-4">
                        <label className="w-28 text-gray-700 font-medium" htmlFor="name">
                            Name
                        </label>
                        <input
                            required
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Your Name"
                            value={form.name}
                            onChange={handleChange}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>


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
                            onChange={handleChange}
                            className="flex-1  px-4 py-2 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>


                <div><button type="submit" className="border px-10 py-1 rounded-2xl transition duration-500
                        hover:bg-blue-500 hover:text-white hover:transition hover:duration-500">
                    Log In</button></div>

                <div className="border px-10 py-1 rounded-2xl transition duration-500
                        hover:bg-blue-500 hover:text-white hover:transition hover:duration-500"
                        onClick={()=> navigate('/signup')}>
                    Don't have an Account ?  Sign up </div>
            </form>
</div>
        </>
    )
}