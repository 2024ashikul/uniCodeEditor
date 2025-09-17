import { useState,useEffect } from "react";
import { UIContext } from "./UIContext";

export const UIProvider = ({ children }) => {

    const [popUp, setPopUp] = useState(false);
    const [navCenter, setNavCenter] = useState();
    const [title, setTitle] = useState(()=> localStorage.getItem('title'));
    const [scrollHeight, setScrollHeight] = useState(50);
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
    }, [title,scrollHeight]);

    
    
    return (
        <UIContext.Provider value={{title,extraInfo, setExtraInfo,setTitle,scrollHeight, setScrollHeight, popUp, setPopUp, navCenter, setNavCenter }}>
            {children}
        </UIContext.Provider>
    )
}