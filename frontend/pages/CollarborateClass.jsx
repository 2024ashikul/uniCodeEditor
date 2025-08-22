import { useState } from "react";
import CodeEditorCollaborateClass from "../src/components/CodeEditorCollaborateClass";
import NavBar from "../src/components/NavBar";


export default function CollaborateClass(){
    const [isEditor,setIsEditor] = useState(null);
        const [username,setUserName] = useState(null);
        const [id, setId] = useState('');
        function join(){
            setIsEditor(false);
        }
    
        function create(){
            setIsEditor(true);
        }
        if(isEditor==null){
    return (
        <>
        <NavBar />
                        <div className="flex flex-col gap-2 items-center justify-between mt-20 ">
                    <div className="flex text-2xl self-center justify-between">Collaborate Class</div>
                    <div className="flex flex-col h-full gap-2 items-center justify-center" >
                        <div className="px-10 py-6 w-full max-w-2xl mx-auto space-y-4  rounded-xl">

                            <div className="flex items-center gap-4">
                                <label className="w-28 text-gray-700 font-medium" htmlFor="name">
                                    Your Name
                                </label>
                                <input
                                placeholder="Your name"
                                    onChange={(e) => setId(e.target.value)}
                                    type="text" name="collarborateId" id="id"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>


                            <div className="flex items-start gap-4">
                                <label className="w-28 text-gray-700 font-medium pt-2" htmlFor="email">
                                    User Name
                                </label>
                                <input
                                    placeholder="Your username"
                                    onChange={(e) => setUserName(e.target.value)}
                                    type="text" name="userName" id="almost"
                                    className="flex-1  px-4 py-2 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>



                        <button type="button" className="border w-40 px-10 py-1 rounded-2xl transition duration-500
                        hover:bg-blue-500 bg-gray-300 hover:text-white hover:transition hover:duration-500"
                            onClick={join}
                        >Join</button>
                        <button type="button" className="border w-40 px-10 py-1 rounded-2xl transition duration-500
                        hover:bg-blue-500 bg-gray-300 hover:text-white hover:transition hover:duration-500"
                            onClick={create}
                        >Create</button>


                    </div>
                </div>
        </>
    )}
    return (
        <>
        <div className="flex flex-col h-screen">
            <NavBar />
         <CodeEditorCollaborateClass  isEditor={isEditor}  roomId={id} username={username}/>
</div>
         </>
    )
}