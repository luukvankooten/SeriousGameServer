import { Server, ServerOptions, Socket } from 'socket.io';
import type { Server as HTTPSServer } from 'https';
import http from 'http';
import CreateRoundHandler from './handlers/round.handler';
import { HasRoom, JoinRoom } from '../services/rooms.service';
import CreateDisconectionHandler from './handlers/disconnection.handler';
import RegisterRoomGameStartedHandler from './events/handlers/room-game-started.handler';
import CreateStartGameHandler from './handlers/start-game.handler';

export default function SocketIOFactory(
  srv?: undefined | Partial<ServerOptions> | http.Server | HTTPSServer | number,
) {
  const server = new Server(srv);

  const onConnection = (socket: Socket) => {
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

    socket.emit('connectedHello', { test: 'hello' });

    const [room, player] = joinRoom;

    socket.join(id);

    CreateDisconectionHandler(server, socket, room);

    RegisterRoomGameStartedHandler(server, socket, room);
    CreateStartGameHandler(server, socket, room);
  };

  server.on('connection', onConnection);

  return server;
}
