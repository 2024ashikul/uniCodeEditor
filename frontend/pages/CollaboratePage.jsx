import { useState } from "react"
import Collaborate from "../src/components/Collaborate";
import { io } from "socket.io-client";
import CodeEditorCollaborate from "../src/components/CodeEditorCollaborate";

const socket = io('http://localhost:3000');

export default function CollaboratePage(){
    const [isEditor,setIsEditor] = useState(null);
    const [username,setUserName] = useState(null);
    const [id, setId] = useState('');
    function join(){
        setIsEditor(false);
    }

    function create(){
        setIsEditor(true);
    }
    console.log(id)

    if(isEditor==null){
    return (
        <>
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
        <CodeEditorCollaborate  isEditorProp={isEditor}  roomId={id} username={username}/>
    )
}