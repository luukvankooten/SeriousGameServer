import { Server, Socket } from 'socket.io';
import CustomerAiOrderHandler from '../../../events/handlers/customer-order.handler';
import Game from '../../../models/game.model';
import { roleToString } from '../../../models/player.model';
import Room from '../../../models/room.model';
import RegisterGameNextRoundHandler from './game-next-round.handler';

export default function RegisterRoomGameStartedHandler(
  io: Server,
  socket: Socket,
  room: Room,
) {
  const aiHandler = CustomerAiOrderHandler();
  const handler = (game: Game) => {
    //Register if game is started
    RegisterGameNextRoundHandler(io, socket, game);
    game.on('next', () => aiHandler(game));

    const players = room.players.map((player) => ({
      id: player.id,
      role: roleToString(player.role),
    }));

    io.to(room.id).emit('game:started', players);
  };

  room.on('game:started', handler);
  room.once('game:started', aiHandler);

  return [handler];
}
