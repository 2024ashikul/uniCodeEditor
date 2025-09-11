import { useState } from "react"
import { AuthContext } from "./AuthContext";
import { useEffect } from "react";
import { jwtDecode } from 'jwt-decode';

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState(null);
    const [userId , setUserId] = useState(null);
    const [userName , setUserName] = useState(null);


    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if(!storedToken) return ;
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);                
                setUserName(decoded.username);
                setEmail(decoded.email);
                setUserId(decoded.userId);
                setUser(decoded);
                setToken(storedToken);
            } catch (err) {
                console.error("Invalid token", err);
                localStorage.removeItem("token");
            }
        }
    }, []);


    return (
        <AuthContext.Provider value={{ token, setToken, user, setUser, email, setEmail, userId, setUserId,userName, setUserName }}>
            {children}
        </AuthContext.Provider>

    )
}