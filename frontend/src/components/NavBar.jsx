import { useContext } from "react"
import { UIContext } from "../Contexts/UIContext/UIContext"
import { useNavigate } from "react-router-dom";


export default function NavBar() {
    const navigate = useNavigate();
    const { navCenter } = useContext(UIContext);
    return (
        <div className="px-3 py-1 text-lg items-center flex bg-gray-400  justify-center sticky top-0 z-50">
            <div className=" text-white flex-1 justify-start cursor-pointer" onClick={() => navigate('/')}> Uni Code Lab </div>
            <div className={`justify-center flex px-4 overflow-hidden text-white flex-1 transition-opacity duration-500 ${navCenter != null ? 'opacity-100' : 'opacity-0'}`}>
                {navCenter}
            </div>
            <div className="flex flex-1 justify-end">
                temp
            </div>
        </div>
    )
}