import { Server, Socket } from 'socket.io';
import Invoice from '../../models/invoice.model';
import Room from '../../models/room.model';

export default function CreateRoundHandler(
  _io: Server,
  socket: Socket,
  room: Room,
) {
  socket.on('round:invoice', (data) => {
    console.log(data, room);

    const currentPlayer = room.getPlayer(socket.id);

    const currentRound = room.game?.getActiveRound();

    if (!(currentPlayer && currentRound)) {
      socket.to(room.id).emit('error');
      return;
    }

    currentPlayer.setInvoice();

    new Invoice();
  });
}
