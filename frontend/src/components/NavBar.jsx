import { useContext } from "react"
import { UIContext } from "../Contexts/UIContext/UIContext"
import { useNavigate } from "react-router-dom";
import { MessageSquareText, User } from "lucide-react";


export default function NavBar() {
    const navigate = useNavigate();
    const { navCenter } = useContext(UIContext);
    return (
        <div className="px-3 py-1 text-lg items-center flex bg-gray-400  justify-center sticky top-0 z-50">
            <div className=" text-white  justify-start cursor-pointer" onClick={() => navigate('/user')}> Uni Code Lab </div>
            <div className={`justify-center flex px-4 overflow-hidden text-white flex-1 transition-opacity duration-500 ${navCenter != null ? 'opacity-100' : 'opacity-0'}`}>
                {navCenter}
            </div>
            <div className="  gap-2 flex">
                <div className="flex  justify-end">
                    <MessageSquareText onClick={() => navigate('/profile')} />
                </div>
                <div className="flex justify-end">
                    <User onClick={() => navigate('/profile')} />
                </div>
            </div>
        </div>
    )
}