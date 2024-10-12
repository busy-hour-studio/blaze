import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { Logger } from '../../internal/logger/index.ts';
import type { Random } from '../../types/common.ts';

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

export function loadFile<T = Random>(id: string): Promise<T> {
  if (isOnCjs()) {
    return require(id);
  }

  if (!fs.existsSync(id)) {
    throw Logger.throw(`${id} doesn't exist`);
  }

  if (fs.statSync(id).isDirectory()) {
    const infos = fs.readdirSync(id);
    const index = infos.find((info) =>
      info.match(/index\.[jt]s$|index\.[jt]x|index\.[cm][jt]s$/)
    );

    if (!index) {
      throw Logger.throw(
        `No index file found in directory ${id} (expected to find index.[jt]s or index.[jt]x or index.[cm][jt]s)`
      );
    }

    return import(path.join(id, index));
  }

  return import(id);
}
