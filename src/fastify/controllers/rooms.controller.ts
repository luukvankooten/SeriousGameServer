import {
  FastifyInstance, FastifyPluginOptions, FastifyRequest,
} from 'fastify';
import * as RoomService from '../../services/rooms.service';

async function GetRooms() {
  return Array.from(RoomService.GetRooms())
    .filter((entry) => !entry[1].isFull || !entry[1].isClosed)
    .map((entry) => ({
      id: entry[0],
      ...entry[1],
    }));
}

// _request: FastifyRequest, _reply: FastifyReply
async function AddRoom(request: FastifyRequest<{ Body: { name: string } }>) {
  const id = RoomService.AddRoom(request.body.name);

  return { id, ...RoomService.GetRoom(id) };
}

export default async function RegisterRoomController(
  server: FastifyInstance,
  _opts: FastifyPluginOptions,
) {
  server.get('/rooms', {
    schema: {
      response: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        uri: { type: 'string', format: 'uri' },
        isFull: { type: 'boolean' },
      },
    },
  }, GetRooms);

  server.post('/rooms', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            room: { type: 'string' },
            uri: { type: 'string', format: 'uri' },
            isFull: { type: 'boolean' },
          },
        },
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
        required: ['name'],
      },
    },
  }, AddRoom);
}
