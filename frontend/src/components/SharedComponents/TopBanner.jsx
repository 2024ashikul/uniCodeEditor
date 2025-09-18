import { useContext } from "react";
import { UIContext } from "../../Contexts/UIContext/UIContext";



export default function TopBanner({ extraInfo }) {
    
    const { title} = useContext(UIContext);

    return (
        <header className="relative   text-white  overflow-hidden">
            
            <div
                className="absolute inset-0  "
                aria-hidden="true"
            />
            
            <div className="container  mx-auto px-6 py-10 text-center relative animate-fade-in-down">
                
               
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                        {title}
                    </h1>
                

              
                {extraInfo && (
                    <div className="mt-4  mx-auto text-base sm:text-lg text-gray-400">
                        {extraInfo}
                    </div>
                )}
            </div>
            <style jsx>{`
                @keyframes fade-in-down {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.6s ease-out forwards;
                }
            `}</style>
        </header>
    );
}

