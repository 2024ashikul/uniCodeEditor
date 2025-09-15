import { useParams } from "react-router-dom";
import CodeEditor from "../src/components/CodeEditor";
import NavBar from "../src/components/NavBar";
import { useContext, useEffect, useState } from "react";
import { AccessContext } from "../src/Contexts/AccessContext/AccessContext";
import { AuthContext } from "../src/Contexts/AuthContext/AuthContext";


export default function EditorPage() {
    const { userId,token } = useContext(AuthContext);
    const {problemId} = useParams();
    const {checkAccess} = useContext(AccessContext);
    const [authorized,setAuthorized] = useState(null);
    useEffect(()=>{
        if(!userId || !token) return;
        checkAccess({problemId ,token , userId})
        .then((isAuthorized)=> {
            if(isAuthorized){ setAuthorized(true)}else{
                setAuthorized(false)
            }
        })
    },[checkAccess, problemId,userId,token])
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