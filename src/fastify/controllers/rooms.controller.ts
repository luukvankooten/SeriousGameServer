import {
  FastifyInstance, FastifyPluginOptions
} from 'fastify';
import * as RoomService from '../../services/rooms.service';

async function GetRooms() {
  return RoomService.GetRooms();
}

// _request: FastifyRequest, _reply: FastifyReply
async function AddRoom() {
  const room: RoomService.Room = {
    room: 'one',
    path: 'test',
    isFull: false,
  };

  const id = RoomService.AddRoom(room);

  return { id, ...RoomService.GetRoom(id) };
}

export default async function RegisterRoomController(
  server: FastifyInstance,
  _opts: FastifyPluginOptions,
) {
  server.get('/rooms', GetRooms);

  server.post('/rooms', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            room: { type: 'string' },
            path: { type: 'string' },
            isFull: { type: 'boolean' },
          },
        },
      },
      body: {
        type: 'object',
        properties: {
          test: { type: 'string' },
          otherValue: { type: 'boolean' },
        },
        required: ['test', 'otherValue'],
      },
    },
  }, AddRoom);
}
