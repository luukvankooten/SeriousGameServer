import { Server, Socket } from 'socket.io';

export default function CreateAssignRoleHandler(
  io: Server,
  socket: Socket,
  room: Room,
) {
  socket.on('role:assign', () => {});
}
