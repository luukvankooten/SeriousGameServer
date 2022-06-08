import { Server, Socket } from 'socket.io';
import { GetRoom, GetRooms, HasRoom } from '../../services/rooms.service';

function JoinRoom(this: Socket, data: any) {
  console.log('room', this.data);	

  if(typeof data !== 'string') {
  	return;
  }

  if(!HasRoom(data)) {
  	return;
  }

  console.log(GetRooms());

  this.join(data);
}


function Room(this: Socket) {

  const room = Object.keys(this.rooms).find(item => item!=this.id);

  if(room) {

  }

  console.log(room);
}

export default function CreateRoomHandler(_io: Server, socket: Socket) {
  socket.on('room:join', JoinRoom);

  socket.on('room', Room);
}
