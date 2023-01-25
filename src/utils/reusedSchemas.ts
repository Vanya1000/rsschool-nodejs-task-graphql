export const idParamSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string", format: "uuid" },
  },
} as const;

export const idParamSchemaWithoutUUID = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string" },
  },
} as const;

export const idParamSchemaMemberType = {
  type: "object",
  required: ["id"],
  properties: {
    id: {
      type: "string",
      enum: ["business", "basic"]
    },
  },
} as const;
