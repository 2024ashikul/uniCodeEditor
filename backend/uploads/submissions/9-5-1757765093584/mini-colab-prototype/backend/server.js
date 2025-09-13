import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import fetch from "node-fetch";
import WebSocket from "ws";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const JUPYTER_URL = "http://localhost:8888/api/kernels";
const JUPYTER_WS = "ws://localhost:8888/api/kernels";

const kernels = {};
const kernelSockets = {};
const wsReady = {}; // track WebSocket readiness per room

// 🔹 Start a new Jupyter kernel for a room
async function startKernel(roomId) {
  const res = await fetch(JUPYTER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const kernel = await res.json();
  console.log("Kernel response:", kernel);

  if (!kernel.id) {
    throw new Error("Kernel ID missing in response");
  }

  kernels[roomId] = kernel.id;

  const ws = new WebSocket(`${JUPYTER_WS}/${kernel.id}/channels`);
  wsReady[roomId] = false;

  ws.on("open", () => {
    console.log(`🔗 Kernel WebSocket connected for room: ${roomId}`);
    wsReady[roomId] = true;
  });

  ws.on("message", (data) => {
    const msg = JSON.parse(data.toString());

    if (msg.msg_type === "stream") {
      io.to(roomId).emit("cellResult", { result: { stdout: msg.content.text } });
    }

    if (msg.msg_type === "execute_result") {
      io.to(roomId).emit("cellResult", {
        result: { stdout: JSON.stringify(msg.content.data["text/plain"]) },
      });
    }

    if (msg.msg_type === "error") {
      io.to(roomId).emit("cellResult", {
        result: { stderr: msg.content.evalue },
      });
    }
  });

  kernelSockets[roomId] = ws;
  console.log("Kernel started for room", roomId, kernel.id);
  return kernel.id;
}

// 🔹 Run code inside the kernel
function runCode(roomId, code) {
  const ws = kernelSockets[roomId];
  if (!ws || !wsReady[roomId]) {
    console.error("❌ WebSocket not ready yet for room:", roomId);
    return;
  }

  const msg = {
    header: {
      msg_id: Math.random().toString(36).slice(2),
      username: "user",
      session: "session",
      msg_type: "execute_request",
      version: "5.3",
    },
    parent_header: {},
    metadata: {},
    content: {
      code,
      silent: false,
      store_history: true,
      user_expressions: {},
      allow_stdin: false,
      stop_on_error: true,
    },
  };

  ws.send(JSON.stringify(msg));
}

io.on("connection", (socket) => {
  console.log("New client:", socket.id);

  socket.on("join", async (roomId) => {
    socket.join(roomId);
    if (!kernels[roomId]) {
      try {
        await startKernel(roomId);
      } catch (err) {
        console.error("Failed to start kernel:", err.message);
        socket.emit("cellResult", {
          result: { stderr: "Kernel startup failed" },
        });
        return;
      }
    }
    socket.emit("joined", { roomId });
  });

  socket.on("runCell", ({ roomId, code }) => {
    console.log(`▶️ Running code in room ${roomId}:`, code);
    runCode(roomId, code);
  });
});

server.listen(4000, () => console.log("✅ Proxy running on port 4000"));
