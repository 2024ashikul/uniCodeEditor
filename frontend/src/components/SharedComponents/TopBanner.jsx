import { useContext } from "react"
import { UIContext } from "../../Contexts/UIContext/UIContext"



export default function TopBanner({ extraInfo }) {
    
    
    const { title } = useContext(UIContext);
    return (
        <>
            <div className="flex flex-col">

                <div className="text-4xl text-indigo-400 text-center px-4 pt-4 pb-1 m-0">
                    {title}
                </div>

                <div className="flex justify-center text-center mb-3">
                    {extraInfo}
                </div>
            </div>
        </>
    )
}