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
        hi
        <input className="border"
            onChange={(e)=>setId(e.target.value)}
        type="text" name="collarborateId" id="id" /> 

                <input className="border"
            onChange={(e)=>setUserName(e.target.value)}
        type="text" name="userName" id="almost" /> 

        <button
            type="button" 
            className="border"
            onClick={create}
            >
                Create
            </button>
        <button type="button" className="border"
            onClick={join}
        >Join</button>
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