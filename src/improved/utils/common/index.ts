import type { BlazeMap } from '../../internal/index.ts';
import type { Random } from '../../types/common.ts';

export function hasOwnProperty<
  Z extends NonNullable<unknown>,
  X extends NonNullable<unknown> = NonNullable<unknown>,
  Y extends PropertyKey = PropertyKey,
>(obj: X, property: Y): obj is X & Record<Y, Z> {
  return Object.hasOwn(obj, property);
}

export function mapToObject(
  map: Map<Random, unknown> | BlazeMap<Random, unknown>,
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

export function isEmpty(value: Random): boolean {
  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (value && typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  return false;
}

export function removeTrailingSlash(path: string) {
  return path.replace(/^\/+/, '');
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
