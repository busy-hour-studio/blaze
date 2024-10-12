export const RunTimeName = {
  WORKER_D: 'workerd',
  DENO: 'deno',
  NETLIFY: 'netlify',
  NODE: 'node',
  BUN: 'bun',
  EDGE_LIGHT: 'edge-light',
  FASTLY: 'fastly',
  OTHER: 'other',
} as const;

export type RunTimeName = (typeof RunTimeName)[keyof typeof RunTimeName];

export const ExternalModule = {
  NodeAdapter: '@hono/node-server',
  ZodApi: '@asteasolutions/zod-to-openapi',
  Trpc: '@trpc/server',
  TrpcAdapter: '@trpc/server/adapters/fetch',
} as const;

export type ExternalModule =
  (typeof ExternalModule)[keyof typeof ExternalModule];

export const DepedencyModuleMap = {
  [ExternalModule.NodeAdapter]: ExternalModule.NodeAdapter,
  [ExternalModule.ZodApi]: ExternalModule.ZodApi,
  [ExternalModule.Trpc]: ExternalModule.Trpc,
  [ExternalModule.TrpcAdapter]: ExternalModule.Trpc,
} as const;

export type DepedencyModuleMap =
  (typeof DepedencyModuleMap)[keyof typeof DepedencyModuleMap];
