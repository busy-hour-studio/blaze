import type { Service } from '../../types/service.ts';
import { isNil, removeTrailingSlash } from '../../utils/common.ts';

export function getRestPath(service: Service) {
  const version = service.version ? `v${service.version}` : '';
  const restPath =
    typeof service.rest === 'string' ? service.rest : service.name;

  return [version, restPath]
    .map((val) => (typeof val === 'string' ? removeTrailingSlash(val) : null))
    .filter(Boolean)
    .join('/');
}

export function getServiceName(service: Service) {
  const version = !isNil(service.version) ? `v${service.version}` : '';

  return [version, service.name].filter(Boolean).join('.');
}
