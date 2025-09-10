import { useContext } from "react";
import { AuthContext } from "./Contexts/AuthContext/AuthContext";

import { API_URL } from "./config";
import { useNavigate } from "react-router-dom";
import { AlertContext } from "./Contexts/AlertContext/AlertContext";


export function APIRequest() {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const {setMessage} = useContext(AlertContext);
    const request = async (endpoint, { method = 'POST', body } = {}) => {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        if (res.status === 401) {
            setMessage("Your session has expired. Please log in again.");
            localStorage.removeItem("token");
            navigate("/login"); 
            
        }else if (res.status === 403) {
            setMessage("You are not allowed to view that page!");
            navigate("/user");

        }

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    };

    return { request };

}