import WebSocket from 'ws';

/**
 * Sends a message to a specific client or to all clients in the same room.
 * 
 * @param {ExtendedWebSocket} socket - The WebSocket connection object.
 * @param {Rooms} rooms - A map containing all active rooms on the server.
 * @param {OutgoingMessageParams} message - The JSON message to be sent.
 * @param {boolean} [isForAllClientsInTheRoom=false] - Optional flag indicating
 * whether the message should be sent to all clients in the same room.
 * 
 * @returns {void} This function does not return any value.
 */
export function sendMessage(
  socket: ExtendedWebSocket,
  rooms: Rooms,
  message: OutgoingMessageParams,
  isForAllClientsInTheRoom?: boolean
): void {
  if (!isForAllClientsInTheRoom) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  } else {
    const room: RoomParams | undefined = rooms.get(socket.roomCode || -1);

    room?.clients.forEach((client: ExtendedWebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
}