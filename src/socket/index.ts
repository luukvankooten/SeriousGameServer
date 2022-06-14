import { Server, ServerOptions, Socket } from 'socket.io';
import type { Server as HTTPSServer } from 'https';
import http from 'http';
import { JoinRoom } from '../services/rooms.service';
import CreateDisconectionHandler from './handlers/disconnection.handler';
import CreateStartGameHandler from './handlers/start-game.handler';
import CreateAssignRoleHandler from './handlers/assign-role.handler';
import CreateRoundHandler from './handlers/round.handler';

export default function SocketIOFactory(
  srv?: undefined | Partial<ServerOptions> | http.Server | HTTPSServer | number,
) {
  const server = new Server(srv);

  const onConnection = async (socket: Socket) => {
    const id = socket.handshake.query.roomUri?.toString();

    if (!id) {
      socket.disconnect(true);
      return;
    }

    const joinRoom = JoinRoom(id, socket.id);

    if (!joinRoom) {
      socket.disconnect(true);
      return;
    }

    const [room] = joinRoom;

    socket.join(id);

    CreateDisconectionHandler(server, socket, room);
    CreateStartGameHandler(server, socket, room);
    CreateAssignRoleHandler(server, socket, room);
    CreateRoundHandler(server, socket, room);
  };

  server.on('connection', onConnection);

  return server;
}
