declare global {
  interface Ship {
    startPosition?: [number, number],
    isVertical?: boolean
  }

  interface GameSettings {
    shipSizes: number[],
    rows: number,
    columns: number
  }

  interface GameState {
    isReady: boolean,
    ships: number[][][],
    remainingShips: number,
    hits: number[][][],
    misses: number[][]
  }

  interface RoundState {
    hasRoundStarted: boolean,
    playerTurn: SocketUser
  }

  type GameMode = 'CLASSIC' | 'MOBILE';

  type GameSettingsMap = Record<GameMode, GameSettings>;
}

export { };