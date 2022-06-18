import { Server, Socket } from 'socket.io';
import { orderTypeFromString } from '../../models/order.model';
import Room from '../../models/room.model';

export default function CreateRoundHandler(
  _io: Server,
  socket: Socket,
  room: Room,
) {
  socket.on('round:invoice', (data) => {
    try {
      const order = Number(data.order);
      const type = orderTypeFromString(data.type);

      if (order === NaN) {
        socket.emit('round:invoice-error', {
          message: 'Order is not a number',
        });
        return;
      }

      const currentPlayer = room.getPlayer(socket.id);

      const currentRound = room.game?.getActiveRound();

      if (!(currentPlayer && currentRound)) {
        socket.emit('round:invoice-error', {
          message: 'No current player or current round',
        });
        return;
      }

      currentRound.addOrder(order, currentPlayer, type);

      socket.emit('round:invoice-ok', {
        message: 'Invoice submitted',
      });
    } catch (e) {
      socket.emit('round:invoice-error', {
        message: `Server error ${e}`,
      });
      console.error(e);
    }
  });
}
