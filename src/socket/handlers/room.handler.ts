import { Server, Socket } from 'socket.io';
import { GetRoom, GetRooms, HasRoom } from '../../services/rooms.service';

function Room(this: Socket) {
  console.log(Array.from(this.rooms));

  // for (let [key, value] of this.rooms.entries()) console.log(key, value)

  console.log(this.request.url);

  const room = Array.from(this.rooms)[1];

  console.log(room);

  // console.log(this.rooms, this.id);
  if (!room) {

  }

  // console.log(room[1]);
}

export default function CreateRoomHandler(_io: Server, socket: Socket) {
  socket.on('room', Room);
}
