import { useContext, useEffect } from "react"
import { Users, Notebook, Megaphone } from 'lucide-react';
import { useState } from "react";
import { useParams } from "react-router-dom";


import { UIContext } from "../src/Contexts/UIContext/UIContext";
import { AccessContext } from "../src/Contexts/AccessContext/AccessContext";
import UserRoom from "./UserRoom";
import AdminRoom from "./AdminRoom";
 

export default function Room() {

    const { roomId } = useParams();
    const { setTitle, setScrollHeight } = useContext(UIContext);
    const [authorized, setAuthorized] = useState(null);
    const [role, setRole] = useState(null);
    
    const { checkAccess } = useContext(AccessContext);

    useEffect(() => {
        
        checkAccess({ roomId })
            .then((auth) => {
                console.log(auth)
                if (auth.allowed === true) {
                    setAuthorized(true);
                    setRole(auth.role);
                    console.log({ role, authorized })
                }
                else {
                    setAuthorized(false)
                    console.log({ role, authorized })
                }
            })

    }, [checkAccess, roomId, setAuthorized, setRole,authorized,role])

    useEffect(() => {
        setTitle('This Is room')
        setScrollHeight(80);
    }, [setTitle, setScrollHeight])



    if (authorized === null) return (<p>Loading</p>)
    if (!authorized) return (<p>Not Authorized</p>)

    return (
        <>
            {role === 'user' ? <UserRoom /> : role === 'admin' ? <AdminRoom /> : 'NOT AUTHORIZED'}

        </>

    )
}