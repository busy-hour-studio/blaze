/*
  This script is heavily inspired by `built.ts` used in @kaze-style/react.
  https://github.com/taishinaritomi/kaze-style/blob/main/scripts/build.ts
  MIT License
  Copyright (c) 2022 Taishi Naritomi


  This script is heavily inspired by `built.ts` used in  hono.
  https://github.com/honojs/hono/blob/main/build.ts
  MIT License
  Copyright (c) 2022 Yusuke Wada
*/

import { exec } from 'child_process';
import type { BuildOptions, Plugin, PluginBuild } from 'esbuild';
import { build } from 'esbuild';
import { glob } from 'glob';
import fs from 'node:fs';
import path from 'node:path';

const entryPoints = glob.sync('./src/**/*.ts', {
  ignore: ['./src/**/*.test.ts'],
});

/*
  This plugin is inspired by the following.
  https://github.com/evanw/esbuild/issues/622#issuecomment-769462611
*/
const addExtension = (
  extension: string = '.js',
  fileExtension: string = '.ts'
): Plugin => ({
  name: 'add-extension',
  // eslint-disable-next-line @typescript-eslint/no-shadow
  setup(build: PluginBuild) {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    build.onResolve({ filter: /.*/ }, (args) => {
      if (args.importer) {
        const p = path.join(args.resolveDir, args.path);
        let tsPath = `${p}${fileExtension}`;

        let importPath = '';
        if (fs.existsSync(tsPath)) {
          importPath = args.path + extension;
        } else {
          tsPath = path.join(
            args.resolveDir,
            args.path,
            `index${fileExtension}`
          );
          if (fs.existsSync(tsPath)) {
            importPath = `${args.path}/index${extension}`;
          }
        }
        return { path: importPath, external: true };
      }
    });
  },
});

const commonOptions: BuildOptions = {
  entryPoints,
  logLevel: 'info',
  platform: 'node',
};

const cjsBuild = () =>
  build({
    ...commonOptions,
    outbase: './src',
    outdir: './dist/cjs',
    format: 'cjs',
  });

const esmBuild = () =>
  build({
    ...commonOptions,
    bundle: true,
    outbase: './src',
    outdir: './dist/esm',
    format: 'esm',
    plugins: [addExtension('.js')],
  });

Promise.all([esmBuild(), cjsBuild()]);

exec(`tsc --project tsconfig.build.json && resolve-tspaths`);
