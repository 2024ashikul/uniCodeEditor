import { useParams } from "react-router-dom";
import CodeEditor from "../src/components/CodeEditor";
import NavBar from "../src/components/NavBar";
import { useContext, useEffect, useState } from "react";
import { AccessContext } from "../src/Contexts/AccessContext/AccessContext";


export default function EditorPage() {
    const {problemId} = useParams();
    const {checkAccess} = useContext(AccessContext);
    const [authorized,setAuthorized] = useState(null);
    useEffect(()=>{
        checkAccess({problemId})
        .then((isAuthorized)=> {
            if(isAuthorized){ setAuthorized(true)}else{
                setAuthorized(false)
            }
        })
    },[checkAccess, problemId])
    if(authorized===null) return (<p>Loading</p>);
    if(!authorized) return (<p>Not authorized</p>);

    return (
        <>
            <div className="flex flex-col h-screen">
                <NavBar></NavBar>
                <CodeEditor problemId={problemId}></CodeEditor>
            </div>
        </>
    )
}