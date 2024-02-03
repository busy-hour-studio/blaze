import type { Service } from '@/types/service';

export function hasOwnProperty<
  Z extends NonNullable<unknown>,
  X extends NonNullable<unknown> = NonNullable<unknown>,
  Y extends PropertyKey = PropertyKey,
>(obj: X, property: Y): obj is X & Record<Y, Z> {
  return Object.hasOwn(obj, property);
}

export function removeTrailingSlash(path: string) {
  return path.replace(/^\/+/, '');
}

export function getRestPath(service: Service) {
  const version = service.version ? `v${service.version}` : '';
  const prefix = service.prefix ?? '';

  return ['/', version, prefix, service.name]
    .map((val) => removeTrailingSlash(val))
    .filter(Boolean)
    .join('/');
}

export function getServiceName(service: Service) {
  const version = service.version ? `v${service.version}` : '';
  const prefix = service.prefix ?? '';

  return [version, prefix, service.name].filter(Boolean).join('.');
}

export async function resolvePromise<T>(promise: Promise<T> | T) {
  try {
    const res = await promise;

    return [res, null] as const;
  } catch (err) {
    return [null, err] as const;
  }
}

export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
