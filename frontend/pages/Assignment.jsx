import { useParams } from "react-router-dom";
import { UIContext } from "../src/Contexts/UIContext/UIContext";
import { useContext, useEffect, useState } from "react";
import { AccessContext } from "../src/Contexts/AccessContext/AccessContext";
import UserAssignment from "./UserAssignment";
import AdminAssignment from "./AdminAssignment";
import LoadingFullscreen from "../src/components/SharedComponents/LoadingScreen";


export default function Assignment() {

    const { assignmentId } = useParams();
    const { setTitle, setScrollHeight } = useContext(UIContext);
    const [authorized, setAuthorized] = useState(null);
    const [role, setRole] = useState(null);
    const { checkAccess } = useContext(AccessContext);

    useEffect(() => {
        console.log(assignmentId);
        checkAccess({ assignmentId })
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

    }, [checkAccess, assignmentId, setAuthorized, setRole, authorized, role])

    useEffect(() => {
        setTitle('Assignment');
        setScrollHeight(100);
    }, [setTitle, setScrollHeight])

    if(authorized === null) return <LoadingFullscreen />;


    return (
        <>
            {role === 'member' ? <UserAssignment /> : role === 'admin' ? <AdminAssignment /> : 'NOT AUTHORIZED'}
        </>
    )

}