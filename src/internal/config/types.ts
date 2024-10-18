import type ZodApi from '@asteasolutions/zod-to-openapi';
import type NodeServer from '@hono/node-server';
import type Trpc from '@trpc/server';
import type TrpcAdapter from '@trpc/server/adapters/fetch';
import type { ExternalModule } from '../../utils/constant/config/index.ts';

export interface DependencyModule {
  [ExternalModule.NodeAdapter]: typeof NodeServer | null;
  [ExternalModule.ZodApi]: typeof ZodApi | null;
  [ExternalModule.Trpc]: typeof Trpc | null;
  [ExternalModule.TrpcAdapter]: typeof TrpcAdapter | null;
}
