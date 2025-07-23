import { useEffect, useState } from "react";
import { AlertContext } from "./AlertContext";
import Alert from '@mui/material/Alert';

export const AlertProvider = ({ children }) => {
    const [message, setMessage] = useState(null);
    const [type, setType] = useState(null);
    // const [fade,setFade] = useState(false);
    useEffect(() => {


        if (message) {
            const timer = setTimeout(() => {

                setMessage(null);
            }, 4000);


            return () => { clearTimeout(timer); };
        }
        console.log('done');

    }, [message]);

    return (
        <AlertContext.Provider value={{ message, setMessage ,type, setType}}>
            {children}

            {
                (<div className={`
            absolute top-14 right-2 
            overflow-visible 
             shadow-lg transition duration-1000 
            ${message ? 'opacity-100' : 'opacity-0'}
             `}>
                    {
                        type === 'error' ? (
                            <Alert
                                variant="filled"
                                severity="error"
                            >{message}</Alert>
                        ) : type === 'info' ? (
                            <Alert
                                variant="filled"
                                severity="info"
                            >{message}</Alert>
                        ) : type === 'warning' ? (
                            <Alert
                                variant="filled"
                                severity="warning"
                            >{message}</Alert>
                        ) : (
                            <Alert
                                variant="filled"
                                severity="success"
                            >{message}</Alert>
                        )
                    }

                </div>

                )
            }


        </AlertContext.Provider>
    );
}