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
            <div className="bg-amber-300 justify-items-center rounded-2xl px-3 py-1 cursor-pointer items-center">
                <button
                    className="justify-center items-center"
                    onClick={logOut}> Log Out</button>
            </div>
        </>
    )
}