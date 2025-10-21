// server.js
import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 3000 });
const peers = new Map();

wss.on("connection", (ws) => {
  const id = Math.random().toString(36).substring(2, 9);
  peers.set(id, ws);
  ws.send(JSON.stringify({ type: "welcome", id }));
  console.log(`Peer connected: ${id}`);

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);
    if (data.to && peers.has(data.to)) {
      peers.get(data.to).send(JSON.stringify({ ...data, from: id }));
    }
  });

  ws.on("close", () => {
    peers.delete(id);
    console.log(`Peer disconnected: ${id}`);
  });
});

console.log("Signaling server running on ws://localhost:3000");
