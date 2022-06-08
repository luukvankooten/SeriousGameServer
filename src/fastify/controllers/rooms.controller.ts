import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

async function GetRooms(request: FastifyRequest, reply: FastifyReply): Promise<object> {
	return {
		hello: 'world'
	};
}

export default function RegisterRoomController(server: FastifyInstance) {
	server.get('/rooms', GetRooms);
}