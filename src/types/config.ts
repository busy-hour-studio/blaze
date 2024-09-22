import type ZodApi from '@asteasolutions/zod-to-openapi';
import type NodeServer from '@hono/node-server';
import type Trpc from '@trpc/server';
import type TrpcAdapter from '@trpc/server/adapters/fetch';
import { ExternalModule } from '../utils/constant';

export interface DependencyModule {
  [ExternalModule.NodeAdapter]: typeof NodeServer | null;
  [ExternalModule.ZodApi]: typeof ZodApi | null;
  [ExternalModule.Trpc]: typeof Trpc | null;
  [ExternalModule.TrpcAdapter]: typeof TrpcAdapter | null;
}

export const DEPENDENCY_MODULE_MAP = {
  [ExternalModule.NodeAdapter]: ExternalModule.NodeAdapter,
  [ExternalModule.ZodApi]: ExternalModule.ZodApi,
  [ExternalModule.Trpc]: ExternalModule.Trpc,
  [ExternalModule.TrpcAdapter]: ExternalModule.Trpc,
} as const;
