import { WebSocketServer } from 'ws';
import { PORT, HEARTBEAT_INTERVAL } from './config/config.js';
import { handleConnection, handlePing } from './events/index.js';

const server: WebSocketServer = new WebSocketServer({ port: PORT });
const rooms: Rooms = new Map();

server.on('connection', (socket: ExtendedWebSocket) => {
  handleConnection(socket, rooms);
});

const interval: NodeJS.Timeout = setInterval(() => {
  server.clients.forEach((socket: ExtendedWebSocket) => {
    handlePing(socket);
  });
}, HEARTBEAT_INTERVAL);

server.on('close', () => {
  clearInterval(interval);
});

server.on('error', console.error);

server.on('listening', () => {
  console.log(`WebSocket server is running on port ${server.options.port}`);
});