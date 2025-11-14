import { useCallback, useRef, useState } from "react";
import { AccessContext } from "./AccessContext";
import { useContext } from "react";
import { AuthContext } from "../AuthContext/AuthContext";
import { API_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import { AlertContext } from "../AlertContext/AlertContext";



export const AccessProvider = ({ children }) => {
    const [authorized, setAuthorized] = useState(null);
    const [role, setRole] = useState(null);
    // const { userId, token } = useContext(AuthContext);
    const accessCache = useRef({});
    const { setMessage } = useContext(AlertContext);
    const navigate = useNavigate();
    const checkAccess = useCallback(async ({ assessmentId, roomId, userId, token, problemId }) => {
        try {
            
            const key = `${assessmentId}-${roomId}-${problemId}`;
            console.log(key);
            if (accessCache.current[key] !== undefined) {
                return accessCache.current[key];
            }
            const res = await fetch(`${API_URL}/check-access`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ assessmentId, roomId, userId, problemId })
            });
            if (!navigator.onLine) {
                setMessage("You are offline. Check internet connection.");
            }
            

            if (res.status === 401) {
                setMessage("Your session has expired. Please log in again.");
                localStorage.removeItem("token");
                navigate("/login");
                return { allowed: false };
            } else if (res.status === 403) {
                setMessage("Access denied. You are not allowed to view this page.");
                
                return { allowed: false  };
            }

            const data = await res.json();


            return data;
        } catch (err) {
            if (err.message === "Failed to fetch") {
                setMessage( "Cannot reach server. Try again later.");
            }
            console.error('Access check failed:', err);
            setAuthorized(false);
            return false;
        }
    }, [setMessage]);


    return (
        <AccessContext.Provider value={{ authorized, setAuthorized, checkAccess, role, setRole }}>
            {children}
        </AccessContext.Provider>
    )
}