import { Server, Socket } from 'socket.io';
import { roleFromString, roleToString } from '../../models/player.model';
import Room from '../../models/room.model';

export default function CreateAssignRoleHandler(
  io: Server,
  socket: Socket,
  room: Room,
) {
  socket.on('role:assign', (data) => {
    const role = roleFromString(String(data.role));

    try {
      const user = room.getPlayer(socket.id);

      user?.assignRole(role);
    } catch (e) {
      socket.emit('error', {
        message: 'Role already assigned',
      });

      console.error(e);
    }
  });
}
