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

async function DeleteRoom(
  request: FastifyRequest<{ Querystring: { roomUri: string } }>,
) {
  try {
    if (!RoomService.HasRoom(request.query.roomUri)) {
      return {
        deleted: false,
        message: "Room does not exist",
      }
    }

    const room = RoomService.GetRoom(request.query.roomUri);
    if (room.players.length > 0) {
      if (room.isOpen()) {
        const history = RoomService.GetRoom(room.id).game?.getHistory() ?? [];
        if (room.game?._io) {
          room.game?._io.emit('game:end', {
            message: `The room has been closed externally, game concluded`,
            history
          });
          room.game?._io.disconnectSockets(true);
        }
      } else {
        return {
          deleted: false,
          message: "Room lobby is not empty",
        }
      }
    }

    RoomService.CloseRoom(request.query.roomUri);    
    
    return {
      deleted: true,
      message: "Room is deleted",
    }
  } catch (e) {
    return {
      deleted: false,
      message: `An error ocurred during the operation: ${e}`,
    }
  }
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

  server.delete(
    '/rooms',
    {
      schema: {
        response: {
          deleted: { type: 'boolean' },
          message: { type: 'string' },
        },
      },
    },
    DeleteRoom,
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
