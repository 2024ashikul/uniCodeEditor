import { useState, useEffect, useRef } from "react";
import { UIContext } from "./UIContext";

export const UIProvider = ({ children }) => {
  const [popUp, setPopUp] = useState(false);
  const [navCenter, setNavCenter] = useState();

  const [extraInfo, setExtraInfo] = useState(null);

  const titleRef = useRef(localStorage.getItem("title") || "");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 50) {
        setNavCenter(titleRef.current); 
      } else {
        setNavCenter(null);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  
  const setTitle = (newTitle) => {
    titleRef.current = newTitle;
    localStorage.setItem("title", newTitle);
    
    if (window.scrollY >= 0) {
      setNavCenter(newTitle);
    }
  };

  return (
    <UIContext.Provider
      value={{
        title: titleRef.current,
        setTitle,
        extraInfo,
        setExtraInfo,
        popUp,
        setPopUp,
        navCenter,
        setNavCenter,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
