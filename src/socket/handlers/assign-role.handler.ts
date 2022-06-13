import { Server, Socket } from 'socket.io';
import { roleFromString } from '../../models/player.model';
import Room from '../../models/room.model';

export default function CreateAssignRoleHandler(
  io: Server,
  socket: Socket,
  room: Room,
) {
  socket.on('role:assign', (data, event) => {
    const role = roleFromString(String(data.role));

    console.log(socket.id, room.players);
    const user = room.getPlayer(socket.id);

    if (!user) {
      socket.emit('error', {
        message: 'No player found',
      });
      return;
    }

    user.role = role;

    console.log(user);
  });
}
