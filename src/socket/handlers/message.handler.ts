import { Server, Socket } from 'socket.io';
import Room from '../../models/room.model';
import fetch from 'cross-fetch';
import { Role, roleToString } from '../../models/player.model';

export default function CreateMessageHandler(
  _io: Server,
  socket: Socket,
  room: Room,
) {
  socket.on('round:message', (data, callback: Function) => {
    try {
      const lang = data.lang;
      const message = data.message;
      if (!message) {
        callback({
          ok: false,
          message: 'Message is empty',
        });
        return;
      }

      const currentPlayer = room.getPlayer(socket.id);
      if (currentPlayer?.role !== Role.EMPTY) {
        let formdata = new URLSearchParams();
        formdata.append("text", message);
        formdata.append("language", lang);

        fetch("http://text-processing.com/api/sentiment/", {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        })
        .then(res => res.json())
        .then(res => {
            if (callback) {
              callback({
                ok: true,
                message: message,
                sentiment: res,
              });
            };
            _io.except(socket.id).emit('round:message-receive', {
                message: message,
                from: roleToString(currentPlayer?.role ?? Role.EMPTY),
                sentiment: res,
            });
        })
        .catch(error => {
            throw error
        });
      } else {
        if (callback) {
          callback({
            ok: false,
            message: 'Role is empty',
          });
        }
      }
    } catch (e) {
      if (callback) {
        callback({
          ok: false,
          message: `Server error ${e}`,
        });
      }
      console.error(e);
    }
  });
}
