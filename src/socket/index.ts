import { Server, ServerOptions, Socket } from 'socket.io';
import type { Server as HTTPSServer } from 'https';
import http from 'http';
import CreateRoomHandler from './handlers/room.handler';
import { HasRoom, JoinRoom, LeaveRoom } from '../services/rooms.service';

export default function SocketIOFactory(srv?: undefined | Partial<ServerOptions> | http.Server | HTTPSServer | number) {
  const server = new Server(srv);

  const onConnection = (socket: Socket) => {
    const id = socket.handshake.query.roomUri?.toString();

    if (!id) {
      return;
    }

    if (!HasRoom(id)) {
      return;
    }

    if (socket.rooms.size > 2) {
      return;
    }

    JoinRoom(id);
    socket.join(id);
    console.log('joined room');

    console.log(socket.id, socket.rooms);

    CreateRoomHandler(server, socket);

    const onDisconnection = () => {
      LeaveRoom(id);
    };

    socket.on('disconnect', onDisconnection);
  };

  server.on('connection', onConnection);

  return server;
}
