import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { graphql, parse, validate } from 'graphql';
import schema from './qraphQLSchema';
import DataLoader = require('dataloader');
import * as depthLimit from 'graphql-depth-limit';

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
        const posts = await fastify.db.posts.findMany({
          key: 'userId',
          equalsAnyOf: keys as string[],
        });
        return keys.map((key) => posts.filter((post) => post.userId === key));
      });

      const profileLoader = new DataLoader(async (keys: readonly string[]) => {
        const profiles = await fastify.db.profiles.findMany({
          key: 'userId',
          equalsAnyOf: keys as string[],
        });
        return keys.map((key) =>
          profiles.find((profile) => profile.userId === key)
        );
      });

      const memberTypeLoader = new DataLoader(async (keys: readonly string[]) => {
        const memberTypes = await fastify.db.memberTypes.findMany({
          key: 'id',
          equalsAnyOf: keys as string[],
        });
        return keys.map((key) =>
          memberTypes.find((memberType) => memberType.id === key)
        );
      });

      const userLoader = new DataLoader(async (keys: readonly string[]) => {
        const users = await fastify.db.users.findMany({
          key: 'id',
          equalsAnyOf: keys as string[],
        });
        return keys.map((key) => users.find((user) => user.id === key));
      });

      const userSubscribedToLoader = new DataLoader(
        async (keys: readonly string[]) => {
          const userSubscribedToIds = await fastify.db.users.findMany(
            {
              key: 'subscribedToUserIds',
              inArrayAnyOf: keys as string[],
            }
          );
          return keys.map((key) =>
            userSubscribedToIds.filter((user) =>
              user.subscribedToUserIds.includes(key)
            )
          );
        }
      );

      const source = request.body.query as string;
      if (!source) {
        throw fastify.httpErrors.badRequest('Query is required');
      }
      const variableValues = request.body.variables as Record<string, unknown>;

      const validationErrors = validate(schema, parse(source), [depthLimit(6)]);
      if (validationErrors.length > 0) {
        throw fastify.httpErrors.badRequest(validationErrors[0].message);
      }

      return await graphql({
        schema,
        source,
        variableValues,
        contextValue: {
          db: fastify.db,
          postLoader,
          profileLoader,
          memberTypeLoader,
          userLoader,
          userSubscribedToLoader
        },
      });
    }
  );
};

export default plugin;
