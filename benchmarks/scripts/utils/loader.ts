import { exec } from 'node:child_process';
import path from 'node:path';
import { __dirname } from '../../config';

export function loadFramework(framework: string, runtime: 'node' | 'bun') {
  const frameworkPath = path.join(__dirname, framework);

  if (runtime === 'node') {
    return exec('npx tsx index.ts', {
      cwd: frameworkPath,
    });
  }

  return exec('npx bun app.ts', {
    cwd: frameworkPath,
  });
}
