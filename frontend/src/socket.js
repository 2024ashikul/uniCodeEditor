import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const useSocket = (serverUrl, options) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Create socket connection
    socketRef.current = io(serverUrl, options);

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [serverUrl, options]); // options should be a stable object

  return socketRef.current;
};
