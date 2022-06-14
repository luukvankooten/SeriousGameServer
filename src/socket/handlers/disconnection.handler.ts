import { Server, Socket } from 'socket.io';
import Room from '../../models/room.model';
import { LeaveRoom } from '../../services/rooms.service';

export default function CreateDisconectionHandler(
  _io: Server,
  socket: Socket,
  room: Room,
) {
  const onDisconnection = () => {
    LeaveRoom(room.id, socket.id);
    socket.removeAllListeners();
  };

  socket.on('disconnect', onDisconnection);
}
