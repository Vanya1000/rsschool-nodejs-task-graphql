import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { graphql, parse, validate } from 'graphql';
import schema from './qraphQLSchema';
import DataLoader = require('dataloader');
import depthLimit = require('graphql-depth-limit');

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
      const postLoader = new DataLoader(async (keys: readonly string[]) => {
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.log(keys);
        const posts = await fastify.db.posts.findMany({
          key: 'userId',
          equalsAnyOf: keys as string[],
        });
        console.log(posts);

        return keys.map((key) => posts.filter((post) => post.userId === key));
      });

      const source = request.body.query as string;
      if (!source) {
        throw fastify.httpErrors.badRequest('Query is required');
      }
      const variableValues = request.body.variables as Record<string, unknown>;

      const validationErrors = validate(schema, parse(source), [depthLimit(6)]);
      if (validationErrors.length > 0) {
        throw fastify.httpErrors.badRequest('Query is invalid');
      }

      return await graphql({
        schema,
        source,
        // rootValue,
        variableValues,
        contextValue: {
          db: fastify.db,
          postLoader,
        },
      });
    }
  );
};

export default plugin;
