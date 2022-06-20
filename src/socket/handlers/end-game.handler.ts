import { Server, Socket } from 'socket.io';
import Room from '../../models/room.model';
import { LeaveRoom } from '../../services/rooms.service';
import * as RoomService from '../../services/rooms.service';
import { Role, roleToString } from '../../models/player.model';

export default function CreateEndGameHandler(
  _io: Server,
  socket: Socket,
  room: Room,
) {
  socket.once('game:end', () => {
    const ender = roleToString(RoomService.GetRoom(room.id).players.find((x) => x.id === socket.id)?.role ?? Role.EMPTY);
    const history = RoomService.GetRoom(room.id).game?.getHistory() ?? [];

    _io.emit('game:end', {
      message: `${ender} has ended the game, game concluded`,
      history
    });
    LeaveRoom(room.id, socket.id);
    socket.removeAllListeners();

    _io.disconnectSockets(true);
    RoomService.CloseRoom(room.id);
  });
}