import { useCallback, useRef, useState } from "react";
import { AccessContext } from "./AccessContext";
import { useContext } from "react";
import { AuthContext } from "../AuthContext/AuthContext";
import { API_URL } from "../../config";

import { useNavigate } from "react-router-dom";
import { AlertContext } from "../AlertContext/AlertContext";



export const AccessProvider = ({ children }) => {
    const [authorized, setAuthorized] = useState(false);
    const [role, setRole] = useState(null);
    const { userId, token } = useContext(AuthContext);
    const accessCache = useRef({});
    const { setMessage } = useContext(AlertContext);
    const navigate = useNavigate();
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
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ assignmentId, roomId, userId, problemId })
            });


            if (res.status === 401) {
                setMessage("Your session has expired. Please log in again.");
                localStorage.removeItem("token");
                navigate("/login");
                return { allowed: false };
            } else if (res.status === 403) {
                setMessage("Access denied. You are not allowed to view this page.");
                navigate("/user");
                return { allowed: false };
            }

            const data = await res.json();


            return data;
        } catch (err) {
            console.error('Access check failed:', err);
            setAuthorized(false);
            return false;
        }
    }, [userId, token,setMessage]);


    return (
        <AccessContext.Provider value={{ authorized, setAuthorized, checkAccess, role, setRole }}>
            {children}
        </AccessContext.Provider>
    )
}