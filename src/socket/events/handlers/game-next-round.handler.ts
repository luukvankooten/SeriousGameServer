import { Server, Socket } from 'socket.io';
import Game from '../../../models/game.model';

export default function RegisterGameNextRoundHandler(
  io: Server,
  socket: Socket,
  game: Game,
) {
  game.on('next', (game, event) => {
    console.log(game, event);

    io.of(game.room.id).emit('game:next', {});
  });
}
