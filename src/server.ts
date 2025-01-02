import { WebSocketServer } from 'ws';
import { PORT } from './config/config.js';
import { handleConnection } from './events/index.js';

const server: WebSocketServer = new WebSocketServer({ port: PORT });
const rooms: Rooms = new Map();

server.on('connection', (socket: ExtendedWebSocket) => {
  handleConnection(socket, rooms);
});

server.on('listening', () => {
  console.log(`WebSocket server is running on port ${server.options.port}`);
});