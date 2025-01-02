import {
  checkIfGameStarted,
  getGameSettings,
  initializeGameState,
  sendMessage,
  validateMove
} from '../utils/index.js';

/**
 * Updates the game state and round state based on the current player's `move`,
 * then sends a message with the `moveInfo` field to both players in the room.
 * 
 * @param {ExtendedWebSocket} socket - The WebSocket connection object.
 * @param {Rooms} rooms - A map containing all active rooms on the server.
 * @param {IncomingMessageParams} parsedMessage - The parsed JSON message received.
 * 
 * @returns {void} This function does not return any value.
 */
export function updateGameState(
  socket: ExtendedWebSocket,
  rooms: Rooms,
  parsedMessage: IncomingMessageParams
): void {
  //#region Check if both the game and the round have started
  const errorMessage: string = checkIfGameStarted(socket, rooms, true);

  if (errorMessage) {
    sendMessage(socket, rooms, { error: errorMessage });
    return;
  }
  //#endregion

  const { move } = parsedMessage;
  const room: RoomParams | undefined = rooms.get(socket.roomCode || -1);
  const gameSettings: GameSettings = getGameSettings(true, { room: room });
  const roundState: RoundState | undefined = room?.roundState;

  const playerState: GameState | undefined = (socket.user === 'PLAYER_1')
    ? room?.gameState?.player1State
    : room?.gameState?.player2State;

  const opponentState: GameState | undefined = (socket.user === 'PLAYER_1')
    ? room?.gameState?.player2State
    : room?.gameState?.player1State;

  const sendInvalidMoveError = (): void => {
    sendMessage(socket, rooms, { error: 'Invalid move.' });
  };

  if (roundState?.playerTurn !== socket.user) {
    sendMessage(socket, rooms, { error: 'Sorry, it is not your turn.' });
    return;
  }

  if (
    move?.length !== 2 ||
    !(Number.isSafeInteger(move[0]) && Number.isSafeInteger(move[1]))
  ) {
    sendInvalidMoveError();
    return;
  }

  if (room?.gameState && roundState && playerState && opponentState) {
    const ships: readonly number[][][] = opponentState.ships;
    const hits: number[][][] = playerState.hits;
    const misses: number[][] = playerState.misses;
    const playerTurn: SocketUser = roundState.playerTurn;

    let isHit: boolean = false;
    let shipIndex: number = -1;
    let isSunk: boolean = false;
    let isRoundOver: boolean = false;

    if (!validateMove(gameSettings, playerState, move)) {
      sendInvalidMoveError();
      return;
    }

    for (let i: number = 0; i < ships.length; i++) {
      if (ships[i].some(ship => move[0] === ship[0] && move[1] === ship[1])) {
        isHit = true;
        shipIndex = i;
        break;
      }
    }

    let moveInfo: MoveInfo = {
      move: move,
      player: playerTurn,
      isHit: isHit
    };

    if (isHit) {
      hits[shipIndex].push(move);

      if (hits[shipIndex].length === ships[shipIndex].length) {
        isSunk = true;
        opponentState.remainingShips -= 1;

        if (opponentState.remainingShips === 0) {
          isRoundOver = true;
          roundState.hasRoundStarted = false;
          room.gameState.player1State = initializeGameState(gameSettings);
          room.gameState.player2State = initializeGameState(gameSettings);
        }
      }

      moveInfo = { ...moveInfo, hitInfo: { shipIndex: shipIndex, isSunk: isSunk } };
    } else {
      misses.push(move);
    }

    sendMessage(socket, rooms, { moveInfo: moveInfo }, true);

    if (isRoundOver) {
      sendMessage(socket, rooms, { event: 'ROUND_OVER', winner: playerTurn }, true);
    }

    roundState.playerTurn = (playerTurn === 'PLAYER_1') ? 'PLAYER_2' : 'PLAYER_1';
  }
}