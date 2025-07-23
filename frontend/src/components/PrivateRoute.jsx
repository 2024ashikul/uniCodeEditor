import { useContext } from "react";
import { AuthContext } from "../Contexts/AuthContext/AuthContext";
import { Navigate } from "react-router-dom";


export default function PrivateRoute({children}){
    const {user} = useContext(AuthContext);
    return user ? children : <Navigate to='/login' />
};