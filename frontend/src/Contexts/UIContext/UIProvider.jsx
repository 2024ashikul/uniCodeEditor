import { useState,useEffect } from "react";
import { UIContext } from "./UIContext";

export const UIProvider = ({ children }) => {

    const [popUp, setPopUp] = useState(false);
    const [navCenter, setNavCenter] = useState('Hi');
    const [title, setTitle] = useState(()=> localStorage.getItem('title'));
    const [scrollHeight, setScrollHeight] = useState(null);
    const [extraInfo, setExtraInfo] = useState(null);
    
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY >= (scrollHeight)) {
                setNavCenter(title)
            } else {
                setNavCenter(null)
            };
        }
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [setNavCenter,title,scrollHeight]);

    useEffect(()=>{
        localStorage.setItem('title',title);
    },[title])
    
    return (
        <UIContext.Provider value={{title,extraInfo, setExtraInfo,setTitle,scrollHeight, setScrollHeight, popUp, setPopUp, navCenter, setNavCenter }}>
            {children}
        </UIContext.Provider>
    )
}