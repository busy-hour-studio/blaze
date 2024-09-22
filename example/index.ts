import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Blaze } from '../src';
import { cors } from '../src/middlewares/cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const servicePath = path.resolve(__dirname, 'services');

const app = new Blaze();

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

const config = app.serve(3000);

// TRPC server examples
app.trpc('/trpc/*', {
  middlewares: [cors()],
});

export default config;
