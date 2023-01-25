import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import {
  idParamSchema,
  idParamSchemaWithoutUUID,
} from "../../utils/reusedSchemas";
import { createProfileBodySchema, changeProfileBodySchema } from "./schema";
import type { ProfileEntity } from "../../utils/DB/entities/DBProfiles";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<ProfileEntity[]> {
    return await fastify.db.profiles.findMany();
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchemaWithoutUUID,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({
        key: "id",
        equals: request.params.id,
      });
      if (!profile) {
        throw fastify.httpErrors.notFound("Profile not found");
      }
      return profile;
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({
        key: "userId",
        equals: request.body.userId,
      });
      if (profile) {
        throw fastify.httpErrors.badRequest("User already has a profile");
      }
      const allowedMemberType = await fastify.db.memberTypes.findMany();
      const isAllowedMemberType = allowedMemberType.find(
        ({ id }) => id === request.body.memberTypeId
      );
      if (!isAllowedMemberType) {
        throw fastify.httpErrors.badRequest("Wrong member type");
      }
      return await fastify.db.profiles.create(request.body);
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({
        key: "id",
        equals: request.params.id,
      });
      if (!profile) {
        throw fastify.httpErrors.notFound();
      }
      return await fastify.db.profiles.delete(request.params.id);
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({
        key: "id",
        equals: request.params.id,
      });
      if (!profile) {
        throw fastify.httpErrors.notFound();
      }
      return await fastify.db.profiles.change(request.params.id, request.body);
    }
  );
};

export default plugin;
