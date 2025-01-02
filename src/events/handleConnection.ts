import { handleMessage } from './handleMessage.js';
import { handleClose } from './handleClose.js';

/**
 * Handles the WebSocket `connection` event by setting up event listeners for
 * the `message`, `close` and `error` events.
 * 
 * @param {ExtendedWebSocket} socket - The WebSocket connection object.
 * @param {Rooms} rooms - A map containing all active rooms on the server.
 * 
 * @returns {void} This function does not return any value.
 */
export function handleConnection(
  socket: ExtendedWebSocket,
  rooms: Rooms
): void {
  socket.on('message', (message: string) => {
    try {
      handleMessage(socket, rooms, message);
    } catch (error) {
      console.error('Error handling message event: ', error);
    }
  });

  socket.on('close', () => {
    try {
      handleClose(socket, rooms);
    } catch (error) {
      console.error('Error handling close event: ', error);
    }
  });

  socket.on('error', console.error);
}