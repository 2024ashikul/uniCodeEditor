import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import MonacoEditor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
const socket = io('http://localhost:3000');

function CollaborateTest({ roomId, isTeacher }) {
    const [code, setCode] = useState('// Start coding...');
    const editorRef = useRef(null);
    const teacherCursorDecoration = useRef([]);
    const latestTeacherCursor = useRef(null);
    const pointerRef = useRef(null);

    useEffect(() => {
        if (!isTeacher) {
            socket.on('pointerUpdate', ({ x, y }) => {
                if (pointerRef.current) {
                    pointerRef.current.style.left = `${x}px`;
                    pointerRef.current.style.top = `${y}px`;
                }
            });

            return () => socket.off('pointerUpdate');
        }
    }, [isTeacher]);

    function renderTeacherCursor() {
            if (!isTeacher && editorRef.current && latestTeacherCursor.current) {
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


    useEffect(() => {
        console.log("here")
        socket.emit('joinRoom', roomId);

        socket.on('codeUpdate', (newCode) => {
            if (!isTeacher) {
                setCode(newCode);
            }
        });

        
        socket.on('cursorUpdate', (cursorPos) => {
            latestTeacherCursor.current = cursorPos;
            renderTeacherCursor();

        });

        return () => {
            socket.off('codeUpdate');
            socket.off('cursorUpdate');
        };
    }, [roomId, isTeacher,renderTeacherCursor]);

    useEffect(() => {
        if (!isTeacher) return;

        function handleMouseMove(e) {
            const pos = { x: e.clientX, y: e.clientY };
            socket.emit('pointerMove', { roomId, pos });
        }

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isTeacher, roomId]);


    function handleCodeChange(value) {
        setCode(value);
        renderTeacherCursor();
        if (isTeacher) {
            const pos = editorRef.current.getPosition();
            socket.emit('codeChange', { roomId, code: value });
            socket.emit('cursorChange', { roomId, cursor: pos });
        }
    }
    function handleEditorMount(editor, monacoInstance) {
        editorRef.current = editor;

        if (isTeacher) {
            editor.onDidChangeCursorPosition((e) => {
                socket.emit('cursorChange', {
                    roomId,
                    cursor: e.position,
                });
            });
        }
    }


    return (
        <div style={{ position: 'relative' }} >
            <MonacoEditor
                height="90vh"
                language="javascript"
                value={code}
                onChange={handleCodeChange}
                options={{ readOnly: !isTeacher }}
                onMount={handleEditorMount}
            />

            {!isTeacher && (
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
        </div>
    );

}

export default CollaborateTest;
