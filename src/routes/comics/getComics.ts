// import { COMICS } from '@consumet/extensions';
// import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';

// const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
//   // fastify.log.info(
//   //   `redis://${process.env.REDIS_PASS}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
//   // );
//   fastify.get('/s', async (request: FastifyRequest, reply: FastifyReply) => {
//     let { comicTitle, page } = request.query as {
//       comicTitle: string;
//       page: number | undefined;
//     };
//     if (page == undefined) page = 1;
//     if (await redis.exists(`${comicTitle}:${page}`)) {
//       const result = await client.get(`${comicTitle}:${page}`);
//       client.disconnect();

//       const resultParsed = JSON.parse(result!!);
//       return reply.status(200).send(resultParsed);
//     }
//     if (comicTitle.length < 4)
//       return reply.status(400).send({
//         message: 'length of comicTitle must be > 4 charactes',
//         error: 'short_length',
//       });
//     const getComics = new COMICS.GetComics();
//     const result = await getComics
//       .search(comicTitle, page == undefined ? 1 : page)
//       .catch((err) => {
//         return reply.status(400).send({
//           // temp
//           message: 'page query must be defined',
//           error: 'invalid_input',
//           // temp
//         });
//       });

//     client.set(`${comicTitle}:${page}`, JSON.stringify(result));

//     return reply.status(200).send(result);
//   });

//   fastify.get('/', (_, rp) => {
//     rp.status(200).send({
//       intro:
//         "Welcome to the getComics provider: check out the provider's website @ https://getcomics.info/",
//       routes: ['/s'],
//       documentation: 'https://docs.consumet.org/#tag/getComics (need to be updated)',
//     });
//   });
// };

// export default routes;
