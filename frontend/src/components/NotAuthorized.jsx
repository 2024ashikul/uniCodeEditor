import { Ban } from "lucide-react"

 
export default function NotAuthorized(){

    return(
        <>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white w-120 p-6 rounded-xl shadow-xl text-center flex flex-col items-center gap-4">

                    <div className="flex items-center justify-center">
                        <Ban className="h-16 w-16"/>
                    </div>

                    <p className="text-lg font-medium text-gray-800">
                        You are not allowed to view this page!!!
                    </p>
                    <a href="/user" className="bg-blue-200 px-4 py-2">Go To Home Page</a>

                </div>
            </div>
        </>
    )
}