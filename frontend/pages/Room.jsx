import { useContext, useEffect } from "react"

import { useState } from "react";
import { useParams } from "react-router-dom";



import { AccessContext } from "../src/Contexts/AccessContext/AccessContext";
import UserRoom from "./UserRoom";
import AdminRoom from "./AdminRoom";
import LoadingFullscreen from "../src/components/SharedComponents/LoadingScreen";
import { AuthContext } from "../src/Contexts/AuthContext/AuthContext";
import { UIContext } from "../src/Contexts/UIContext/UIContext";
 

export default function Room() {

    const { roomId } =  useParams();
    const {setTitle} = useContext(UIContext);
    const {authorized, setAuthorized } = useContext(AccessContext);
    const [role, setRole] = useState(null);
    const { userId ,token} = useContext(AuthContext);
    const { checkAccess } = useContext(AccessContext);

    useEffect(() => {
        if(!userId || !token){
            return;
        }
        
         const verifyAccess = async () => {
            const auth = await checkAccess({ roomId,token,userId });
            if (auth && auth.allowed) {
                console.log(auth);
                setAuthorized(true);
                setRole(auth.role);
                setTitle(auth.details.name);
                localStorage.setItem('title',auth.name);
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

    }, [checkAccess,userId,token, roomId])



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