import { PROVIDERS_LIST } from '@consumet/extensions';
import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';

type ProvidersRequest = FastifyRequest<{
  Querystring: { type: keyof typeof PROVIDERS_LIST };
}>;

export default class Providers {
  public getProviders = async (fastify: FastifyInstance, options: RegisterOptions) => {
    fastify.get(
      '/providers',
      {
        preValidation: (request, reply, done) => {
          const { type } = request.query;

          const providerTypes = Object.keys(PROVIDERS_LIST).map((element) => element);

          if (type === undefined) {
            reply.status(400);
            done(
              new Error(
                'Type must not be empty. Available types: ' + providerTypes.toString(),
              ),
            );
          }

          if (!providerTypes.includes(type)) {
            reply.status(400);
            done(new Error('Type must be either: ' + providerTypes.toString()));
          }

          done(undefined);
        },
      },
      async (request: ProvidersRequest, reply: FastifyReply) => {
        const { type } = request.query;
        const providers = Object.values(PROVIDERS_LIST[type]).sort((one, two) =>
          one.name.localeCompare(two.name),
        );
        reply.status(200).send(providers.map((element) => element.toString));
      },
    );
  };
}
