import axios from 'axios';
import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';

class ZoroKey {
  getKey = async (fastify: FastifyInstance, options: RegisterOptions) => {
    fastify.get('/key/:keyID', async (request: FastifyRequest, reply: FastifyReply) => {
      const keyID = parseInt((request.params as { keyID: string }).keyID);

      if (keyID !== 4 && keyID !== 6)
        return reply.status(400).send({ message: 'keyID can either be 4 or 6.' });

      try {
        const { data } = await axios.get(`http://9anime.to/key/e${keyID}.txt`);
        reply.status(200).send(data);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Contact developer for help.' });
      }
    });
  };
}

export default ZoroKey;
