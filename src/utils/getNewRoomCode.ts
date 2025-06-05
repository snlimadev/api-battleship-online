import { MAX_ROOM_COUNTER } from '../config/config.js';

let roomCounter: number = 0;

/**
 * Generates a new room code based on a random integer and a counter, or
 * validates the provided `roomCode`.
 * 
 * @param {Rooms} rooms - A map containing all active rooms on the server.
 * @param {number} roomCode - The room code provided by the client, or -1 if none.
 * 
 * @returns {number} The new room code, or -1 if the code is already in use.
 */
export function getNewRoomCode(rooms: Rooms, roomCode: number): number {
  let newRoomCode: number = roomCode;

  if (newRoomCode === -1) {
    if (!(roomCounter < MAX_ROOM_COUNTER)) {
      roomCounter = 0;
    }

    const randomInt: number = Math.floor(1000 + Math.random() * 9000);
    newRoomCode = Number(String(randomInt) + String(++roomCounter));
  }

  if (!Number.isSafeInteger(newRoomCode) || rooms.has(newRoomCode)) {
    newRoomCode = -1;
  }

  return newRoomCode;
}