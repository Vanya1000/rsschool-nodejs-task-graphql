import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { graphql } from 'graphql';
import schema from './qraphQLSchema';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const source = request.body.query as string;
      if (!source) {
        throw fastify.httpErrors.badRequest('Query is required');
      }
      const variableValues = request.body.variables as Record<string, unknown>;
      return await graphql({
        schema,
        source,
        // rootValue,
        variableValues,
        contextValue: fastify.db,
      });
    }
  );
};

export default plugin;
