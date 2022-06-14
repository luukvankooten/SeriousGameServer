import Fastify from 'fastify';
import RegisterRoomController from './controllers/rooms.controller';

export default function FasistyFactory() {
  const fastify = Fastify({
    logger: true,
  });

  fastify.register(RegisterRoomController);

  fastify.listen(
    { port: Number(process.env.PORT) || 3001, host: '0.0.0.0' },
    (err: any) => {
      if (err) {
        fastify.log.error(err);
      }
    },
  );

  return fastify;
}
