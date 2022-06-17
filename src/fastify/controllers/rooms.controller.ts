import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from 'fastify';
import { Role, roleToString } from '../../models/player.model';
import * as RoomService from '../../services/rooms.service';

async function GetRooms() {
  return Array.from(RoomService.GetRooms())
    .filter((entry) => entry[1].isOpen())
    .map((entry) => ({
      id: entry[0],
      name: entry[1].name,
      uri: `${process.env.APP_URL}/?roomUri=${entry[0]}`,
    }));
}

async function GetAvailableRolesInRoom(
  request: FastifyRequest<{ Querystring: { roomUri: string } }>,
) {
  return RoomService.GetRoom(request.query.roomUri)
    .players.filter((x) => x.role !== Role.EMPTY)
    .map((x) => roleToString(x.role));
}

// _request: FastifyRequest, _reply: FastifyReply
async function AddRoom(request: FastifyRequest<{ Body: { name: string } }>) {
  const id = RoomService.AddRoom(request.body.name);

  const room = RoomService.GetRoom(id);

  return {
    id,
    name: room.name,
    uri: `${process.env.APP_URL}/?roomUri=${id}`,
  };
}

export default async function RegisterRoomController(
  server: FastifyInstance,
  _opts: FastifyPluginOptions,
) {
  server.get(
    '/rooms',
    {
      schema: {
        response: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          uri: { type: 'string', format: 'uri' },
        },
      },
    },
    GetRooms,
  );

  server.post(
    '/rooms',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              uri: { type: 'string', format: 'uri' },
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
    },
    AddRoom,
  );

  server.get(
    '/roles-unavailable',
    {
      schema: {
        response: {
          role: { type: 'array' },
        },
      },
    },
    GetAvailableRolesInRoom,
  );
}
