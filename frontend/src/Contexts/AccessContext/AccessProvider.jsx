import { useCallback, useRef, useState } from "react";
import { AccessContext } from "./AccessContext";
import { useContext } from "react";
import { AuthContext } from "../AuthContext/AuthContext";
import { API_URL } from "../../config";



export const AccessProvider = ({ children }) => {
    const [authorized, setAuthorized] = useState(false);
    const [role, setRole] = useState(null);
    const { userId,token } = useContext(AuthContext);
    const accessCache = useRef({});

    const checkAccess = useCallback(async ({ assignmentId, roomId, problemId }) => {
        try {

            const key = `${assignmentId}-${roomId}-${problemId}`;
            console.log(key);
            if (accessCache.current[key] !== undefined) {
                return accessCache.current[key]; // return cached result
            }
            const res = await fetch(`${API_URL}/room/getuseraccess`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization : `Bearer ${token}`
                },
                body: JSON.stringify({ assignmentId, roomId, userId, problemId })
            });

            const data = await res.json();
            
            return data;
        } catch (err) {
            console.error('Access check failed:', err);
            setAuthorized(false);
            return false;
        }
    }, [userId,token]);


    return (
        <AccessContext.Provider value={{ authorized, setAuthorized, checkAccess, role, setRole }}>
            {children}
        </AccessContext.Provider>
    )
}