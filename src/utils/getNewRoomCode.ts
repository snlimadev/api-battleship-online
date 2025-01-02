import { MAX_ROOM_COUNTER } from '../config/config.js';

let roomCounter: number = 0;

/**
 * Generates a new room code based on a counter and a random integer.
 * 
 * @param {Rooms} rooms - A map containing all active rooms on the server.
 * 
 * @returns {number} The generated room code, or -1 if the code is already in use.
 */
export function getNewRoomCode(rooms: Rooms): number {
  if (!(roomCounter < MAX_ROOM_COUNTER)) {
    roomCounter = 0;
  }

  const randomInt: number = Math.floor(1000 + Math.random() * 9000);
  const roomCode: number = Number(String(++roomCounter) + String(randomInt));

  return (!rooms.has(roomCode)) ? roomCode : -1;
}