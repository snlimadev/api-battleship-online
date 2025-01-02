import { checkIfGameStarted, getGameSettings, sendMessage } from '../utils/index.js';

/**
 * Checks if the `ships` field in the received message is valid, then marks the
 * player as ready and starts the round if both players are ready.
 * 
 * @param {ExtendedWebSocket} socket - The WebSocket connection object.
 * @param {Rooms} rooms - A map containing all active rooms on the server.
 * @param {IncomingMessageParams} parsedMessage - The parsed JSON message received.
 * 
 * @returns {void} This function does not return any value.
 */
export function validateRoundStart(
  socket: ExtendedWebSocket,
  rooms: Rooms,
  parsedMessage: IncomingMessageParams
): void {
  //#region Check if the game has started, but the round has not yet
  const errorMessage: string = checkIfGameStarted(socket, rooms, false);

  if (errorMessage) {
    sendMessage(socket, rooms, { error: errorMessage });
    return;
  }
  //#endregion

  const { ships } = parsedMessage;
  const room: RoomParams | undefined = rooms.get(socket.roomCode || -1);
  const gameSettings: GameSettings = getGameSettings(true, { room: room });
  const { shipSizes, rows, columns } = gameSettings;

  const playerState: GameState | undefined = (socket.user === 'PLAYER_1')
    ? room?.gameState?.player1State
    : room?.gameState?.player2State;

  const sendInvalidCoordError = (): void => {
    sendMessage(socket, rooms, { error: 'Invalid ship coordinate.' });
  };

  if (playerState?.isReady) {
    sendMessage(socket, rooms, { error: 'Please wait until your opponent is ready.' });
    return;
  }

  if (ships?.length !== shipSizes.length) {
    sendMessage(socket, rooms, { error: 'Wrong number of ships.' });
    return;
  }

  for (let i: number = 0; i < shipSizes.length; i++) {
    const ship: Ship = ships[i];

    if (ship.startPosition?.length !== 2 || ship.isVertical === undefined) {
      sendMessage(socket, rooms, { error: 'Invalid ship properties.' });
      return;
    }

    const startRow: number = ship.startPosition[0];
    const startCol: number = ship.startPosition[1];
    const isVertical: boolean = ship.isVertical;

    if (
      !(Number.isSafeInteger(startRow) && startRow >= 0 && startRow < rows) ||
      !(Number.isSafeInteger(startCol) && startCol >= 0 && startCol < columns) ||
      !((isVertical && startRow + shipSizes[i] <= rows) ||
        (!isVertical && startCol + shipSizes[i] <= columns))
    ) {
      sendInvalidCoordError();
      return;
    }

    for (let j: number = 0; j < shipSizes[i]; j++) {
      const coord: [number, number] = (isVertical)
        ? [startRow + j, startCol]
        : [startRow, startCol + j];

      if (playerState) {
        const hasCoordBeenUsed: boolean = playerState.ships.some(currShip =>
          currShip.some(([r, c]) => r === coord[0] && c === coord[1])
        );

        if (hasCoordBeenUsed) {
          playerState.ships = shipSizes.map(size =>
            Array.from({ length: size }, () => [])
          );

          sendInvalidCoordError();
          return;
        }

        playerState.ships[i][j] = coord;
      }
    }
  }

  if (room?.gameState && room.roundState && playerState) {
    playerState.isReady = true;

    if (room.gameState.player1State.isReady && room.gameState.player2State.isReady) {
      room.roundState.hasRoundStarted = true;
      sendMessage(socket, rooms, { event: 'ROUND_START' }, true);
    }
  }
}