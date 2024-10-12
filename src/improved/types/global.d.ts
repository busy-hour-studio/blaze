/* eslint-disable no-var */
/* eslint-disable vars-on-top */
// deno-lint-ignore-file

import type { Random } from './common.ts';

declare global {
  var Bun: unknown | null | undefined;
  var fastly: unknown | null | undefined;
  var Netlify: unknown | null | undefined;
  var EdgeRuntime: unknown | null | undefined;
  var Deno: unknown | null | undefined;

  var process: Random;
  var module: Random;
  var require: (id: string) => Random;
  var exports: Random;
}

export {};
