import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { CircleUserRound, Dot, File, Trash } from 'lucide-react';
import { AccessContext } from '../src/Contexts/AccessContext/AccessContext';
import { AlertContext } from '../src/Contexts/AlertContext/AlertContext';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../src/Contexts/AuthContext/AuthContext';
import NavBar from '../src/components/NavBar';
import CustomDropDown from '../src/components/SharedComponents/CustomDropDown';
import { API_URL } from '../src/config';
import { useSocket } from '../src/socket';
import IOSSwitch from '../src/components/IOSSwitch';
import { APIRequest } from '../src/APIRequest';

export default function CollaborateClassRoom() {
    const navigate = useNavigate();
    const { userId, token } = useContext(AuthContext);
    const { checkAccess, authorized, setAuthorized, setRole } = useContext(AccessContext);
    const { setMessage } = useContext(AlertContext);
    const { roomId } = useParams();

    const [isEditor, setIsEditor] = useState(false);
    const [terminalHeight, setTerminalHeight] = useState(0);
    const [code, setCode] = useState('// Start coding...');
    const [language, setLanguage] = useState('python');
    const [stdin, setStdin] = useState('');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [members, setMembers] = useState([]);
    const [tabSize, setTabSize] = useState(4);
    const [font, setFont] = useState(12);
    const [connected, setConnected] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [files, setFiles] = useState({
        'main.cpp': { language: 'cpp', content: '// Start coding...' },
    });
    const [activeFile, setActiveFile] = useState('main.cpp');
    console.log({ isEditor, connected, admin })
    const editorRef = useRef(null);
    const teacherCursorDecoration = useRef([]);
    const latestTeacherCursor = useRef(null);
    const pointerRef = useRef(null);

    const languages = ['python', 'cpp', 'C#'];
    const fontsizes = [12, 13, 14, 15, 16, 17, 18, 19, 20];
    const tabsizes = [2, 3, 4, 5, 6, 7, 8];

    const { request } = APIRequest();


    const socketOptions = useMemo(() => ({
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 300,
        reconnectionDelayMax: 300,
    }), []);
    const socket = useSocket(`${API_URL}/collaborateClassRoom`, socketOptions);

    useEffect(() => {
        if (!roomId || !userId) return;
        const fetchAdmin = async () => {
            try {
                const data = await request('/room/getadmin', { body: { roomId } });
                setAdmin(data.admin == userId);
            } catch (err) {
                console.log('Failed to fetch admin', err);
            }
        };
        fetchAdmin();
    }, [roomId, userId]);


    useEffect(() => {
        if (!userId || !token) return;
        const verifyAccess = async () => {
            const auth = await checkAccess({ userId, token, roomId });
            if (auth && auth.allowed) {
                setAuthorized(true);
                setRole(auth.role);
            } else {
                setAuthorized(false);
                setRole(null);
            }
        };
        verifyAccess();
        return () => {
            setAuthorized(null);
            setRole(null);
        };
    }, [userId, token, roomId]);


    useEffect(() => {
        if (!socket) return;

        // JOIN ROOM
        if (authorized) {
            socket.emit('joinRoom', { roomId, userId });
        }

        // CONNECTION EVENTS
        socket.on('connect', () => setConnected(true));
        socket.on('disconnect', () => setConnected(false));

        // FILE EVENTS
        socket.on('fileDelete', (fileToDelete) => {
            setFiles((prev) => {
                const updated = { ...prev };
                delete updated[fileToDelete];
                return updated;
            });
            if (activeFile === fileToDelete) {
                const keys = Object.keys(files).filter((f) => f !== fileToDelete);
                setActiveFile(keys.length > 0 ? keys[0] : null);
            }
        });

        socket.on('fileAdd', ({ newFileName, content }) => {
            setFiles((prev) => ({
                ...prev,
                [newFileName]: { language: 'javascript', content },
            }));
        });

        socket.on('fileChange', ({ fileName, content }) => {
            setFiles((prev) => ({
                ...prev,
                [fileName]: { ...prev[fileName], content },
            }));
        });

        socket.on('fileUpdate', ({ fileName, content }) => {
            setFiles((prev) => ({
                ...prev,
                [fileName]: { ...prev[fileName], content },
            }));
        });

        // ROOM EVENTS
        socket.on('roomData', (data) => {
            setMembers(data.members);
            const member = data.members.find((m) => m.id === userId);
            if (member) setIsEditor(member.access);
        });

        socket.on('syncFile', (data) => {
            setFiles(data.file);
            const keys = Object.keys(data.file);
            setActiveFile(keys[0]);
        });

        socket.on('sendMessage', (msg) => setMessage(msg));

        socket.on('leaveroom', (message) => {
            setMessage(message);
            navigate(`/room/${roomId}`);
        });

        // CURSOR + POINTER
        socket.on('cursorUpdate', (cursorPos) => {
            latestTeacherCursor.current = cursorPos;
            if (!isEditor && editorRef.current && cursorPos) {
                teacherCursorDecoration.current = editorRef.current.deltaDecorations(
                    teacherCursorDecoration.current,
                    [
                        {
                            range: new monaco.Range(
                                cursorPos.lineNumber,
                                cursorPos.column,
                                cursorPos.lineNumber,
                                cursorPos.column
                            ),
                            options: { className: 'teacher-cursor' },
                        },
                    ]
                );
            }
        });

        socket.on('pointerUpdate', ({ x, y }) => {
            if (pointerRef.current) {
                pointerRef.current.style.left = `${x}px`;
                pointerRef.current.style.top = `${y}px`;
            }
        });

        return () => {
            socket.off(); 
        };
    }, [socket, authorized, activeFile]);

    function handleFileSelect(e) {
        const f = e.target.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            const fileName = f.name;
            setFiles((prev) => ({
                ...prev,
                [fileName]: { language: 'javascript', content },
            }));
            setActiveFile(fileName);
            socket.emit('fileAdd', { roomId, newFileName: fileName, content });
        };
        reader.readAsText(f);
    }

    const deleteFile = (fileToDelete) => {
        if (fileToDelete === activeFile) {
            alert('Cannot delete active file. Switch first.');
            return;
        }
        setFiles((prev) => {
            const updated = { ...prev };
            delete updated[fileToDelete];
            return updated;
        });
        socket.emit('fileDelete', { fileToDelete, roomId });
    };

    const addNewFile = () => {
        let newFileName = prompt('Enter new file name:', 'newFile.js');
        if (!newFileName) return;
        if (files[newFileName]) {
            alert('File already exists!');
            return;
        }
        setFiles((prev) => ({
            ...prev,
            [newFileName]: { language: 'javascript', content: '' },
        }));
        setActiveFile(newFileName);
        socket.emit('fileAdd', { roomId, newFileName, content: '' });
    };

 
    function handleEditorMount(editor) {
        editorRef.current = editor;
        if (isEditor) {
            editor.onDidChangeCursorPosition((e) => {
                socket.emit('cursorChange', { roomId, cursor: e.position });
            });
        }
    }


    async function handleRun() {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/runcode`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, language, stdin }),
            });
            const data = await res.json();
            const newResult = {
                stdout: data.stdout,
                stderr: data.stderr,
                time: data.time,
                status: data.status,
                currentTime: new Date().toLocaleTimeString(),
            };
            setHistory((prev) => [...prev, newResult]);
            setTerminalHeight(30);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }
    async function LeaveMeeting() {
        try {
            socket.emit('leaveRoom', roomId);
            const data = await request("/meeting/leave", { body: { roomId, type: 'collaborateclassroom' } });
            setMessage(data.message);
            navigate(`/room/${roomId}`);
        } catch (err) {
            console.log(err)
            setMessage('Internal server error');
        }
    }

    function changeAccess(userId) {
        socket.emit('changeAccess', { roomId, userId });
    }

    if (authorized === null) return <><NavBar /><p>Loading...</p></>;
    if (!authorized) return <><NavBar /><p>Not Authorized </p></>;

    return (
        <>
            {!isEditor && (
                <div
                    ref={pointerRef}
                    style={{
                        position: 'fixed',
                        width: '10px',
                        height: '10px',
                        background: 'black',
                        borderRadius: '50%',
                        pointerEvents: 'none',
                        zIndex: 9999,
                        transform: 'translate(-50%, -50%)',
                    }}
                />
            )}


            <div className={`flex flex-col transition-all overflow-auto h-screen duration-300  `} >
                <NavBar />
                <div className='px-4 py-1 flex gap-4 h-10'>

                    <CustomDropDown
                        label={'Language'}
                        options={languages}
                        value={language}
                        onChange={setLanguage}
                    />

                    <CustomDropDown
                        label={'Font Size'}
                        options={fontsizes}
                        value={font}
                        onChange={setFont}
                    />

                    <CustomDropDown
                        label={'Tab Size'}
                        options={tabsizes}
                        value={tabSize}
                        onChange={setTabSize}
                    />

                    <div>
                        {admin &&
                            <button onClick={() => LeaveMeeting()}>Leave</button>
                        }
                    </div>
                    <p>{!connected && 'trying to connect'}</p>
                </div>
                <div className='flex flex-col  flex-1 overflow-hidden'>
                    <div className={`flex flex-1  mb-2  gap-2 transition-all ease-in-out duration-300`}
                        style={{ maxHeight: terminalHeight == 0 ? '95%' : '70%' }}>
                        <div className={`flex flex-1 flex-col w-3/4 ml-4 h-full`}    >
                            <Editor

                                defaultLanguage='cpp'
                                height="100%"
                                //onChange={e => setCode(e)}
                                onChange={(value) => {
                                    if (!isEditor) return;
                                    const updatedContent = value;
                                    setCode(value);

                                    setFiles(prev => ({
                                        ...prev,
                                        [activeFile]: {
                                            ...prev[activeFile],
                                            content: updatedContent
                                        }
                                    }));

                                    socket.emit("fileChange", {
                                        roomId,
                                        fileName: activeFile,
                                        content: updatedContent
                                    });
                                }}
                                value={files[activeFile].content}
                                onMount={handleEditorMount}
                                language={files[activeFile].language}
                                className='p-2 border rounded-2xl '
                                options={{
                                    readOnly: !isEditor,
                                    minimap: { enabled: false },
                                    fontSize: font,
                                    wordWrap: "on",
                                    lineNumbers: "on",
                                    tabSize: tabSize,
                                    automaticLayout: true,
                                    scrollbar: {
                                        verticalScrollbarSize: 5,
                                        horizontalScrollbarSize: 5,
                                    },
                                    scrollBeyondLastLine: false,
                                    formatOnPaste: true,
                                    formatOnType: true,
                                    renderWhitespace: "all",
                                    matchBrackets: 'always',
                                }}
                            >
                            </Editor>

                        </div>
                        <div className={`flex flex-col  w-1/4 mr-4  justify-center items-center gap-2 `} >
                            <div
                                className='flex flex-col overflow-scroll flex-1  h-full  w-full py-2 rounded-2xl shadow-2xl  transition-colors duration-300 '
                            >

                                <div className='flex px-4 text-xl font-semibold gap-4'><p>Members</p><span className='text-md'>{members.length}</span></div>
                                <div className='flex flex-col'>

                                    {members.map((item, index) => (

                                        <div key={index} className="flex justify-between text-md items-center w-full px-2 py-1" >
                                            <div className='flex-1 flex gap-2'><span><CircleUserRound className='py-0.75' /></span><p>{item.name}</p><span>{item.active && <Dot className='red' />}</span></div>
                                            <div>

                                                <IOSSwitch
                                                    checked={item.access === true ? true : false}
                                                    onChange={() => {
                                                        if (isEditor) { changeAccess(item.id) } else {
                                                            alert("Only admin can change the permissions")
                                                        }
                                                    }}
                                                    inputProps={{ 'aria-label': 'iOS design switch' }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>


                            </div>

                            <div
                                className='flex flex-col flex-1 overflow-scroll  h-full  w-full py-2 rounded-2xl shadow-2xl  transition-colors duration-300 '
                            >
                                <div className='flex px-4 text-xl font-semibold gap-4'><p>Files</p></div>
                                <div className='flex justify-center'> {isEditor && <button onClick={addNewFile}>➕ New File</button>}</div>
                                <div className='flex justify-center'>{isEditor && <input type="file" className='text-[14px] border-' onChange={handleFileSelect} />}</div>


                                <ul className='px-2'>
                                    {Object.keys(files).map(fileName => (
                                        <li
                                            key={fileName}
                                            onClick={() => setActiveFile(fileName)}
                                            style={{ cursor: 'pointer', background: activeFile === fileName ? '#ddd' : 'transparent' }}
                                            className='flex'
                                        >
                                            <div className='flex gap-2'>  <File className='py-0.75' /> {fileName}</div>
                                            {isEditor &&
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteFile(fileName);
                                                    }}
                                                    className='ml-auto px-1'
                                                >
                                                    <Trash className='py-0.75' />
                                                </button>
                                            }
                                        </li>
                                    ))}
                                </ul>


                            </div>

                            <textarea type='text' placeholder='Input STDIN' className='border  w-full rounded-2xl focus:outline-0 p-4 resize-none' onChange={(e) => setStdin(e.target.value)}
                                style={{ fontSize: `${font}` }}>
                            </textarea>
                            <div
                                className='flex justify-center items-center bg-slate-300   w-full py-2 rounded-2xl shadow-2xl hover:bg-blue-500 active:font-bold active:bg-yellow-300  transition-colors duration-300 '
                                onClick={handleRun}>
                                Run
                            </div>


                        </div>
                    </div>


                    <div className="flex h-8 px-4 py-0  items-center font-semibold border-t border-green-500 m-0"
                        onClick={() => { terminalHeight == 25 ? setTerminalHeight(0) : setTerminalHeight(25) }}
                    >



                        <div className={`justify-end transition-all duration-500 ${terminalHeight == 25 && 'rotate-180'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                            </svg>

                        </div>
                        <div>Terminal</div>
                        <div className='pl-8 items-center justify-center w-80'> {loading && <div className='flex gap-2'> <p className='items-center justify-center'>Loading results</p>

                        </div>}</div>
                        <div>
                            <button type="button" onClick={() => setHistory([])}> Clear</button>
                        </div>
                    </div>

                    <div className=' overflow-scroll bg-cyan-100 pt-0 pb-0 mb-0 transition-all duration-500'
                        style={{
                            maxHeight: `${terminalHeight}%`,
                            transition: 'max-height 0.5s ease',

                        }}>


                        <div
                            className={` w-full  flex flex-col `}>
                            {history.map((item, index) => (
                                <div className='flex flex-col py-1 px-8' key={index}>

                                    <div className='flex'>
                                        <p className='px-2 text-[14px]'>{item.currentTime}</p>
                                        <p className='px-2 text-[14px]'>{item.status} </p>

                                        <p className='px-2 text-[14px]'>{item.time}</p>

                                    </div>

                                    {
                                        item.stderr == null ? (
                                            <p className='px-10 m-0'>{item.stdout}</p>
                                        ) : (
                                            <p className="text-red-500 p-0 m-0">{item.stderr}</p>
                                        )
                                    }

                                </div>))
                            }
                        </div>
                    </div>
                </div>

            </div>
        </>

    )
}
