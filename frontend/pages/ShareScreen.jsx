
import React, { useState, useEffect, useRef, useContext } from 'react';

import { API_URL } from '../src/config';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../src/Contexts/AuthContext/AuthContext';
import { AccessContext } from '../src/Contexts/AccessContext/AccessContext';
import { useSocket } from '../src/socket';


// The main App component containing all logic and UI
export default function ShareScreen() {

    // --- State Management ---

     const socketOptions = {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 3000,
        };
        const socket = useSocket(`${API_URL}/collaborateClassRoom`, socketOptions);
        
    const { roomId } = useParams();
    const { userId } = useContext(AuthContext);
    const [statusMessage, setStatusMessage] = useState('Enter a Room ID and Join.');
    const [isJoined, setIsJoined] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [sharedScreenUrl, setSharedScreenUrl] = useState(null);
    const { authorized, setAuthorized } = useContext(AccessContext);
    const { checkAccess } = useContext(AccessContext);


    // --- Ref Management for DOM elements and mutable variables ---
    const streamRef = useRef(null);
    const frameIntervalRef = useRef(null);
    const canvasRef = useRef(null);
    const videoRef = useRef(null);


    useEffect(() => {
        checkAccess({ roomId })
            .then((auth) => {
                if (auth.allowed === true) {
                    setAuthorized(true);
                }
                else {
                    setAuthorized(false)
                }
            })

    }, [checkAccess, roomId, setAuthorized])

    console.log(authorized);

    useEffect(() => {
        if (!authorized) return;

        if (!isJoined) {
            socket.emit('joinRoom', { roomId, userId });
        }
        socket.on('connect', () => {
            setIsJoined(true);
            console.log('connected to the server');

        });
        socket.on("sendMessage", (data) => {
            setStatusMessage(data);
        });

        socket.on("screenFrame", (data) => {
            setSharedScreenUrl(data.image);
        });

        socket.on("disconnect", () => {
            setIsJoined(false);
            setIsSharing(false);
            setSharedScreenUrl(null);
            setStatusMessage("Disconnected. Please re-join.");
        });
        return () => {
            socket.off('connect');
            socket.off('sendMessage');
            socket.off('screenFrame');
            socket.off('disconnect');
        }
    }, [roomId, userId, authorized, isJoined]);


    

    // Effect for handling screen capture and streaming
    useEffect(() => {
        if (!isSharing) {
            // Stop screen sharing cleanup
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            if (frameIntervalRef.current) {
                clearInterval(frameIntervalRef.current);
                frameIntervalRef.current = null;
            }
            return;
        }

        const startSharing = async () => {
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                streamRef.current = stream;

                const videoTrack = stream.getVideoTracks()[0];
                const mediaStream = new MediaStream([videoTrack]);

                // Create a temporary video element to play the stream
                const videoElement = document.createElement('video');
                videoElement.srcObject = mediaStream;
                videoElement.autoplay = true;
                videoRef.current = videoElement;

                videoElement.onloadedmetadata = () => {
                    videoElement.play();

                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext('2d');

                    canvas.width = videoElement.videoWidth;
                    canvas.height = videoElement.videoHeight;

                    // Start capturing and sending frames
                    frameIntervalRef.current = setInterval(() => {
                        if (socket.connected) {
                            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                            const imageData = canvas.toDataURL("image/jpeg", 0.8);

                            socket.emit("screenFrame", {
                                roomId,
                                image: imageData,
                            });
                        }
                    }, 10); 
                };

                videoTrack.onended = () => {
                    // User stopped sharing via browser button
                    handleStopSharing();
                };

            } catch (err) {
                console.error('Error: ' + err);
                setStatusMessage('Sharing failed or was canceled.');
                setIsSharing(false);
            }
        };

        startSharing();

        return () => {

            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (frameIntervalRef.current) {
                clearInterval(frameIntervalRef.current);
            }
        };
    }, [isSharing, roomId]);

    // --- Event Handlers ---

    const handleStartSharing = () => {
        if (!isJoined) {
            setStatusMessage('Please join a room first.');
            return;
        }
        setIsSharing(true);
        setStatusMessage('Screen sharing started...');
    };

    const handleStopSharing = () => {
        setIsSharing(false);
        setStatusMessage(`Sharing stopped. You are still in room: ${roomId}`);
    };
    if (!authorized) return (<p>Not authorized</p>)

    return (
        <div className="min-h-screen p-6 bg-gray-100 font-[Inter]">
            <div className="container mx-auto max-w-4xl bg-white p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-center">React WebSocket Screen Share</h1>



                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <button
                        id="startButton"
                        onClick={handleStartSharing}
                        className={`font-semibold py-3 px-6 rounded-lg transition-colors duration-300 w-full md:w-1/2 ${!isJoined || isSharing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                        disabled={!isJoined || isSharing}
                    >
                        Start Sharing
                    </button>
                    <button
                        id="stopButton"
                        onClick={handleStopSharing}
                        className={`font-semibold py-3 px-6 rounded-lg transition-colors duration-300 w-full md:w-1/2 ${!isSharing ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                        disabled={!isSharing}
                    >
                        Stop Sharing
                    </button>
                </div>

                <p className="text-center text-gray-500 mb-4">
                    <span id="statusMessage" className="text-sm font-medium">{statusMessage}</span>
                </p>

                <div className="min-h-[200px] bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg relative p-2 overflow-hidden flex items-center justify-center">
                    {sharedScreenUrl ? (
                        <img
                            id="sharedScreen"
                            src={sharedScreenUrl}
                            alt="Shared Screen"
                            className="max-w-full h-auto rounded-lg"
                        />
                    ) : (
                        <div id="initialMessage" className="flex items-center justify-center text-center text-gray-500">
                            <p>Screen sharing will appear here.</p>
                        </div>
                    )}
                </div>

                {/* Hidden canvas for capturing frames */}
                <canvas id="screenCanvas" ref={canvasRef} className="hidden"></canvas>
            </div>
        </div>
    );
};


