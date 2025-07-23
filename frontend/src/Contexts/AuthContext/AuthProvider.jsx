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

        if (storedToken) {
            try {
                const decoded = jwtDecode(token);
                setUserName(decoded.name);
                console.log(userName);
                setEmail(decoded.email);
                console.log(email);
                setUserId(decoded.userId);
                const payload = JSON.parse(atob(storedToken.split('.')[1]));
                setUser(payload);
                setToken(storedToken);
            } catch (err) {
                console.error("Invalid token", err);
                localStorage.removeItem("token");
            }
        }
    }, [token, email,userName]);





    // useEffect(()=>{
    //     const token1 = localStorage.getItem('tokenUser');
    //     setIsLoggedIn(token1 ? true : false);

    //     const token2 = localStorage.getItem('tokenAdmin');
    //     setIsAdmin(token2 ? true : false);

    //     const username = localStorage.getItem('username');
    //     if(username){
    //         setUserName(username);
    //     }
    // },[]);



    return (
        <AuthContext.Provider value={{ token, setToken, user, setUser, email, setEmail, userId, setUserId,userName, setUserName }}>
            {children}
        </AuthContext.Provider>

    )
}