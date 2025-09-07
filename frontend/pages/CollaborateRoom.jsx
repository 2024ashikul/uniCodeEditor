import Editor from '@monaco-editor/react';
import io from 'socket.io-client';
import * as monaco from 'monaco-editor';
const socket = io(`${API_URL}/collaborateClassRoom`, {
    reconnection: true, // Enable automatic reconnection
    reconnectionAttempts: Infinity, // Set to infinite attempts
    reconnectionDelay: 1000, // Wait 1 second before retrying
    reconnectionDelayMax: 3000, // Maximum wait time before each retry

});
import { useState, useEffect, useRef, useContext } from 'react';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import { CircleUserRound, Dot, File } from 'lucide-react';
import { AccessContext } from '../src/Contexts/AccessContext/AccessContext';
import { AlertContext } from '../src/Contexts/AlertContext/AlertContext';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../src/Contexts/AuthContext/AuthContext';
import NavBar from '../src/components/NavBar';
import History from '../src/components/CollabAllClass/History';
import CustomDropDown from '../src/components/SharedComponents/CustomDropDown';
import { API_URL } from '../src/config';


export default function CollaborateRoom() {
    const navigate = useNavigate();
    const { setMessage } = useContext(AlertContext);
    const { userId, token } = useContext(AuthContext);
    const [isEditor, setIsEditor] = useState(false);
    const { roomId } = useParams();
    const { checkAccess } = useContext(AccessContext);
    const [terminalHeight, setTerminalHeight] = useState(0);
    const [code, setCode] = useState('// Start coding...');
    const editorRef = useRef(null);
    const teacherCursorDecoration = useRef([]);
    const latestTeacherCursor = useRef(null);
    const pointerRef = useRef(null);
    const [language, setLanguage] = useState('python');
    const [stdin, setStdin] = useState('');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [members, setMembers] = useState([]);
    const [admin, setAdmin] = useState(false);
    const [member, setMember] = useState(userId);
    const [tabSize, setTabSize] = useState(4);
    const languages = ['python', 'cpp', 'C#'];
    const tabsizes = [2, 3, 4, 5, 6, 7, 8];
    const { authorized, setAuthorized, setRole } = useContext(AccessContext);


    useEffect(() => {
        const admin = async () => {
            try {
                const res = await fetch(`${API_URL}/room/getadmin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ roomId })
                })

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                setAdmin(data.admin == userId);

            } catch (err) {
                console.log("Failed to fetch admin", err);
            }
        }
        if (roomId) {
            admin();
        }
    }, [roomId, userId, token])

    useEffect(() => {
        if (!userId) return;
        setMember(userId);
        checkAccess({ roomId  })
            .then((auth) => {
                console.log(auth)
                if (auth.allowed === true) {
                    setAuthorized(true);
                    setRole(auth.role);
                    if (auth.role === 'admin') {
                        setIsEditor(true);
                    }
                }
                else {
                    setAuthorized(false)
                }
            })

    }, [checkAccess, roomId, setAuthorized, setRole, setMember, userId])

    const [myFiles, setMyFiles] = useState({
        "main.cpp": { language: "cpp", content: "// Start coding..." }
    });

    const [files, setFiles] = useState(myFiles);
    const [activeFile, setActiveFile] = useState("main.cpp");
    console.log(`active file is : ${activeFile}`);



    //IOS switch
    const IOSSwitch = styled((props) => (
        <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
    ))(({ theme }) => ({
        width: 42,
        height: 26,
        padding: 0,
        '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
                transform: 'translateX(16px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    backgroundColor: '#65C466',
                    opacity: 1,
                    border: 0,
                    ...theme.applyStyles('dark', {
                        backgroundColor: '#2ECA45',
                    }),
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                    opacity: 0.5,
                },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
                color: '#33cf4d',
                border: '6px solid #fff',
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
                color: theme.palette.grey[100],
                ...theme.applyStyles('dark', {
                    color: theme.palette.grey[600],
                }),
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.7,
                ...theme.applyStyles('dark', {
                    opacity: 0.3,
                }),
            },
        },
        '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 22,
            height: 22,
        },
        '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: '#E9E9EA',
            opacity: 1,
            transition: theme.transitions.create(['background-color'], {
                duration: 500,
            }),
            ...theme.applyStyles('dark', {
                backgroundColor: '#39393D',
            }),
        },
    }));



    useEffect(() => {
        if (!authorized) return;
        console.log('here')
        socket.on('sendMessage', (message) => {
            setMessage(message);
        })
    }, [setMessage, authorized])



    useEffect(() => {
        if (!authorized) return;
        socket.on('roomData', (data) => {
            setMembers(data.members);


            setIsEditor(true); //changeneeded
            console.log(data);
        })
        socket.on('syncFile', (data) => {
            setMyFiles(data.file);
            setFiles(data.file);
            const fileKeys = Object.keys(data.file);
            setActiveFile(fileKeys[0]);
            console.log(data.file);
        })
        return () => {
            socket.off('roomData');
            socket.off('syncFile');
        };
    }, [setIsEditor, userId, authorized])

    useEffect(() => {
        if (!authorized) return;
        console.log(userId);
        socket.emit('joinRoom', ({ roomId, userId }));
        return () => {
            socket.off('joinRoom');
        };
    }, [roomId, userId, authorized])

    useEffect(() => {
        if (!authorized) return;
        console.log("here")
        //socket.emit('joinRoom', roomId);
        function renderTeacherCursor() {
            if (!isEditor && editorRef.current && latestTeacherCursor.current) {
                teacherCursorDecoration.current = editorRef.current.deltaDecorations(
                    teacherCursorDecoration.current,
                    [
                        {
                            range: new monaco.Range(
                                latestTeacherCursor.current.lineNumber,
                                latestTeacherCursor.current.column,
                                latestTeacherCursor.current.lineNumber,
                                latestTeacherCursor.current.column
                            ),
                            options: { className: 'teacher-cursor' }
                        }
                    ]
                );
            }
        }

        socket.on("fileUpdate", ({ files, userId }) => {
            if (!files) return;
            if (member === userId) {
                setFiles(files);
                const fileKeys = Object.keys(files);
                setActiveFile(fileKeys[0] || null);
            }

        });

        socket.on('leaveroom', (message) => {
            setMessage(message);
            navigate(`/room/${roomId}`)
        })
        socket.on('cursorUpdate', (cursorPos) => {
            console.log('cursos updated');
            latestTeacherCursor.current = cursorPos;
            renderTeacherCursor();
        });

        return () => {
            socket.off('fileUpdate');
            socket.off('cursorUpdate');
            socket.off('leaveroom');
        };

    }, [roomId, isEditor, member, authorized, navigate, setMessage]);

    useEffect(() => {
        if (!authorized) return;
        console.log('cahngeing who can be editor');
        if (member === userId) {
            setIsEditor(true);
        } else {
            setIsEditor(false);
        }
    }, [setIsEditor, member, userId, authorized])

    useEffect(() => {
        if (!authorized) return;
        if (!isEditor) return;

        function handleMouseMove(e) {
            const pos = { x: e.clientX, y: e.clientY };
            socket.emit('pointerMove', { roomId, pos });
        }

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isEditor, roomId, authorized]);

    const addNewFile = () => {
        let newFileName = prompt("Enter new file name:", "newFile.js");
        if (!newFileName) return;

        if (files[newFileName]) {
            alert("File already exists!");
            return;
        }

        setFiles(prev => ({
            ...prev,
            [newFileName]: { language: "javascript", content: "hi" }
        }));
        setActiveFile(newFileName);
    };
    console.log(files);

    function handleEditorMount(editor) {
        editorRef.current = editor;

        if (isEditor) {
            const disposable = editor.onDidChangeCursorPosition((e) => {
                socket.emit('cursorChange', {
                    roomId,
                    cursor: e.position,
                });

                return () => disposable.dispose();
            });
        }
    }

    async function LeaveMeeting() {
        try {
            socket.emit('leaveRoom', roomId);
            const res = await fetch(`${API_URL}/meeting/leave`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ roomId, type: 'collaborateroom' })
            })

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();

            setMessage(data.message)
            navigate(`/room/${roomId}`);
        }
        catch (err) {
            console.log(err)
            setMessage('Internal server error');
        }
    }
    //Code functionality part

    const [font, setFont] = useState(12);

    async function handleRun() {

        setLoading(true);

        await fetch(`${API_URL}/runcode`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code, language, stdin })
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                const newResult = {
                    stdout: data.stdout,
                    stderr: data.stderr,
                    time: data.time,
                    status: data.status,
                    currentTime: getTime()
                };

                setHistory((prev) => [...prev, newResult]);
                setLoading(false);
                setTerminalHeight(30);
                console.log(loading)
            })
            .catch((err) => console.log(err))
    }

    function showFileofOthers(userid) {
        setIsEditor(false);
        if (member !== userid) {
            setMember(userid);

            socket.emit("showFile", { userId: userid, roomId });
            console.log('emitted');
        }
    }

    useEffect(() => {
        if (member != userId) {
            setIsEditor(false)
        }
    }, [member, userId])



    useEffect(() => {
        const fileKeys = Object.keys(files);
        if (fileKeys.length === 0) {
            setActiveFile(null);
        } else if (!activeFile || !files[activeFile]) {

            setActiveFile(fileKeys[0]);
        }
    }, [files, activeFile]);

    useEffect(() => {
        if (!authorized) return;
        const handler = ({ files }) => {

            console.log('Received seeFile event. Files:', files);
            setFiles(files);
            console.log(files);
            const fileKeys = Object.keys(files);
            setActiveFile(fileKeys[0]);
        };
        socket.on("seeFile", handler);
        console.log('seen the file');
        return () => socket.off("seeFile", handler);
    }, [member, authorized]);



    function getTime() {
        const time = new Date().toLocaleTimeString();
        console.log(time);
        return time;
    }
    // if (authorized === null) return (<p>Loading</p>)
    // if (!authorized) return (<p>Not Authorized</p>)
    const fontsizes = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

    if (authorized === null) return (<> <NavBar /><p>Loading</p></>)
    if (!authorized) return (<><NavBar /><p>Not Authorized</p></>)


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

                                    if (!isEditor || !activeFile) {
                                        return;
                                    }

                                    setCode(files[activeFile].content);
                                    const newFileObject = {
                                        ...files,
                                        [activeFile]: {
                                            ...files[activeFile],
                                            content: value
                                        }
                                    };

                                    // setFiles(prev => {
                                    //     const newFiles = {
                                    //         ...prev,
                                    //         [activeFile]: {
                                    //             ...prev[activeFile],
                                    //             content: updatedContent
                                    //         }
                                    //     };

                                    //     // Emit the file change immediately
                                    //     socket.emit("fileChange", { roomId, userId, files: newFiles });
                                    //     setMyFiles(newFiles);
                                    //     return newFiles;

                                    // });


                                    setFiles(newFileObject);
                                    setMyFiles(files);
                                    console.log(myFiles);

                                    // Emit the change to the server
                                    socket.emit("fileChange", { roomId, userId, files: newFileObject });
                                }}
                                value={files?.[activeFile]?.content || ''}
                                onMount={handleEditorMount}
                                language={files?.[activeFile]?.language || 'python'}
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

                                    {members.map((item, i) => (

                                        <div key={i} className={`flex justify-between text-md items-center w-full px-2 py-1
                                        ${member === item.id ? 'bg-blue-100' : 'bg-green-100'}`}
                                            onClick={() => {
                                                console.log(`MYFILES ARE ${myFiles}`);
                                                if (item.id === userId) {

                                                    setFiles(myFiles);

                                                    console.log(files);
                                                    const fileKeys = Object.keys(files);
                                                    setActiveFile(fileKeys[0]);
                                                    setMember(userId);
                                                    setIsEditor(true);

                                                } else {
                                                    showFileofOthers(item.id);
                                                }
                                                // setMember(item.id);
                                                // console.log('set member');
                                                // if(member!= userId){
                                                //     setIsEditor(false);
                                                // }
                                                // console.log('settted is editor');

                                                // if (filesAll[item.id]) {
                                                //     setFiles(filesAll[item.id]);
                                                //     console.log('setted the files');
                                                //     setActiveFile(Object.keys(files)[0] || null);
                                                //     console.log('setted active files');
                                                // }


                                                // console.log(filesAll);
                                            }}
                                        >
                                            <div className={`flex-1 flex gap-2 `}

                                            ><span><CircleUserRound className='py-0.75' /></span><p>{item.name}</p><span>{item.active && <Dot className='red' />}</span></div>
                                            <div>
                                                {/* <IOSSwitch
                                                    checked={item.access === true ? true : false}
                                                    onChange={() => changeAccess(item.id)}
                                                    inputProps={{ 'aria-label': 'iOS design switch' }}
                                                /> */}
                                            </div>
                                        </div>
                                    ))}
                                </div>


                            </div>

                            <div
                                className='flex flex-col flex-1 overflow-scroll  h-full  w-full py-2 rounded-2xl shadow-2xl  transition-transform duration-300 '
                            >
                                <div className='flex px-4 text-xl font-semibold gap-4 transition-transform duration-500'><p>Files</p></div>

                                {isEditor && <button onClick={addNewFile}>➕ New File</button>}

                                <ul className='px-2'>
                                    {Object.keys(files).map(fileName => {
                                        return (
                                            <li
                                                key={fileName}
                                                onClick={() => setActiveFile(fileName)}
                                                style={{ cursor: 'pointer', background: activeFile === fileName ? '#ddd' : 'transparent' }}
                                            >
                                                <div className='flex gap-2'>  <File className='py-0.75' /> {fileName}</div>
                                            </li>
                                        )
                                    })}
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
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
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

                        <History history={history} />

                    </div>
                </div>

            </div >
        </>

    )
}
