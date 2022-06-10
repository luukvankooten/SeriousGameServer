import { Server, Socket } from 'socket.io';
import Room from '../../models/room.model';

export default function CreateStartGameHandler(
  _io: Server,
  socket: Socket,
  room: Room,
) {
  socket.on('game:start', (arg) => {
    try {
      room.startGame();
      socket.emit('game:started');
    } catch (e) {
      socket.emit('error', e);
    }
  });
}
