import { GAME_SETTINGS } from '../config/config.js';

/**
 * Retrieves the appropriate game settings based on the `room` object or the
 * `isClassic` flag provided in the `options` parameter.
 * 
 * @param {boolean} shouldGetSettingsByRoom - A flag indicating whether the
 * returned game settings should be determined based on the `room` object.
 * @param {Object} options - An object containing either the `room` object (if
 * `shouldGetSettingsByRoom` is `true`) or the `isClassic` flag (if `false`).
 * 
 * @returns {GameSettings} The appropriate game settings based on the provided parameters.
 */
export function getGameSettings(
  shouldGetSettingsByRoom: boolean,
  options: {
    room?: RoomParams,
    isClassic?: boolean
  }
): GameSettings {
  if (shouldGetSettingsByRoom) {
    return (options.room?.isClassic) ? GAME_SETTINGS.CLASSIC : GAME_SETTINGS.MOBILE;
  } else {
    return (options.isClassic) ? GAME_SETTINGS.CLASSIC : GAME_SETTINGS.MOBILE;
  }
}