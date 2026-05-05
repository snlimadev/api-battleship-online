import WebSocket from 'ws';

/**
 * Pings the client if active; otherwise, terminates their connection.
 * 
 * @param {ExtendedWebSocket} socket - The WebSocket connection object.
 * 
 * @returns {void} This function does not return any value.
 */
export function handlePing(socket: ExtendedWebSocket): void {
  try {
    if (socket.readyState !== WebSocket.OPEN || !socket.isAlive) {
      socket.terminate();
      return;
    }

    socket.isAlive = false;

    try {
      socket.ping();
    } catch {
      socket.terminate();
    }
  } catch (error) {
    console.error('Error handling ping: ', error);
  }
}