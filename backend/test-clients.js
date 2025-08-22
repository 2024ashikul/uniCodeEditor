const { io } = require("socket.io-client");
const os = require("os");

const NUM_ROOMS = 100;
const CLIENTS_PER_ROOM = 100;
const TOTAL_CLIENTS = NUM_ROOMS * CLIENTS_PER_ROOM;
const STATS_INTERVAL = 5000; // stats update every 5 sec

let connectedClients = 0;
let totalEmits = 0;
const clients = [];

// Utility to simulate file changes per client
function simulateFileChange(socket, roomId, userId) {
  const interval = setInterval(() => {
    socket.emit("fileChange", {
      roomId,
      userId,
      files: {
        [`file${userId}.js`]: { language: "javascript", content: `console.log(${userId});` }
      }
    });
    totalEmits++;
  }, 5000);
  return interval;
}

// Stats logging
setInterval(() => {
  const memory = process.memoryUsage();
  console.log(`\n--- STATS ---`);
  console.log(`Connected clients: ${connectedClients}`);
  console.log(`Total emits: ${totalEmits}`);
  console.log(`RAM Usage: ${(memory.rss / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Heap Used: ${(memory.heapUsed / 1024 / 1024).toFixed(2)} MB`);
}, STATS_INTERVAL);

// Create clients in batches to avoid overwhelming the laptop
async function createClients() {
  for (let room = 0; room < NUM_ROOMS; room++) {
    for (let i = 0; i < CLIENTS_PER_ROOM; i++) {
      const userId = room * CLIENTS_PER_ROOM + i;
      const socket = io("http://localhost:3000/collabAuth");

      socket.on("connect", () => {
        connectedClients++;
        socket.emit("joinRoom", { roomId: `room${room}`, userId: `user${userId}` });

        // start file simulation
        simulateFileChange(socket, `room${room}`, `user${userId}`);
      });

      socket.on("disconnect", () => {
        connectedClients--;
      });

      // Optional: track roomData without logging every client
      socket.on("roomData", (data) => {
        // Here you could do analysis instead of console.log
        // e.g., count active members, total files, etc.
      });

      clients.push(socket);

      // Throttle connections to avoid socket overflow
      if (userId % 50 === 0) {
        await new Promise(res => setTimeout(res, 10)); // 10ms delay
      }
    }
  }
}

createClients().then(() => {
  console.log(`All clients attempted to connect.`);
});
