import { Server, Socket } from 'socket.io';
import Game from '../../../models/game.model';
import Round from '../../../models/round.model';

export default function RegisterGameNextRoundHandler(
  io: Server,
  _socket: Socket,
  game: Game,
) {
  game.on('next', (round: Round) => {
    //By round next emit the previous round, because the results are in then
    const orders = round.game.getPreviousRound()?.orders.map((o) => ({
      player_id: o.player.id,
      order: o.order,
    }));

    io.in(game.room.id).emit('round:next', orders);
  });
}
