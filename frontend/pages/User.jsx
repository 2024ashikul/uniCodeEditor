import {  useContext } from "react"
import { AuthContext } from "../src/Contexts/AuthContext/AuthContext"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

import { AlertContext } from "../src/Contexts/AlertContext/AlertContext";
import TopBanner from "../src/components/TopBanner";
import { UIProvider } from "../src/Contexts/UIContext/UIProvider";
import { UIContext } from "../src/Contexts/UIContext/UIContext";
import TopBar from "../src/components/TopBar";
import JoinedRoom from "../src/components/Home/JoinedRoom";
import CreatedRoom from "../src/components/Home/CreatedRoom";
import AccountSettings from "../src/components/Home/AccountSettings";

export default function User() {

    const navigate = useNavigate();
    const { email, userId, token, userName } = useContext(AuthContext);
    const { setMessage, setType } = useContext(AlertContext);

    const [activeTab, setActiveTab] = useState('joinedrooms');
    console.log({ email, userId, token });
    const { setTitle } = useContext(UIContext);


    useEffect(() => {
        if (!token) {
            setMessage('Log in to access this page');
            setType('warning');
            navigate('/login');
        }


    }, [token, setMessage, setType, navigate])

    useEffect(() => {
        setTitle('Hi ' + (userName || ''));
    }, [setTitle, userName])




    const tabs = [
        { title: 'Your Joined Rooms', keyword: 'joinedrooms', icon: '' },
        { title: 'Your Created Rooms', keyword: 'createdrooms', icon: '' },
        { title: 'Account Settings', keyword: 'accountsettings', icon: '' },
    ]

    return (
        <>

            <div className="flex flex-col">
                <TopBanner />
                <TopBar
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
                <div className="flex flex-col p-8 ">
                    <div>
                        {activeTab === 'joinedrooms' ? (
                            <JoinedRoom
                            />
                        ) : activeTab === 'createdrooms' ? (
                            <CreatedRoom />
                        ) : activeTab === 'accountsettings' ? (

                            <AccountSettings />

                        ) : <></>}

                    </div>
                </div>




            </div>
        </>
    )
}