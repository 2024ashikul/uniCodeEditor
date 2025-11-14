import {  CircleX } from "lucide-react"

 
export default function NotFound(){

    return(
        <>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white w-120 p-6 rounded-xl shadow-xl text-center flex flex-col items-center gap-4">

                    <div className="flex items-center justify-center">
                        <CircleX className="h-16 w-16"/>
                    </div>

                    <p className="text-lg font-medium text-gray-800">
                        Not Found !!!
                    </p>
                    <a href="/user" className="bg-blue-200 px-4 py-2">Go To Home Page</a>

                </div>
            </div>
        </>
    )
}