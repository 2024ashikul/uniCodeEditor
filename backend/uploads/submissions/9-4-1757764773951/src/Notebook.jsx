import React, { useEffect, useState } from 'react';
import { Notebook } from '@datalayer/jupyter-react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

export default function MiniJupyterNotebook() {
  const [roomId] = useState('demo-room');
  const [code, setCode] = useState("print('Hello from React Jupyter Notebook!')");
  const [cells, setCells] = useState([]);

  useEffect(() => {
    socket.emit('join', roomId);

    socket.on('cellResult', ({ result }) => {
      setCells(prev => [...prev, { code: result.code, output: result.stdout || result.stderr }]);
    });

    return () => {
      socket.off('cellResult');
    };
  }, [roomId]);

  const runCode = () => {
    socket.emit('runCell', { roomId, code });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>React Jupyter Notebook Prototype</h2>
      <textarea
        style={{ width: '100%', height: '150px' }}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <br />
      <button onClick={runCode} style={{ marginTop: '10px' }}>Run</button>

      <div style={{ marginTop: '20px' }}>
        {cells.map((cell, idx) => (
          <div key={idx} style={{ marginBottom: '15px' }}>
            <pre style={{ background: '#eee', padding: '10px' }}>{cell.code}</pre>
            <pre style={{ background: '#111', color: '#0f0', padding: '10px' }}>{cell.output}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
