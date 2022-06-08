import { Server, ServerOptions, Socket } from 'socket.io';
import type { Server as HTTPSServer } from 'https';
import http from 'http';
import CreateRoomHandler from './handlers/room.handler';
import { GetRooms, HasRoom, JoinRoom, LeaveRoom } from '../services/rooms.service';

export default function SocketIOFactory(srv?: undefined | Partial<ServerOptions> | http.Server | HTTPSServer | number) {
  const server = new Server(srv);

  const onConnection = (socket: Socket ) => {

    const roomUri = socket.handshake.query.roomUri?.toString();


    if(!roomUri) {
      return;
    }

    if(!HasRoom(roomUri || '')) {
      return;
    }

    JoinRoom(roomUri);
    socket.join(roomUri);
    

    CreateRoomHandler(server, socket);

    const onDisconnection = () => {
      LeaveRoom(roomUri);
    }

    socket.on('disconnect', onDisconnection);
  }

  server.on('connection', onConnection);

  return server;
}
