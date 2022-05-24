import {
  FastifyRequest,
  FastifyReply,
  FastifyInstance,
  RegisterOptions,
  RequestGenericInterface,
  FastifyLoggerInstance,
} from "fastify";
import libgen from "./all/libgen";

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  await fastify.register(libgen, { prefix: "/" });
  // ... other routes, example:  await fastify.register(zlibrary, { prefix: "/" });

  // send the user to the specified provider
  fastify.get("/:bookProvider", async (request: FastifyRequest, reply: FastifyReply) => {
    // if book provider not found, this might be a book name or a book id, so we need to call the libgen scraping function.
    // the book provider is found on the provider list (from the consumet-extentions library) then we redirect to the provider.
    // then the code should look something like this:
    /**
     * const bookProvider = (request.params as BookProviderParams).bookProvider;
     *
     * if (bookProvider) {
     *  const provider = providers.find(provider => provider.name === bookProvider);
     *  reply.redirect(`books/${provider.name}`);
     * } else {
     * 	const bookInfo = await libgen.scrape(request.query.bookName);
     * 	if (bookInfo) {
     * 		return bookInfo;
     *   } else {
     *      return "Book not found. if you're looking for a provider, please check the provider list.";
     *   }
     * }
     *
     *
     */
    reply.redirect(`/books/${(request.params as { bookProvider: string }).bookProvider}`);
  });
  // default route for books
  fastify.get("/", async (request: any, reply: any) => {
    reply.status(200).send("Welcome to Consumet Books");
  });
};

export default routes;
