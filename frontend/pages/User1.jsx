import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../src/Contexts/AuthContext/AuthContext"
import { AlertContext } from "../src/Contexts/AlertContext/AlertContext";
import { UIContext } from "../src/Contexts/UIContext/UIContext";

import TopBanner from "../src/components/SharedComponents/TopBanner";

import { API_URL } from "../src/config";
import RoomSection from "../src/components/Home1.jsx/RoomSection";
import { ActivityIcon } from "lucide-react";
import ActivitySection from "../src/components/Home1.jsx/ActivitySection";


export default function User1() {
    const navigate = useNavigate();
    const {  token, userName } = useContext(AuthContext);
    const { setMessage, setType } = useContext(AlertContext);
    const { setTitle } = useContext(UIContext);
    
    useEffect(() => {
        if (!token) {
            setMessage('Log in to access this page');
            setType('warning');
            navigate('/login');
        }
    }, [token, setMessage, setType, navigate]);


    

    useEffect(() => {
        setTitle('Hi ' + (userName || '') + '!   Welcome to Uni Code Lab');
    }, [setTitle, userName]);

    return (
        <div className="flex mx-10 flex-col">
            <TopBanner />
            <div className="grid pt-10 gap-8 grid-cols-3">

                <div className="col-span-2">
                    <RoomSection />
                </div>
                <div className="">
                    <ActivitySection />
                </div>
            </div>
        </div>
    )
}
