import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const PORT_ALLOCATION = {
  BLAZE: 3000,
  HONO: 3001,
  EXPRESS: 3002,
};

export const FRAMEWORK = {
  BLAZE: 'Blaze',
  HONO: 'Hono',
  EXPRESS: 'Express',
};

export const FRAMEWORKS = Object.values(FRAMEWORK);

export const PORTS = Object.values(PORT_ALLOCATION);

export const FRAMEWORK_PORTS = [
  { framework: FRAMEWORK.BLAZE, port: PORT_ALLOCATION.BLAZE },
  { framework: FRAMEWORK.HONO, port: PORT_ALLOCATION.HONO },
  { framework: FRAMEWORK.EXPRESS, port: PORT_ALLOCATION.EXPRESS },
];

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const outputPath = path.join(__dirname, 'benchmarks');

export const BENCHMARK = {
  CONNECTIONS: 100,
  DURATION: 30,
  PIPELINING: 10,
};
