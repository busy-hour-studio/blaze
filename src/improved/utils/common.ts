import { createRequire } from 'node:module';
import type { Random } from '../types/common.ts';

export function isOnCjs() {
  return typeof module !== 'undefined' && typeof exports !== 'undefined';
}

export function crossRequire<T = Random>(id: string): T {
  if (isOnCjs()) {
    return require(id);
  }

  const esmRequire = createRequire(import.meta.url);

  return esmRequire(id);
}
