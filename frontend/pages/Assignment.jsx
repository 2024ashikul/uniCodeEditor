import { useParams } from "react-router-dom";
import { UIContext } from "../src/Contexts/UIContext/UIContext";
import { useContext, useEffect, useState } from "react";
import { AccessContext } from "../src/Contexts/AccessContext/AccessContext";
import UserAssignment from "./UserAssignment";
import AdminAssignment from "./AdminAssignment";
import LoadingFullscreen from "../src/components/SharedComponents/LoadingScreen";
import { AuthContext } from "../src/Contexts/AuthContext/AuthContext";


export default function Assignment() {

    const { assignmentId } = useParams();
    const { setTitle, setScrollHeight } = useContext(UIContext);
    const [authorized, setAuthorized] = useState(null);
    const [role, setRole] = useState(null);
    const { checkAccess } = useContext(AccessContext);
    const {userId} = useContext(AuthContext);
    useEffect(() => {
        if(!userId){
            return;
        }
        
         const verifyAccess = async () => {
            const auth = await checkAccess({ assignmentId });
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

    }, [checkAccess,userId, assignmentId])

    useEffect(() => {
        setTitle('Assignment');
        setScrollHeight(100);
    }, [setTitle, setScrollHeight])

    if(authorized === null) return <LoadingFullscreen />;


    return (
        <>
            {role === 'member' ? <UserAssignment /> : role === 'admin' ? <AdminAssignment />  : <LoadingFullscreen />}
        </>
    )

}