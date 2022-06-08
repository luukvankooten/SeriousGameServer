import { Server, Socket } from 'socket.io';

function JoinRoom(this: Socket, data: any) {
  console.log('room', this.data, JSON.parse(data));	
}

export default function CreateRoomHandler(io: Server, socket: Socket) {
  socket.on('room:join', JoinRoom);
}
