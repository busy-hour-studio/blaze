export const REST_CONTENT_TYPE = {
  JSON: 'application/json',
  TEXT: 'text/plain',
  HTML: 'text/html',
  BODY: 'application/octet-stream',
  FORM: 'application/x-www-form-urlencoded',
  MULTIPART: 'multipart/form-data',
} as const;

export const FORM_CONTENT_TYPE = [
  REST_CONTENT_TYPE.FORM,
  REST_CONTENT_TYPE.MULTIPART,
] as const;

export const ExternalModule = {
  NodeAdapter: '@hono/node-server',
  ZodApi: '@asteasolutions/zod-to-openapi',
  Trpc: '@trpc/server',
  TrpcAdapter: '@trpc/server/adapters/fetch',
} as const;

export type ExternalModule =
  (typeof ExternalModule)[keyof typeof ExternalModule];

export const PossibleRunTime = {
  Node: 'node',
  Bun: 'bun',
  Other: 'other',
} as const;

export type PossibleRunTime =
  (typeof PossibleRunTime)[keyof typeof PossibleRunTime];
