import { Server, ServerOptions, Socket } from 'socket.io';
import type { Server as HTTPSServer } from 'https';
import http from 'http';
import CreateRoomHandler from './handlers/room.handler';

export default function SocketIOFactory(srv?: undefined | Partial<ServerOptions> | http.Server | HTTPSServer | number) {
  const server = new Server(srv);

  const onConnection = (socket: Socket ) => {
    CreateRoomHandler(server, socket);
  }


  server.on('connection', onConnection);



  return server;
}
