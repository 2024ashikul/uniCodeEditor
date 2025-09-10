import { useContext, useEffect } from "react"
import { Users, Notebook, Megaphone } from 'lucide-react';
import { useState } from "react";
import { useParams } from "react-router-dom";


import { UIContext } from "../src/Contexts/UIContext/UIContext";
import { AccessContext } from "../src/Contexts/AccessContext/AccessContext";
import UserRoom from "./UserRoom";
import AdminRoom from "./AdminRoom";
import LoadingFullscreen from "../src/components/SharedComponents/LoadingScreen";
import { AuthContext } from "../src/Contexts/AuthContext/AuthContext";
 

export default function Room() {

    const { roomId } =  useParams();
    
    const [authorized, setAuthorized] = useState(null);
    const [role, setRole] = useState(null);
    const { userId } = useContext(AuthContext);
    const { checkAccess } = useContext(AccessContext);

    useEffect(() => {
        if(!userId){
            return;
        }
        
         const verifyAccess = async () => {
            const auth = await checkAccess({ roomId });
            if (auth && auth.allowed) {
                setAuthorized(true);
                setRole(auth.role);
            } else {
                setAuthorized(false);
                setRole(null); 
            }
        };
        verifyAccess();
        return () => {
            setAuthorized(null);
            setRole(null);
        };

    }, [checkAccess,userId, roomId])


    if (authorized === null) return (<LoadingFullscreen />)
    if (!authorized) return (<p>Not Authorized Go to home page</p>)

    return (
        <>
        <div className="">
            {role === 'member' ? <UserRoom /> : role === 'admin' ? <AdminRoom /> : 'NOT AUTHORIZED'}
        </div>
        </>

    )
}