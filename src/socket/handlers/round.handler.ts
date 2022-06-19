import { Server, Socket } from 'socket.io';
import { orderTypeFromString } from '../../models/order.model';
import { roleFromString } from '../../models/player.model';
import Room from '../../models/room.model';

export default function CreateRoundHandler(
  _io: Server,
  socket: Socket,
  room: Room,
) {
  socket.on('round:invoice', (data, callback: Function) => {
    try {
      const order = Number(data.order);
      const type = orderTypeFromString(data.type);
      const role = roleFromString(data.role);    
      const done: boolean = data.done;

      if (order === NaN) {
        socket.emit('round:invoice-error', {
          message: 'Order is not a number',
          data
        });
        return;
      }

      const currentPlayer = room.getPlayer(socket.id);

      const currentRound = room.game?.getActiveRound();

      if (!(currentPlayer && currentRound)) {
        socket.emit('round:invoice-error', {
          message: 'No current player or current round',
          data
        });
        return;
      }

      currentRound.addOrder(_io, order, role, currentPlayer, type, done);

      socket.emit('round:invoice-ok', {
        order: data.order,
        type: data.type,
        role: data.role,
        done: data.done
      });

      if (callback) {
        callback({
          order: data.order,
          type: data.type,
          role: data.role,
          done: data.done
        });
      }
    } catch (e) {
      socket.emit('round:invoice-error', {
        message: `Server error ${e}`,
        data
      });
      console.error(e);
    }
  });
}
