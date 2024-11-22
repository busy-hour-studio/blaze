import { exec } from 'node:child_process';
import path from 'node:path';
import { __dirname } from '../../config';

export function loadFramework(framework: string, runtime: 'node' | 'bun') {
  const frameworkPath = path.join(__dirname, framework);
  const runner = runtime === 'node' ? 'tsx' : 'bun';
  const file = runtime === 'node' ? 'index.ts' : 'app.ts';
  const args = ['npx', runner, file].join(' ');

  const childProcess = exec(args, {
    cwd: frameworkPath,
  });

  childProcess.unref();

  return childProcess;
}
