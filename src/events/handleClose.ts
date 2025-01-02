import { deleteRoom, removeFromLobby } from '../services/index.js';

/**
 * Handles the WebSocket `close` event by calling cleanup services.
 * 
 * @param {ExtendedWebSocket} socket - The WebSocket connection object.
 * @param {Rooms} rooms - A map containing all active rooms on the server.
 * 
 * @returns {void} This function does not return any value.
 */
export function handleClose(
  socket: ExtendedWebSocket,
  rooms: Rooms
): void {
  removeFromLobby(socket, rooms);
  deleteRoom(socket, rooms);
}