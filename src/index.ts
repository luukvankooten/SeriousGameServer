import SocketIOFactory from './socket';
import FasistyFactory from './fastify';

function ServerFactory() {
  const fastifyInstance = FasistyFactory();

  SocketIOFactory(fastifyInstance.server);
}

ServerFactory();
