import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import {
  idParamSchema,
  idParamSchemaWithoutUUID,
} from "../../utils/reusedSchemas";
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from "./schemas";
import type { UserEntity } from "../../utils/DB/entities/DBUsers";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<UserEntity[]> {
    return await fastify.db.users.findMany();
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchemaWithoutUUID,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: "id",
        equals: request.params.id,
      });
      if (!user) {
        throw fastify.httpErrors.notFound("User not Found");
      }
      return user;
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      return await fastify.db.users.create(request.body);
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: "id",
        equals: request.params.id,
      });
      if (!user) {
        throw fastify.httpErrors.notFound("User not Found");
      }
      const posts = await fastify.db.posts.findMany({
        key: "userId",
        equals: user.id,
      });
      posts.forEach(async ({ id }) => {
        await fastify.db.posts.delete(id);
      });
      const profile = await fastify.db.profiles.findOne({
        key: "userId",
        equals: user.id,
      });
      if (profile) {
        await fastify.db.profiles.delete(profile.id);
      }
      const users = await fastify.db.users.findMany();
      const usersToUnsubscribeFrom = users.filter((user) =>
        user.subscribedToUserIds.includes(request.params.id)
      );
      for (const userToUnsubscribeFrom of usersToUnsubscribeFrom) {
        const userToUnsubscribeFromSubscribedToUserIds =
          userToUnsubscribeFrom.subscribedToUserIds;
        userToUnsubscribeFromSubscribedToUserIds.splice(
          userToUnsubscribeFromSubscribedToUserIds.indexOf(request.params.id),
          1
        );
        await fastify.db.users.change(userToUnsubscribeFrom.id, {
          subscribedToUserIds: userToUnsubscribeFromSubscribedToUserIds,
        });
      }
      return await fastify.db.users.delete(request.params.id);
    }
  );

  fastify.post(
    "/:id/subscribeTo",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: "id",
        equals: request.body.userId,
      });
      if (!user) {
        throw fastify.httpErrors.notFound("User not Found");
      }
      const userSubscribedToUserIds = user.subscribedToUserIds;

      if (!userSubscribedToUserIds.includes(request.params.id)) {
        userSubscribedToUserIds.push(request.params.id);
      } else {
        throw fastify.httpErrors.badRequest("User already subscribed");
      }
      return await fastify.db.users.change(request.body.userId, {
        subscribedToUserIds: userSubscribedToUserIds,
      });
    }
  );

  fastify.post(
    "/:id/unsubscribeFrom",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: "id",
        equals: request.body.userId,
      });
      if (!user) {
        throw fastify.httpErrors.notFound("User not Found");
      }
      const userSubscribedToUserIds = user.subscribedToUserIds;

      if (userSubscribedToUserIds.includes(request.params.id)) {
        userSubscribedToUserIds.splice(
          userSubscribedToUserIds.indexOf(request.params.id),
          1
        );
      } else {
        throw fastify.httpErrors.badRequest("User not subscribed");
      }
      return await fastify.db.users.change(request.body.userId, {
        subscribedToUserIds: userSubscribedToUserIds,
      });
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: "id",
        equals: request.params.id,
      });
      if (!user) {
        throw fastify.httpErrors.notFound("User not Found");
      }
      return await fastify.db.users.change(request.params.id, request.body);
    }
  );
};

export default plugin;
