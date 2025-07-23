

import Editor from '@monaco-editor/react';

import { useState, useEffect } from 'react';
import Loading from './CodeEditor/Loading';


export default function CodeEditorTemp() {
    const [terminalHeight, setTerminalHeight] = useState(0);
    const [code, setCode] = useState(null);
    const [language, setLanguage] = useState(null);
    const [stdin, setStdin] = useState('');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [statement, setStatement] = useState(false);


    const [results, setResults] = useState({
        stdout: '',
        stderr: '',
        time: '',
        status: '',
        currentTime : ''
    })
    const [font, setFont] = useState(12);


    async function handleRun() {


        setLoading(true);

        await fetch('http://localhost:3000/runcode', {
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
                    currentTime : getTime()
                });

                setHistory((prev) => [...prev, results])
                setLoading(false);
                setTerminalHeight(30);
                console.log(loading)
            })
            .catch((err) => console.log(err))
    }
    async function handleSubmit() {

        await fetch('http://localhost:3000/submitcode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code, language })
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                alert(data.message)
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
    useEffect(() => {
        console.log(code);
    }, [code])
    return (
        <>
            <div className={`px-4 py-2 flex flex-col mx-12 my-12 fixed inset-0 z-50 rounded-2xl border-2 border-amber-500 bg-white/90 backdrop-blur-md transition-all duration-300 ease-in-out overflow-auto ${!statement ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}>
                <div className='flex '>
                    <div className='text text-3xl self-center mb-2 '>Problem Statement</div>
                    <div className='ml-auto'><button onClick={() => setStatement(false)}> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                    </button></div>
                </div>
                <div className='test-justify'>
                    ou are given an array 𝑎 of 𝑛 integers. We define the beauty of a number 𝑥 to be the number of 1 bits in its binary representation. We define the beauty of an array to be the sum of beauties of the numbers it contains.

                    In one operation, you can select an index 𝑖 (1≤𝑖≤𝑛) and increase 𝑎𝑖 by 1.

                    Find the maximum beauty of the array after doing at most 𝑘 operations.
                </div>

            </div>

            <div className={`flex flex-col transition-all overflow-auto h-screen duration-300 ${statement ? 'blur-sm pointer-events-none scale-95' : ''}`} >

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
                                onChange={e => setCode(e)}
                                language={language}
                                className='p-2 border rounded-2xl '
                                options={{
                                    readOnly: false,
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
                            <div className='flex justify-center items-center bg-blue-500 w-full py-2 rounded-2xl shadow-2xl'>
                                <button onClick={() => setStatement(true)}>Problem Statement</button>
                            </div>
                            <textarea type='text' placeholder='Input STDIN' className='border h-full w-full rounded-2xl focus:outline-0 p-4 resize-none' onChange={(e) => setStdin(e.target.value)}
                                style={{ fontSize: `${font}` }}>

                            </textarea>
                            <div
                                className='flex justify-center items-center bg-slate-300   w-full py-2 rounded-2xl shadow-2xl hover:bg-blue-500 active:font-bold active:bg-yellow-300  transition-colors duration-300 '
                                onClick={handleRun}>

                                Run

                            </div>
                            <div className='flex justify-center items-center bg-blue-500 w-full py-2 rounded-2xl shadow-2xl' onClick={handleSubmit} >

                                Submit

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
                        // style={{
                        //     maxHeight : `${terminalHeight}%`,
                        //     transition: 'max-height 0.5s ease',
                        //     overflow: 'auto'
                        // }}
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
