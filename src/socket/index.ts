import { Server, ServerOptions, Socket } from 'socket.io';
import type { Server as HTTPSServer } from 'https';
import http from 'http';

function onConnection(socket: Socket) {
  console.log(socket.data);
}

export default function SocketIOFactory(srv?: undefined | Partial<ServerOptions> | http.Server | HTTPSServer | number) {
  const server = new Server(srv);

  server.on('connection', onConnection);

  return server;
}
