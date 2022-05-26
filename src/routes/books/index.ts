import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import BOOKS, { PROVIDERS_LIST } from 'consumet-extentions';
import { BaseProvider } from 'consumet-extentions/dist/models';

import libgen from './en/libgen';
import { IBookProviderParams } from '../../models';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  await fastify.register(libgen, { prefix: '/' });
  // ... other routes, example:  await fastify.register(zlibrary, { prefix: "/" });

  fastify.get('/', async (request: any, reply: any) => {
    reply.status(200).send('Welcome to Consumet Books');
  });

  // send the user to the specified provider
  fastify.get('/:bookProvider', async (request: FastifyRequest, reply: FastifyReply) => {
    // if book provider not found, this might be a book name or a book id, so we need to call the libgen scraping function.
    // the book provider is found on the provider list (from the consumet-extentions library) then we redirect to the provider.

    const { bookProvider, page } = request.params as IBookProviderParams;

    const provider = PROVIDERS_LIST.BOOKS.find(
      (provider: BaseProvider) => provider.toString.name === bookProvider
    );

    if (provider) {
      reply.redirect(`/book/${bookProvider}`);
    } else {
      // TODO
      // default route for books
      // const libgen = new BOOKS.en.Libgen();
      // const res = await libgen.search(bookProvider, page);
      // if (res.length > 0) {
      //   reply.status(200).send(res);
      // } else {
      //   reply
      //     .status(200)
      //     .send(
      //       "Book not found. if you're looking for a provider, please check the provider list."
      //     );
      // }
    }
  });
};

export default routes;
