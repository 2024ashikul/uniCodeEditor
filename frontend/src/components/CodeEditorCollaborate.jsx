

import Editor from '@monaco-editor/react';
// import io from 'socket.io-client';
import MonacoEditor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
// const socket = io(`${API_URL}/collaborate`);
import { useState, useEffect, useRef, useContext } from 'react';
import Loading from './CodeEditor/Loading';
import { AlertContext } from '../Contexts/AlertContext/AlertContext';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import { API_URL } from '../config';
import { useSocket } from '../socket';
const socketOptions = {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 3000,
};

export default function CodeEditorCollaborate({ roomId, isEditorProp, username }) {
    const [isEditor, setIsEditor] = useState(isEditorProp);
    const [terminalHeight, setTerminalHeight] = useState(0);
    const [code, setCode] = useState('// Start coding...');
    const editorRef = useRef(null);
    const teacherCursorDecoration = useRef([]);
    const latestTeacherCursor = useRef(null);
    const pointerRef = useRef(null);
    const [language, setLanguage] = useState(null);
    const [stdin, setStdin] = useState('');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [members, setMembers] = useState([]);


    const socket = useSocket(`${API_URL}/collaborateClass`, socketOptions);

    const [files, setFiles] = useState({
        "main.cpp": { language: "cpp", content: "// Start coding..." }
    });

    const [activeFile, setActiveFile] = useState("main.cpp");

    const { setMessage } = useContext(AlertContext);
    console.log(isEditor);


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
        if (!socket) return;
        console.log('here')
        socket.on('sendMessage', (message) => {
            setMessage(message);
        })
    }, [setMessage])

    function importFromGitHub() {
        const url = prompt("Paste GitHub file link:");
        if (!url) return;
        

        // transform GitHub link → raw content link
        const rawUrl = url
            .replace("github.com", "raw.githubusercontent.com")
            .replace("/blob/", "/");

        fetch(rawUrl)
            .then(res => res.text())
            .then(content => {
                const filename = rawUrl.split("/").pop();
                const newFile = {
                    [filename]: {
                        language: 'cpp',
                        content
                    }
                };

                // update local + sync with server
                setFiles(prev => ({ ...prev, ...newFile }));
                setActiveFile(filename);
                //socket.emit("fileChange", { roomId, userId, files: { ...files, ...newFile } });
            })
            .catch(err => alert("Failed to fetch file: " + err.message));
    }

    


    useEffect(() => {
        if (!socket) return;
        function handleChangeAccess({ data, member }) {
            console.log('changing access');

            setMembers(Object.entries(data.members).map(([username, info]) => ({
                username,
                access: info.access
            })));

            if (member === username) {
                setIsEditor(prev => !prev);
            }
        }

        socket.on("changeAccess", handleChangeAccess);

        return () => {
            socket.off("changeAccess", handleChangeAccess);
        };
    }, [username]);

    useEffect(() => {
        if (!socket) return;
        if (!isEditor) {
            socket.on('pointerUpdate', ({ x, y }) => {
                if (pointerRef.current) {
                    pointerRef.current.style.left = `${x}px`;
                    pointerRef.current.style.top = `${y}px`;
                }
            });

            return () => socket.off('pointerUpdate');
        }
    }, [isEditor]);


    //Code Room Part


    useEffect(() => {
        if (!socket) return;
        socket.on('roomData', (data) => {
            setMembers(Object.entries(data.members).map(([username, info]) => ({
                username,
                access: info.access
            })));
            console.log(members);
        })
    }, [members])

    useEffect(() => {
        if (!socket) return;
        console.log(username);
        socket.emit('joinRoom', ({ roomId, username }));
    }, [roomId, username])

    useEffect(() => {
        if (!socket) return;
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

        socket.on("fileUpdate", ({ fileName, content }) => {
            setFiles(prev => ({
                ...prev,
                [fileName]: { ...prev[fileName], content }
            }));
        });


        socket.on('cursorUpdate', (cursorPos) => {
            latestTeacherCursor.current = cursorPos;
            renderTeacherCursor();

        });

        return () => {
            socket.off('fileUpdate');
            socket.off('cursorUpdate');
        };
    }, [roomId, isEditor]);

    useEffect(() => {
        if (!socket) return;
        if (!isEditor) return;

        function handleMouseMove(e) {
            const pos = { x: e.clientX, y: e.clientY };
            socket.emit('pointerMove', { roomId, pos });
        }

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isEditor, roomId]);

    const addNewFile = () => {
        let newFileName = prompt("Enter new file name:", "newFile.js");
        if (!newFileName) return;

        if (files[newFileName]) {
            alert("File already exists!");
            return;
        }

        setFiles(prev => ({
            ...prev,
            [newFileName]: { language: "javascript", content: "" }
        }));
        setActiveFile(newFileName);
    };

    useEffect(() => {
        if (!socket) return;
        socket.on("fileChange", ({ fileName, content }) => {
            setFiles(prev => ({
                ...prev,
                [fileName]: {
                    ...prev[fileName],
                    content
                }
            }));
        });

        return () => socket.off("fileChange");
    }, []);




    useEffect(() => {
        if (!socket) return;
        socket.on("fileChange", ({ fileName, content }) => {
            setFiles(prev => ({
                ...prev,
                [fileName]: { ...prev[fileName], content }
            }));
        });

        return () => {
            socket.off("fileChange");
        };
    }, []);

    function handleEditorMount(editor) {
        if (!socket) return;
        editorRef.current = editor;

        if (isEditor) {
            editor.onDidChangeCursorPosition((e) => {
                socket.emit('cursorChange', {
                    roomId,
                    cursor: e.position,
                });
            });
        }
    }

    function changeAccess(member) {
        if (!socket) return;
        console.log(member)
        socket.emit('changeAccess', { roomId, member });
    }




    //Code functionality part
    const [results, setResults] = useState({
        stdout: '',
        stderr: '',
        time: '',
        status: '',
        currentTime: ''
    })
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
                setResults({
                    stdout: data.stdout,
                    stderr: data.stderr,
                    time: data.time,
                    status: data.status,
                    currentTime: getTime()
                });

                setHistory((prev) => [...prev, results])
                setLoading(false);
                setTerminalHeight(30);
                console.log(loading)
            })
            .catch((err) => console.log(err))
    }

    function getTime() {
        const time = new Date().toLocaleTimeString();
        console.log(time);
        return time;
    }


    const fontsizes = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

    console.log(font);

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

                <div className='flex gap-4 h-10'>
                    <div>
                        <span> Language : </span>
                        <select onChange={(e) => setLanguage(e.target.value)} >
                            <option value='javascript' >Javascript</option>
                            <option value="cpp" >Cpp</option>
                            <option value="python" >Python</option>
                            <option value="c" >C</option>
                            <option value="csharp" >C#</option>
                        </select>
                    </div>

                    <div>
                        <span>FontSize</span>
                        <select onChange={(e) => setFont(e.target.value)} >
                            {fontsizes.map((size) => (
                                <option value={size} > {size}</option>
                            ))
                            }
                        </select>
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
                                    if (!socket) return;
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
                                theme='vs-dark'
                                className='p-2 border rounded-2xl '
                                options={{
                                    readOnly: !isEditor,
                                    minimap: { enabled: false },
                                    fontSize: font,
                                    wordWrap: "on",
                                    lineNumbers: "on",
                                    tabSize: 2,
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
                                className='flex flex-col flex-1  h-full  w-full py-2 rounded-2xl shadow-2xl  transition-colors duration-300 '
                            >

                                <p className='px-4 text-2xl font-semibold'>Members</p>
                                <div className='flex flex-col'>

                                    {members.map((item) => (
                                        <div key={username} className="flex justify-between items-center w-full px-4 py-2" >
                                            <div className='flex-1'>{item.username}</div>
                                            <div>
                                                <IOSSwitch
                                                    checked={item.access === 'true' ? true : false}
                                                    onChange={() => changeAccess(item.username)}
                                                    inputProps={{ 'aria-label': 'iOS design switch' }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>


                            </div>

                            <div
                                className='flex flex-col flex-1  h-full  w-full py-2 rounded-2xl shadow-2xl  transition-colors duration-300 '
                            >
                                <button onClick={addNewFile}>➕ New File</button>

                                <ul>
                                    {Object.keys(files).map(fileName => (
                                        <li
                                            key={fileName}
                                            onClick={() => setActiveFile(fileName)}
                                            style={{ cursor: 'pointer', background: activeFile === fileName ? '#ddd' : 'transparent' }}
                                        >
                                            {fileName}
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
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                            </svg>

                        </div>
                        <div>Terminal</div>
                        <div className='pl-8 items-center justify-center w-80'> {loading && <div className='flex gap-2'> <p className='items-center justify-center'>Loading results</p>
                            <Loading></Loading>
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
                            className={` w-full  flex flex-col `}

                        >
                            {history.map(item => (
                                <div className='flex flex-col py-1 px-8'>

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
