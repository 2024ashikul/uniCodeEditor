import { useContext } from "react"
import { UIContext } from "../Contexts/UIContext/UIContext"
import { useNavigate } from "react-router-dom";
import { MessageSquareText, User } from "lucide-react";
import { API_URL } from "../config";


export default function NavBar() {
    const navigate = useNavigate();
    const { navCenter } = useContext(UIContext);
    const profile_pic = localStorage.getItem("profile_pic");
    const name = localStorage.getItem("name");
    console.log(profile_pic);
    return (
        <div className="px-3 py-1 text-lg h-10 items-center flex bg-gray-400  justify-center sticky top-0 z-50">
            <div className=" text-white  justify-start cursor-pointer" onClick={() => navigate('/user')}> Uni Code Lab </div>
            <div className={`justify-center flex px-4 overflow-hidden text-white flex-1 transition-opacity duration-500 ${navCenter != null ? 'opacity-100' : 'opacity-0'}`}>
                {navCenter}
            </div>
            <div className="  gap-2 flex items-center">
                <div className="flex  justify-end">
                    <MessageSquareText onClick={() => navigate('/profile')} />
                </div>
                <div className="flex  justify-end ">
                    {
                        profile_pic ?
                            <img
                                src={`${API_URL}/profilephotos/${profile_pic}`}
                                alt={
                                    'profile-photo'
                                }
                                className="h-8 w-8 rounded-full" />
                            :
                                name ? 

                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                                {name[0].toUpperCase()}
                            </div>
                            : <User className="w-8 h-8" />
                    }

                </div>
            </div>
        </div>
    )
}