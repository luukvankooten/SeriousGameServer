import { Server, Socket } from 'socket.io';
import { orderTypeFromString, orderTypeToString } from '../../models/order.model';
import { roleFromString, roleToString } from '../../models/player.model';
import Room from '../../models/room.model';

export default function CreateRoundHandler(
  _io: Server,
  socket: Socket,
  room: Room,
) {
  socket.on('round:invoice', (data, callback: Function) => {
    try {
      const order = Number(data.order);
      const type = orderTypeFromString(String(data.type).toLowerCase());
      const role = roleFromString(String(data.role).toLowerCase());    
      const done: boolean = data.done;

      if (order === NaN) {
        if (callback) {
          callback({
            ok: false,
            message: 'Order is not a number',
            data
          });
        }
        return;
      }

      const currentPlayer = room.getPlayer(socket.id);
      const currentRound = room.game?.getActiveRound();

      if (!(currentPlayer && currentRound)) {
        if (callback) {
          callback({
            ok: false,
            message: 'No current player or current round',
            data
          });
        }
        return;
      }

      currentRound.addOrder(_io, order, role, currentPlayer, type, done);

      if (callback) {
        callback({
          ok: true,
          order: data.order,
          type: data.type,
          role: data.role,
          done: data.done
        });
      }
    } catch (e) {
      if (callback) {
        callback({
          ok: false,
          message: `Server error ${e}`,
          data
        });
      }
      console.error(e);
    }
  });
}
