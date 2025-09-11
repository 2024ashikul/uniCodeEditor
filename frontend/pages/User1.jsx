import { useContext, useEffect, useState } from "react"

import { AuthContext } from "../src/Contexts/AuthContext/AuthContext"
import { AlertContext } from "../src/Contexts/AlertContext/AlertContext";
import { UIContext } from "../src/Contexts/UIContext/UIContext";

import TopBanner from "../src/components/SharedComponents/TopBanner";

import { API_URL } from "../src/config";
import RoomSection from "../src/components/Home1.jsx/RoomSection";
import { ActivityIcon } from "lucide-react";
import ActivitySection from "../src/components/Home1.jsx/ActivitySection";
import { AccessContext } from "../src/Contexts/AccessContext/AccessContext";
import LoadingFullscreen from "../src/components/SharedComponents/LoadingScreen";


export default function User1() {
    const {   userName,userId } = useContext(AuthContext);
    const [authorized, setAuthorized] = useState(null);
    
    const { setTitle } = useContext(UIContext);
    const {checkAccess} = useContext(AccessContext);
    useEffect(() => {
        if(!userId){
            return;
        }
        setAuthorized(true);
        //  const verifyAccess = async () => {
        //     const auth = await checkAccess({  });
        //     if (auth && auth.allowed) {
        //         setAuthorized(true);
                
        //     } else {
        //         setAuthorized(false);
                
        //     }
        // };
        // verifyAccess();
        // return () => {
        //     setAuthorized(null);
        // };

    }, [checkAccess,userId])


    

    useEffect(() => {
        setTitle('Hi ' + (userName || '') + '!   Welcome to Uni Code Lab');
    }, [setTitle, userName]);

    if(authorized===null) return (<LoadingFullscreen />)
    if(!authorized) return (<p>You are not allowed</p>)

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
