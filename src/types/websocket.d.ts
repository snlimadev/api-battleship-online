import WebSocket from 'ws';

declare global {
  interface ExtendedWebSocket extends WebSocket {
    roomCode?: number,
    user?: SocketUser
  }

  interface IncomingMessageParams {
    action?: 'CREATE_ROOM' | 'JOIN_ROOM' | 'DELETE_ROOM' | 'ENTER_LOBBY'
      | 'EXIT_LOBBY' | 'START_ROUND' | 'MAKE_MOVE',
    roomOptions?: RoomOptions,
    ships?: Ship[],
    move?: [number, number]
  }

  interface OutgoingMessageParams {
    event?: 'GAME_START' | 'GAME_OVER' | 'ROUND_START' | 'ROUND_OVER',
    roomOptions?: RoomOptions,
    lobbyInfo?: LobbyInfo,
    moveInfo?: MoveInfo,
    winner?: SocketUser,
    error?: string
  }

  interface RoomParams {
    clients: Set<ExtendedWebSocket>,
    isPublic: boolean,
    isClassic?: boolean,
    hasGameStarted?: boolean,
    gameState?: {
      player1State: GameState,
      player2State: GameState
    },
    roundState?: RoundState
  }

  interface RoomOptions {
    isPublic?: 'Y' | 'N',
    roomCode?: number,
    gameMode?: 'CLASSIC' | 'MOBILE'
  }

  interface LobbyInfo {
    rooms: number[],
    playersOnlineCount: number,
    activeRoomsCount: number
  }

  interface MoveInfo {
    move: [number, number],
    player: SocketUser,
    isHit: boolean,
    hitInfo?: {
      shipIndex: number,
      isSunk: boolean
    }
  }

  type Rooms = Map<number, RoomParams>;

  type SocketUser = 'PLAYER_1' | 'PLAYER_2';
}

export { };