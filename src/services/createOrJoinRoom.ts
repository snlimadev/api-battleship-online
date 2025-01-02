import {
  getGameSettings,
  getNewRoomCode,
  initializeGameState,
  sendLobbyInfo,
  sendMessage
} from '../utils/index.js';

/**
 * Creates a new room or adds the client to an existing room based on the
 * `action` and `roomOptions` fields in the received message, then sends back
 * the corresponding `roomOptions` to the client.
 * 
 * @param {ExtendedWebSocket} socket - The WebSocket connection object.
 * @param {Rooms} rooms - A map containing all active rooms on the server.
 * @param {IncomingMessageParams} parsedMessage - The parsed JSON message received.
 * 
 * @returns {void} This function does not return any value.
 */
export function createOrJoinRoom(
  socket: ExtendedWebSocket,
  rooms: Rooms,
  parsedMessage: IncomingMessageParams
): void {
  const { action, roomOptions } = parsedMessage;
  const isPublic = roomOptions?.isPublic || 'Y';
  const roomCode = roomOptions?.roomCode || -1;
  const gameMode = roomOptions?.gameMode || 'CLASSIC';

  const user: SocketUser = (action === 'CREATE_ROOM') ? 'PLAYER_1' : 'PLAYER_2';
  const isClassic: boolean = gameMode !== 'MOBILE';
  let newRoomCode: number = -1;
  let errorMessage: string = '';

  if (socket.roomCode) {
    sendMessage(socket, rooms, { error: 'You are already in a room.' });
    return;
  }

  if (action === 'CREATE_ROOM') {
    const gameSettings: GameSettings = getGameSettings(false, { isClassic: isClassic });
    newRoomCode = getNewRoomCode(rooms);

    if (newRoomCode > 0) {
      rooms.set(newRoomCode, {
        clients: new Set(),
        isPublic: isPublic !== 'N',
        isClassic: isClassic,
        hasGameStarted: false,
        gameState: {
          player1State: initializeGameState(gameSettings),
          player2State: initializeGameState(gameSettings)
        },
        roundState: {
          hasRoundStarted: false,
          playerTurn: 'PLAYER_1'
        }
      });
    } else {
      errorMessage = 'Failed to create the room. Please try again later.';
    }
  } else {
    const existingRoom: RoomParams | undefined = rooms.get(roomCode);

    if (!(roomCode > 0) || !existingRoom) {
      errorMessage = 'The room does not exist.';
    } else if (!(existingRoom.clients.size < 2)) {
      errorMessage = 'The room is full.';
    }
  }

  if (errorMessage !== '') {
    sendMessage(socket, rooms, { error: errorMessage });
    return;
  }

  const socketRoomCode: number = (newRoomCode > 0) ? newRoomCode : roomCode;
  const room: RoomParams | undefined = rooms.get(socketRoomCode);

  if (room) {
    socket.roomCode = socketRoomCode;
    socket.user = user;
    room.clients.add(socket);
    sendLobbyInfo(rooms);

    sendMessage(socket, rooms, {
      roomOptions: {
        isPublic: (room.isPublic) ? 'Y' : 'N',
        roomCode: socket.roomCode,
        gameMode: (room.isClassic) ? 'CLASSIC' : 'MOBILE'
      }
    });

    if (action === 'JOIN_ROOM') {
      room.hasGameStarted = true;
      sendMessage(socket, rooms, { event: 'GAME_START' }, true);
    }
  } else {
    sendMessage(socket, rooms, { error: 'Unknown error. Please try again later.' });
  }
}