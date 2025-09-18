import Editor from '@monaco-editor/react';
import { useState, useEffect, useContext } from 'react';
import Loading from './CodeEditor/Loading';
import { AuthContext } from '../Contexts/AuthContext/AuthContext';
import { UIContext } from '../Contexts/UIContext/UIContext';
import { Play, SendHorizontal, BadgeQuestionMark, Check } from 'lucide-react';
import CustomDropDown from './SharedComponents/CustomDropDown';
import MDEditor from "@uiw/react-md-editor";
import { API_URL } from '../config';
import { AlertContext } from '../Contexts/AlertContext/AlertContext';

export default function CodeEditor({ problemId }) {
    const [terminalHeight, setTerminalHeight] = useState(0);
    const [code, setCode] = useState(null);
    const [language, setLanguage] = useState('C#');
    const [stdin, setStdin] = useState('');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [statement, setStatement] = useState(false);
    const { userId } = useContext(AuthContext);
    const [problem, setProblem] = useState({});
    const { setNavCenter, setScrollHeight } = useContext(UIContext);
    const { setMessage } = useContext(AlertContext);
    useEffect(() => {
        setScrollHeight(0)
    }, [setScrollHeight]);
    const { token } = useContext(AuthContext);

    const languages = ['python', 'cpp', 'csharp'];
    const fontsizes = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
    const tabsizes = [2, 3, 4, 5, 6, 7, 8];

    const [font, setFont] = useState(12);
    const [tabSize, setTabSize] = useState(4);


    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setStatement(false);
            }
            if (e.key === "F2") { 
                setStatement(true);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);



    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const res = await fetch(`${API_URL}/problem/fetchone`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ problemId })
                })

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                setProblem(data)
                setNavCenter(data.title)

            } catch (err) {
                console.error("Failed to fetch lessons:", err);
            }
        };
        if (problemId) {
            fetchProblem();
        }
    }, [problemId, token, setNavCenter])


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
                const temp = {
                    stdout: data.stdout,
                    stderr: data.stderr,
                    time: data.time,
                    status: data.status,
                    currentTime: getTime(),
                    memory: data.memory
                }

                setLoading(false);
                setHistory((prev) => [...prev, temp])
                setTerminalHeight(30);
                console.log(loading)
            })
            .catch((err) => console.log(err))
    }

    async function handleSubmit() {
        try {
            const res = await fetch(`${API_URL}/submission/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ code, language, problemId, userId })
            })
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            setMessage(data.message)

        } catch (err) {
            console.log(err)
        }
    }

    function getTime() {
        const time = new Date().toLocaleTimeString();
        console.log(time);
        return time;
    }

    return (
        <>
            <div className={`px-4 py-2 flex flex-col mx-12 my-12 fixed inset-0 z-50 rounded-2xl border-2 border-amber-500 bg-white/90 backdrop-blur-md transition-all duration-300 ease-in-out overflow-auto ${!statement ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}>
                <div className='flex '>
                    <div className='text text-3xl flex items-center self-center mb-2 gap-2' ><BadgeQuestionMark />Problem Statement</div>
                    <div className='ml-auto'><button onClick={() => setStatement(false)}> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path strokeLinecap="round" StrokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                    </button></div>
                </div>
                <div className='test-justify'>
                    <MDEditor.Markdown source={problem.statement} />
                </div>

            </div>

            <div className={`flex flex-col transition-all overflow-auto h-screen duration-300 ${statement ? 'blur-sm pointer-events-none scale-95' : ''}`} >

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
                </div>
                <div className='flex flex-col flex-1 overflow-hidden'>
                    <div className={`flex flex-1  mb-2  gap-2 transition-all ease-in-out duration-300`}
                        style={{ maxHeight: terminalHeight == 0 ? '95%' : '70%' }}>
                        <div className={`flex flex-1 flex-col w-3/4 ml-4 h-full`}    >
                            <Editor
                                defaultLanguage='cpp'
                                height="100%"
                                onChange={e => setCode(e)}
                                language={language}
                                className='p-2 border rounded-2xl '
                                options={{
                                    readOnly: false,
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
                                className='flex gap-2 justify-center items-center bg-slate-300   w-full py-2 rounded-2xl shadow-2xl 
                                hover:bg-blue-500 active:font-bold active:bg-yellow-300  transition-colors duration-300
                                cursor-pointer hover:text-white'
                                onClick={() => setStatement(true)}
                            >
                                <BadgeQuestionMark /><p> Problem Statement (F2)</p>
                            </div>
                            <textarea type='text' placeholder='Input STDIN' className='border h-full w-full rounded-2xl focus:outline-0 p-4 resize-none' onChange={(e) => setStdin(e.target.value)}
                                style={{ fontSize: `${font}` }}>

                            </textarea>
                            <div
                                className='flex gap-2 justify-center items-center bg-slate-300   w-full py-2 rounded-2xl shadow-2xl 
                                hover:bg-blue-500 active:font-bold active:bg-yellow-300  transition-colors duration-300
                                cursor-pointer hover:text-white'
                                onClick={handleRun}>
                                <Play />Run
                            </div>
                            <div className='flex gap-2 justify-center items-center bg-slate-300   w-full py-2 rounded-2xl shadow-2xl 
                                hover:bg-blue-500 active:font-bold active:bg-yellow-300  transition-colors duration-300
                                cursor-pointer hover:text-white'
                                onClick={handleSubmit} >
                                <SendHorizontal /> Submit

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

                    <div className=' overflow-scroll bg-emerald-300 pt-0 pb-0 mb-0 transition-all duration-500'
                        style={{
                            maxHeight: `${terminalHeight}%`,
                            transition: 'max-height 0.5s ease',

                        }}>
                        <div
                            className={` w-full  flex flex-col `}
                        >
                            {history.map(item => (
                                <div className='flex flex-col pt-2 pb-3 px-8 shadow-lg '>

                                    <div className='flex'>
                                        <p className='px-2 text-[12px] text-neutral-50'>{item.currentTime}</p>
                                        <p className='px-2 text-[12px] text-neutral-50'>{item.status} </p>

                                        {item.stderr == null && <p className='px-2 text-[12px] text-neutral-50'>Time : {item.time || 'nan'} sec</p>}
                                        {item.stderr == null && <p className='px-2 text-[12px] text-neutral-50'>Memory : {item.memory / 1000000 + 'MB' || 'nan'} </p>}

                                    </div>
                                    {
                                        item.stderr == null ? (
                                            <p className='px-10 m-0 whitespace-pre-wrap'>{item.stdout}</p>
                                        ) : (
                                            <p className="text-red-500 p-0 m-0 px-10 whitespace-pre-wrap">{item.stderr}</p>

                                        )
                                    }
                                </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
