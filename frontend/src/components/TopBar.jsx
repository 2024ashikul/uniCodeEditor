import { useContext } from "react"
import { UIContext } from "../Contexts/UIContext/UIContext"


export default function TopBar({ tabs ,activeTab, setActiveTab}) {
    const {popUp} = useContext(UIContext);
    return (
        <>
            <div className={`flex text-center sticky rounded-3xl top-10 z-50 shadow-md
                ${popUp && 'transition duration-500 blur pointer-events-none'}`} >
                {
                tabs?.map( tab => (
                    
                    <div 
                        key={tab.keyword} 
                        className={`flex-1 gap-2 justify-center rounded-3xl bg-blue-50 py-2 transition flex duration-500 
                            ${activeTab === tab.keyword ? 'bg-blue-400 text-white' : ''}`} 
                            onClick={() => setActiveTab(tab.keyword)}>
                              {tab.icon ?  <span><tab.icon /></span> : ''} <div>{tab.title}</div>
                    </div>
                ))}
            </div>
        </>
    )
}