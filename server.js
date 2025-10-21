import { WebSocketServer } from 'ws';
import http from 'http';

const server = http.createServer();
const wss = new WebSocketServer({ server });

const peers = new Map();

wss.on('connection', (ws) => {
  const id = Math.random().toString(36).substring(2, 9);
  peers.set(id, ws);
  console.log('New connection:', id);

  ws.send(JSON.stringify({ type: 'id', id }));

  ws.on('message', (msg) => {
    const data = JSON.parse(msg);
    const target = peers.get(data.to);
    if (target) target.send(JSON.stringify({ ...data, from: id }));
  });

  ws.on('close', () => peers.delete(id));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Signaling server running on port ${PORT}`);
});
