import { useEffect, useState, useMemo } from 'react';
import io from 'socket.io-client';

export const useSocket = (serverUrl, options) => {
  // useMemo prevents the options object from being recreated on every render,
  // which would cause the useEffect to run unnecessarily.
  const memoizedOptions = useMemo(() => options, [options]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Pass the options object directly to the io constructor
    const newSocket = io(serverUrl, memoizedOptions);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [serverUrl, memoizedOptions]);

  return socket;
};