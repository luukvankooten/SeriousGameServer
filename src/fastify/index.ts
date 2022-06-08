import Fastify from 'fastify';
import RegisterRoomController from './controllers/rooms.controller';

export default function FasistyFactory() {
  const fastify = Fastify({
    logger: true,
  });

  RegisterRoomController(fastify);

  fastify.listen(Number(process.env.PORT) || 3001, (err, _address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });

  return fastify;
}
