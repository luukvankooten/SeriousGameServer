import { Server, Socket } from 'socket.io';
import RegisterCustomerOrderHandler from '../../../events/handlers/customer-order.handler';
import Game from '../../../models/game.model';
import Room from '../../../models/room.model';
import CreateRoundHandler from '../../handlers/round.handler';
import RegisterGameNextRoundHandler from './game-next-round.handler';

export default function RegisterRoomGameStartedHandler(
  io: Server,
  socket: Socket,
  room: Room,
) {
  const handler = (game: Game, event: Room) => {
    //Register if game is started
    RegisterGameNextRoundHandler(io, socket, game);
    CreateRoundHandler(io, socket, room);
    RegisterCustomerOrderHandler(game);

    io.to(room.id).emit('game:started', game.room.players);
  };

  room.on('game:started', handler);
}
