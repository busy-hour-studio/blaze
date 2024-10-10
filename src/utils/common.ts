import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { Logger } from '../internal/logger';
// eslint-disable-next-line import/no-cycle
import type { Random } from '../types/common';
import type { BlazeService } from '../types/service';

export function hasOwnProperty<
  Z extends NonNullable<unknown>,
  X extends NonNullable<unknown> = NonNullable<unknown>,
  Y extends PropertyKey = PropertyKey,
>(obj: X, property: Y): obj is X & Record<Y, Z> {
  return Object.hasOwn(obj, property);
}

export function mapToObject(
  map: Map<Random, unknown>,
  valueMapper?: (value: unknown) => unknown
) {
  return Array.from(map.entries()).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: valueMapper ? valueMapper(value) : value,
    }),
    {}
  );
}

export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function isNil<T>(
  value: T | null | undefined
): value is null | undefined {
  return value === null || value === undefined;
}

// eslint-disable-next-line @typescript-eslint/no-shadow
export function removeTrailingSlash(path: string) {
  return path.replace(/^\/+/, '');
}

export function getRestPath(service: BlazeService) {
  const version = service.version ? `v${service.version}` : '';
  const restPath =
    typeof service.rest === 'string' ? service.rest : service.name;

  return [version, restPath]
    .map((val) => (typeof val === 'string' ? removeTrailingSlash(val) : null))
    .filter(Boolean)
    .join('/');
}

export function getServiceName(service: BlazeService) {
  const version = !isNil(service.version) ? `v${service.version}` : '';

  return [version, service.name].filter(Boolean).join('.');
}

export async function resolvePromise<T>(
  promise: Promise<T> | T
): Promise<
  readonly [result: T, error: null] | readonly [result: null, error: unknown]
> {
  try {
    const res = await promise;

    return [res, null] as const;
  } catch (err) {
    return [null, err] as const;
  }
}

export function isEmpty(value: Random): boolean {
  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (value && typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  return false;
}

export function isOnCjs() {
  return typeof module !== 'undefined' && typeof exports !== 'undefined';
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

export function crossRequire<T = Random>(id: string): T {
  if (isOnCjs()) {
    return require(id);
  }

  const esmRequire = createRequire(import.meta.url);

  return esmRequire(id);
}
