import { Server, Socket } from 'socket.io';
import { roleFromString, roleToString } from '../../models/player.model';
import Room from '../../models/room.model';

export default function CreateAssignRoleHandler(
  io: Server,
  socket: Socket,
  room: Room,
) {
  socket.on('role:assign', (data, callback: Function) => {
    const role = roleFromString(String(data.role));

    try {
      const user = room.getPlayer(socket.id);
      user?.assignRole(role);

      if (callback) {
        callback({
          ok: true,
          message: 'Role assigned',
        });
      };

      io.emit("role:assigned", {
        role: data.role
      })
    } catch (e) {
      if (callback) {
        callback({
          ok: false,
          message: 'Role already assigned',
        });
      };
      console.error(e);
    }
  });
}
