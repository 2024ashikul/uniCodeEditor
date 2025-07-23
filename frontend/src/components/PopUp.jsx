import { useContext, useEffect } from "react"
import { UIContext } from "../Contexts/UIContext/UIContext"


export default function PopUp({ name, setName, onSubmit, onChange, extraFields, title, buttonTitle,ManualEdit,ManualCode }) {
    const { setPopUp } = useContext(UIContext);
    
    useEffect(()=>{
        setPopUp(true);
    },[setPopUp])
    
    
    return (
        <>
            <div className={`${name ? 'opacity-100' : 'opacity-0'}
             px-4   bg-fuchsia-100 py-2 z-50 ease-in-out transition duration-500 my-12 flex inset-0 mx-auto  top-10 flex-col h-[500px] w-[700px] border rounded-2xl fixed
             `}
             >
                <button className="ml-auto" onClick={() => { setName(false); setPopUp(false) }}>Close</button>
                <p className="text text-3xl self-center">{title}</p>


                {ManualEdit ? ManualCode : 
                <form method="POST" onSubmit={onSubmit} className="flex flex-col h-full gap-2 items-center justify-center" onChange={onChange}>
                    <div className="px-10 py-6 w-full max-w-2xl mx-auto space-y-4  rounded-xl">

                        <div className="flex items-center gap-4">
                            <label className="w-28 text-gray-700 font-medium" htmlFor="title">
                                Title
                            </label>
                            <input
                                required
                                id="title"
                                name="title"
                                type="text"
                                placeholder="Enter title"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>


                        <div className="flex items-start gap-4">
                            <label className="w-28 text-gray-700 font-medium pt-2" htmlFor="description">
                                Description
                            </label>
                            <textarea required
                                id="description"
                                name="description"
                                placeholder="Enter description"
                                className="flex-1 h-28 px-4 py-2 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    {extraFields}

                    <div onClick={()=>{}}><button type="submit" className="border px-10 py-1 rounded-2xl transition duration-500
                        hover:bg-blue-500 hover:text-white hover:transition hover:duration-500">
                        {buttonTitle}</button></div>
                </form>
}

            </div>
        </>
    )
}