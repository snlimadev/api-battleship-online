import WebSocket from 'ws';
import { LOBBY_ROOM_CODE } from '../config/config.js';

/**
 * Sends a list of available public rooms, along with the number of players online 
 * and the count of active rooms (excluding the lobby) to all clients in the lobby.
 * 
 * @param {Rooms} rooms - A map containing all active rooms on the server.
 * 
 * @returns {void} This function does not return any value.
 */
export function sendLobbyInfo(rooms: Rooms): void {
  const getLobbyInfo = (): LobbyInfo => {
    const availableRooms: number[] = [];
    const playersOnline: Set<ExtendedWebSocket> = new Set();

    rooms.forEach((room: RoomParams, roomCode: number) => {
      if (room.isPublic && room.clients.size < 2) {
        availableRooms.push(roomCode);
      }

      room.clients.forEach((client: ExtendedWebSocket) => {
        playersOnline.add(client);
      });
    });

    const lobbyInfo: LobbyInfo = {
      rooms: availableRooms,
      playersOnlineCount: playersOnline.size,
      activeRoomsCount: rooms.size - 1
    };

    return lobbyInfo;
  };

  if (rooms.has(LOBBY_ROOM_CODE)) {
    const message: OutgoingMessageParams = { lobbyInfo: getLobbyInfo() };

    rooms.get(LOBBY_ROOM_CODE)?.clients.forEach((client: ExtendedWebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
}