import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from "fastify";

// libgen supports more than 5 languages, that's why we its in all folder.
const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  fastify.get("/libgen", async (request: FastifyRequest, reply: FastifyReply) => {
    reply.status(200).send("Welcome to Consumet Libgen");
  });
};

export default routes;
