import { useContext } from "react";
import { UIContext } from "../../Contexts/UIContext/UIContext";

export default function PopUpLayout({ children }) {
    const { popUp } = useContext(UIContext);

    return (
        <div className="relative">
            <div className={`${popUp ? 'blur pointer-events-none transition duration-500' : 'transition duration-500'}`}>
                {children}
            </div>
        </div>
    );
}
