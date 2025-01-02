import { sendMessage } from '../utils/index.js';

import {
  addToLobby,
  createOrJoinRoom,
  deleteRoom,
  removeFromLobby,
  updateGameState,
  validateRoundStart
} from '../services/index.js';

/**
 * Handles the WebSocket `message` event by calling the corresponding service
 * based on the `action` field in the received message.
 * 
 * @param {ExtendedWebSocket} socket - The WebSocket connection object.
 * @param {Rooms} rooms - A map containing all active rooms on the server.
 * @param {string} message - The incoming message as a JSON string.
 * 
 * @returns {void} This function does not return any value.
 */
export function handleMessage(
  socket: ExtendedWebSocket,
  rooms: Rooms,
  message: string
): void {
  try {
    const parsedMessage: IncomingMessageParams = JSON.parse(message);
    const { action } = parsedMessage;

    switch (action) {
      case 'CREATE_ROOM':
      case 'JOIN_ROOM':
        createOrJoinRoom(socket, rooms, parsedMessage);
        break;

      case 'DELETE_ROOM':
        deleteRoom(socket, rooms);
        break;

      case 'ENTER_LOBBY':
        addToLobby(socket, rooms);
        break;

      case 'EXIT_LOBBY':
        removeFromLobby(socket, rooms);
        break;

      case 'START_ROUND':
        validateRoundStart(socket, rooms, parsedMessage);
        break;

      case 'MAKE_MOVE':
        updateGameState(socket, rooms, parsedMessage);
        break;

      default:
        sendMessage(socket, rooms, { error: 'Invalid request.' });
        break;
    }
  } catch (error) {
    console.error(`Error processing message: ${error}`);
    sendMessage(socket, rooms, { error: 'Invalid JSON message received.' });
  }
}