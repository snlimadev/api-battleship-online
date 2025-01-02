/**
 * Initializes the game state based on the provided `gameSettings` parameter.
 * 
 * @param {GameSettings} gameSettings - The `CLASSIC` or `MOBILE` game settings.
 * 
 * @returns {GameState} The initialized game state.
 */
export function initializeGameState(gameSettings: GameSettings): GameState {
  const { shipSizes } = gameSettings;

  const newGameState: GameState = {
    isReady: false,
    ships: shipSizes.map(size => Array.from({ length: size }, () => [])),
    remainingShips: shipSizes.length,
    hits: Array.from({ length: shipSizes.length }, () => []),
    misses: []
  };

  return newGameState;
}