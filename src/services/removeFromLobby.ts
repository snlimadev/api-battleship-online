import { LOBBY_ROOM_CODE } from '../config/config.js';
import { sendLobbyInfo } from '../utils/index.js';

/**
 * Removes the client from the lobby, then deletes the lobby room if it becomes empty.
 * 
 * @param {ExtendedWebSocket} socket - The WebSocket connection object.
 * @param {Rooms} rooms - A map containing all active rooms on the server.
 * 
 * @returns {void} This function does not return any value.
 */
export function removeFromLobby(
  socket: ExtendedWebSocket,
  rooms: Rooms
): void {
  const lobbyRoom: RoomParams | undefined = rooms.get(LOBBY_ROOM_CODE);

  if (lobbyRoom?.clients.has(socket)) {
    lobbyRoom.clients.delete(socket);

    if (lobbyRoom.clients.size === 0) {
      rooms.delete(LOBBY_ROOM_CODE);
    } else {
      sendLobbyInfo(rooms);
    }
  }
}