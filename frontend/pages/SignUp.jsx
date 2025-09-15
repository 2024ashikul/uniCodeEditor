
import { useContext, useState } from "react";
import { AlertContext } from "../src/Contexts/AlertContext/AlertContext";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../src/config";


export default function SignUp() {
    const navigate = useNavigate();
    const { setType, setMessage } = useContext(AlertContext);

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        username: ''
    });

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        console.log(form);
        try {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ form })
            })
            const data = await res.json()
            if (res.ok) {
                console.log(data)
                setMessage(data.message)
                setType(data.type)
                navigate('/login')
            } else {
                setType(data.type)
                setMessage(data.message)
            }
        } catch (err) {
            console.log(err);
            setType('error');
            setMessage('An error occured');
        }
    }

    return (
        <>
            <div className="flex flex-col mx-50 rounded-4xl shadow-2xl py-10 gap-8 items-center justify-between mt-20 ">
                <div className="flex text-3xl gap-8 self-center justify-between font-bold">Sign Up</div>
                <form method="POST" onSubmit={handleSubmit} className="flex flex-col h-full gap-2 items-center justify-center" >
                    <div className="px-10 py-6 w-full min-w-3xl mx-auto space-y-4  rounded-xl">

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
                                autoComplete="on"
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
                                autoComplete="on"
                                onChange={handleChange}
                                className="flex-1  px-4 py-2 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-start gap-4">
                            <label className="w-28 text-gray-700 font-medium pt-2" htmlFor="username">
                                Username
                            </label>
                            <input required
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Enter your Username"
                                value={form.username}
                                onChange={handleChange}
                                className="flex-1  px-4 py-2 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-start gap-4">
                            <label className="w-28 text-gray-700 font-medium pt-2" htmlFor="password">
                                Password
                            </label>
                            <input required
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your Password"
                                value={form.password}
                                onChange={handleChange}
                                className="flex-1  px-4 py-2 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>


                    <div className="flex flex-col items-center gap-4 mt-6">
                        
                        <button
                            type="submit"
                            className="w-80 py-2 rounded-2xl bg-fuchsia-600 text-white font-semibold
               shadow-md hover:bg-fuchsia-700 hover:scale-105 transition duration-300"
                        >
                            Sign Up
                        </button>
                        <div
                            onClick={() => navigate('/login')}
                            className="w-80 py-2 rounded-2xl bg-green-400 text-white font-semibold text-center
               shadow-md cursor-pointer hover:bg-green-500 hover:scale-105 transition duration-300"
                        >
                            Have an Account? Log in
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}