export const RESERVED_KEYWORD = {
  SUFFIX: {},
  PREFIX: {
    EVENT: '$events$',
    KILL: '$kill$',
    RESTART: '$restart$',
  },
} as const;

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

export enum ExternalModule {
  NodeAdapter = '@hono/node-server',
  ZodApi = '@asteasolutions/zod-to-openapi',
}
