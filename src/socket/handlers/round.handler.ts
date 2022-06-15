import { Server, Socket } from 'socket.io';
import { orderTypeFromString } from '../../models/order.model';
import Room from '../../models/room.model';

export default function CreateRoundHandler(
  _io: Server,
  socket: Socket,
  room: Room,
) {
  socket.on('round:invoice', (data) => {
    const order = Number(data.order);
    const type = orderTypeFromString(data.type);

    if (order === NaN) {
      socket.emit('error', {
        message: 'order is not an number',
      });
      return;
    }

    const currentPlayer = room.getPlayer(socket.id);

    const currentRound = room.game?.getActiveRound();

    if (!(currentPlayer && currentRound)) {
      socket.emit('error', {
        message: 'No current player or current round',
      });
      return;
    }

    currentRound.addOrder(order, currentPlayer, type);
  });
}
