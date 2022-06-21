import { Server, Socket } from 'socket.io';
import Room from '../../models/room.model';
import RegisterRoomGameStartedHandler from '../events/handlers/room-game-started.handler';

export default function CreateStartGameHandler(
  io: Server,
  socket: Socket,
  room: Room,
) {
  socket.once('game:start', (data) => {
    const [handler] = RegisterRoomGameStartedHandler(io, socket, room);
    try {
      const chatEnabled = Boolean(data.chat ?? false);
      room.startGame(io, chatEnabled);
    } catch (e) {
      socket.emit('error', e);
      console.error(e);
      room.removeListener('game:started', handler);
    }
  });
}
