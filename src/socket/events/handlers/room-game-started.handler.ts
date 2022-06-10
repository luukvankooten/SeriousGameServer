import { Server, Socket } from 'socket.io';
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

    io.to(room.id).emit('game:started');
  };

  room.on('game:started', handler);
}
