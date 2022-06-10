import { Server, Socket } from "socket.io";


export default function CreateRoundHandler(_io: Server, socket: Socket) 
{
	socket.on('round:emit', () => {
		
	})
}