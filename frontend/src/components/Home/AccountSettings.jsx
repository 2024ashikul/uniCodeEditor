import { useContext } from "react";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";


export default function AccountSettings() {

    const { setUserId, setEmail, setToken } = useContext(AuthContext);
    const navigate = useNavigate();
    function logOut() {
        localStorage.removeItem('token');
        setEmail(null);
        setToken(null);
        setUserId(null);
        navigate('/login')
    }

    return (
        <>
            <div>
                <button onClick={logOut}> log out</button>
            </div>
        </>
    )
}