import { serve } from '@hono/node-server';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Blaze, initializeServices } from '../../src';

const app = new Blaze({});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const servicePath = path.resolve(__dirname, 'services');

initializeServices({
  app,
  path: servicePath,
});

const config = {
  fetch: app.fetch as never,
  port: 3000,
};

serve(config, () => {
  console.log('Blaze server listening on port 3000');
});
