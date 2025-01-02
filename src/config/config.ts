export const PORT: number = 8080;

export const LOBBY_ROOM_CODE: number = 0;

export const MAX_ROOM_COUNTER: number = 9999;

export const GAME_SETTINGS: GameSettingsMap = {
  CLASSIC: {
    shipSizes: [2, 3, 3, 4, 5],
    rows: 10,
    columns: 10
  },
  MOBILE: {
    shipSizes: [2, 2, 3],
    rows: 6,
    columns: 6
  }
};