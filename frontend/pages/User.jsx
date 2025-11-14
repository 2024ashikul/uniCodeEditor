import { useContext, useEffect, useState } from "react"
import ActivitySection from "../src/components/Home/ActivitySection"
import RoomSection from "../src/components/Home/RoomSection"

import LoadingFullscreen from "../src/components/SharedComponents/LoadingScreen";
import { AccessContext } from "../src/Contexts/AccessContext/AccessContext";
import TopBanner from "../src/components/SharedComponents/TopBanner";
import { UIContext } from "../src/Contexts/UIContext/UIContext";
import { AuthContext } from "../src/Contexts/AuthContext/AuthContext";
import FullPageMessage from "../src/components/FullPageMessage";
import { Ban } from "lucide-react";
import NotAuthorized from "../src/components/NotAuthorized";
import { useNavigate } from "react-router-dom";

export default function User1() {
    const { userName, token, userId } = useContext(AuthContext);
    const [ authorized, setAuthorized ] = useState(false);
    const { setTitle } = useContext(UIContext);
    const { checkAccess } = useContext(AccessContext);
    const navigate = useNavigate();
    useEffect(() => {

        if (token === undefined || userId === undefined) {
            return;
        }
        if (!userId || !token) {
            
            navigate('/login');
            return;
        }
        const verifyAccess = async () => {
            const auth = await checkAccess({ userId, token });
            if (auth && auth.allowed) {
                setAuthorized(true);
            } else {
                setAuthorized(false);
            }
        };
        verifyAccess();
        return () => {
            setAuthorized(null);
        };

    }, [checkAccess, userId, token])

    useEffect(() => {
        setTitle('Hi ' + (userName || '') + '!   Welcome to Uni Code Lab');
    }, [setTitle, userName]);

    if (authorized === null) return (<LoadingFullscreen />)
    if (!authorized) return (<NotAuthorized />)

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
