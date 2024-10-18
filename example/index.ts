import './utils/setup';

import { Blaze } from '@busy-hour/blaze';
import { cors } from '@busy-hour/blaze/cors';
import { swaggerUI } from '@hono/swagger-ui';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import coreService from './services/core';
import usersService from './services/users';

export type { BlazeTrpcRouter } from '@busy-hour/blaze/trpc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const servicePath = path.resolve(__dirname, 'services');

const app = new Blaze();

// Load imported services directly so it can be bundled with Bun
app.import({
  services: [usersService, coreService],
  autoStart: true,
  middlewares: [['ALL', cors()]],
});

await app.load({
  path: servicePath,
  autoStart: true,
  middlewares: [['ALL', cors()]],
});

// Auto generate OpenAPI documentation example
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Blaze OpenAPI Example',
  },
});

// Auto generate Swagger Doc base on OpenAPI documentation
app.use(
  '/doc/ui',
  swaggerUI({
    url: '/doc',
  }) as never
);

const config = app.serve(3000);

// TRPC server examples
app.trpc('/trpc/*', {
  middlewares: [cors()],
});

export default config;
