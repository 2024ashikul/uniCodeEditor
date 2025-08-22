import { useNavigate } from "react-router-dom"


export default function Home() {

    const navigate = useNavigate();

    return (
        <>
            <div className="flex flex-col gap-2">
                <button
                    onClick={() => navigate('/editor')}
                    className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 hover:font-semibold hover:text-white text-black rounded-xl shadow-md transition">
                    Code Now
                </button>
                <button
                    onClick={() => navigate('/collaborate')}
                    className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 hover:font-semibold hover:text-white text-black rounded-xl shadow-md transition">
                    MeetCode
                </button>
                <button
                    onClick={() => navigate('/collaborate')}
                    className="px-6 py-3 bg-red-500 hover:bg-cyan-600 hover:font-semibold hover:text-white text-black rounded-xl shadow-md transition">
                    CollabCode
                </button>
            </div>
        </>
    )
}