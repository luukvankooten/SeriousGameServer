import Fastify from 'fastify';



export default function FasistyFactory() {
  const fastify = Fastify({
    logger: true
  });

  fastify.listen(Number(process.env.PORT) || 3001, function (err, address) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  });

  return fastify;
}