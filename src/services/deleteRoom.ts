import { sendLobbyInfo, sendMessage } from '../utils/index.js';

/**
 * Removes all clients from the room where the client is in, then deletes the room.
 * 
 * @param {ExtendedWebSocket} socket - The WebSocket connection object.
 * @param {Rooms} rooms - A map containing all active rooms on the server.
 * 
 * @returns {void} This function does not return any value.
 */
export function deleteRoom(
  socket: ExtendedWebSocket,
  rooms: Rooms
): void {
  const roomCode: number = socket.roomCode || -1;

  if (rooms.has(roomCode)) {
    sendMessage(socket, rooms, { event: 'GAME_OVER' }, true);

    rooms.get(roomCode)?.clients.forEach((client: ExtendedWebSocket) => {
      client.roomCode = undefined;
      client.user = undefined;
    });

    rooms.delete(roomCode);
    sendLobbyInfo(rooms);
  }
}