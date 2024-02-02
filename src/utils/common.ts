import type { Service } from '@/types/service';

export function hasOwnProperty<
  Z extends NonNullable<unknown>,
  X extends NonNullable<unknown> = NonNullable<unknown>,
  Y extends PropertyKey = PropertyKey,
>(obj: X, property: Y): obj is X & Record<Y, Z> {
  // eslint-disable-next-line no-prototype-builtins
  return obj.hasOwnProperty(property);
}

export function loadService(filePath: string) {
  const file = require(filePath) as
    | Service
    | {
        default: Service;
      };
  let service: Service;

  if (hasOwnProperty<Service>(file, 'default')) {
    service = file.default;
  } else {
    service = file;
  }

  return service;
}

export function removeTrailingSlash(path: string) {
  return path.replace(/^\/+/, '');
}

export function createRestPath(service: Service) {
  return ['/', service.prefix ?? '', service.name]
    .map((val) => removeTrailingSlash(val))
    .filter(Boolean)
    .join('/');
}

export function createServiceName(service: Service) {
  return [service.version ?? '', service.prefix ?? '', service.name]
    .filter(Boolean)
    .join('.');
}

export async function resolvePromise<T>(promise: Promise<T> | T) {
  try {
    const res = await promise;

    return [res, null] as const;
  } catch (err) {
    return [null, err] as const;
  }
}
