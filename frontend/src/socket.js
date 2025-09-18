import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const useSocket = (serverUrl, options) => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(serverUrl, options);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [serverUrl, options]); 

  return socketRef.current;
};
