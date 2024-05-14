import type ZodApi from '@asteasolutions/zod-to-openapi';
import type NodeServer from '@hono/node-server';
import type { ExternalModule } from '../utils/constant';

export interface DependencyModule {
  [ExternalModule.NodeAdapter]: typeof NodeServer | null;
  [ExternalModule.ZodApi]: typeof ZodApi | null;
}
