import { LOBBY_ROOM_CODE } from '../config/config.js';
import { sendLobbyInfo, sendMessage } from '../utils/index.js';

/**
 * Creates the lobby room if it does not exist, then adds the client to the lobby.
 * 
 * @param {ExtendedWebSocket} socket - The WebSocket connection object.
 * @param {Rooms} rooms - A map containing all active rooms on the server.
 * 
 * @returns {void} This function does not return any value.
 */
export function addToLobby(
  socket: ExtendedWebSocket,
  rooms: Rooms
): void {
  if (!rooms.has(LOBBY_ROOM_CODE)) {
    rooms.set(LOBBY_ROOM_CODE, {
      clients: new Set(),
      isPublic: false
    });
  }

  const lobbyRoom: RoomParams | undefined = rooms.get(LOBBY_ROOM_CODE);

  if (lobbyRoom) {
    if (!lobbyRoom.clients.has(socket)) {
      lobbyRoom.clients.add(socket);
      sendLobbyInfo(rooms);
    } else {
      sendMessage(socket, rooms, { error: 'You are already in the lobby.' });
    }
  }
}