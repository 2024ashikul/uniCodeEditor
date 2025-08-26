
import { useContext, useState } from "react";
import { AuthContext } from "../src/Contexts/AuthContext/AuthContext";
import { AlertContext } from "../src/Contexts/AlertContext/AlertContext";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../src/config";


export default function SignUp() {
     const navigate = useNavigate();
    const { setType, setMessage } = useContext(AlertContext);


    const [form, setForm] = useState({
        name: '',
        email: ''
    });

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        console.log(form);
        try {
            const res = await fetch(`${API_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ form })
            })
            const data =await res.json()
            if(res.ok){
                console.log(data)
                setMessage(data.message)
                setType(data.type)
                navigate('/login')
            }else{
                setType(data.type)
                setMessage(data.message)
            }
        }catch(err){
            console.log(err);
            setType('error');
            setMessage('An error occured');
        }

    }

    return (
        <>



            <div className="flex flex-col gap-2 items-center justify-between mt-20 ">
                <div className="flex text-2xl self-center justify-between">Sign Up</div>
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
                        Sign Up</button></div>

                    <div className="border px-10 py-1 rounded-2xl transition duration-500
                        hover:bg-blue-500 hover:text-white hover:transition hover:duration-500"
                        onClick={() => navigate('/signup')}>
                        Have an Account ?  Log in </div>
                </form>
            </div>
        </>
    )
}