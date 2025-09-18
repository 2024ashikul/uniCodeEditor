import { useContext } from "react"
import { UIContext } from "../../Contexts/UIContext/UIContext"
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";


export default function TopBar({ tabs, activeTab, setActiveTab }) {
    const { popUp } = useContext(UIContext);
    const navigate = useNavigate();
    return (
        <>
            <div className={`flex text-center font-mono sticky rounded-3xl top-10 z-50 shadow-md
                ${popUp && 'transition duration-500 blur pointer-events-none'}`} >
                <div className="gap-2 px-2 justify-center rounded-3xl bg-blue-50 py-2 transition flex duration-500"
                    onClick={() => navigate(-1)}
                >
                    <ChevronLeft />
                </div>
                {
                    tabs?.map(tab => (

                        <div
                            key={tab.keyword}
                            className={`flex-1 gap-2 shadow-sm border-b border-green-100 justify-center ${activeTab != tab.keyword && 'hover:bg-blue-200 hover:cursor-pointer'} rounded-3xl bg-blue-50 py-2 transition flex duration-500 
                            ${activeTab === tab.keyword ? 'bg-blue-400 text-white font-extrabold' : ''}`}
                            onClick={() => setActiveTab(tab.keyword)}>
                            {tab.icon ? <span><tab.icon /></span> : ''} <div>{tab.title}</div>
                        </div>
                    ))}
            </div>
        </>
    )
}