import { Server, Socket } from 'socket.io';
import Room from '../../models/room.model';
import RegisterRoomGameStartedHandler from '../events/handlers/room-game-started.handler';

export default function CreateStartGameHandler(
  io: Server,
  socket: Socket,
  room: Room,
) {
  socket.once('game:start', () => {
    const [handler] = RegisterRoomGameStartedHandler(io, socket, room);
    try {
      room.startGame();
    } catch (e) {
      socket.emit('error', e);
      console.error(e);
      room.removeListener('game:started', handler);
    }
  });
}
