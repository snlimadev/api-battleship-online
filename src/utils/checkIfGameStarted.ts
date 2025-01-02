/**
 * Checks if the game and round have started, then returns an appropriate error
 * message if any expected conditions are not met.
 * 
 * @param {ExtendedWebSocket} socket - The WebSocket connection object.
 * @param {Rooms} rooms - A map containing all active rooms on the server.
 * @param {boolean} shouldRoundHaveStarted - Flags if the round is expected to have started.
 * 
 * @returns {string} An error message if applicable; otherwise, an empty string.
 */
export function checkIfGameStarted(
  socket: ExtendedWebSocket,
  rooms: Rooms,
  shouldRoundHaveStarted: boolean
): string {
  const room: RoomParams | undefined = rooms.get(socket.roomCode || -1);
  let errorMessage: string = '';

  if (!socket.roomCode) {
    errorMessage = 'You are not in a room.';
  } else if (!room?.hasGameStarted) {
    errorMessage = 'The game has not started yet.';
  } else if (shouldRoundHaveStarted && !room.roundState?.hasRoundStarted) {
    errorMessage = 'The round has not started yet.';
  } else if (!shouldRoundHaveStarted && room.roundState?.hasRoundStarted) {
    errorMessage = 'The round has already started.';
  }

  return errorMessage;
}