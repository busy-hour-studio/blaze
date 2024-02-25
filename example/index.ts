import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Blaze, initializeServices } from '../src';

const app = new Blaze({});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const servicePath = path.resolve(__dirname, 'services');

initializeServices({
  app,
  path: servicePath,
});

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Blaze OpenAPI Example',
  },
});

const config = {
  fetch: app.fetch as never,
  port: 3000,
};

export default config;
