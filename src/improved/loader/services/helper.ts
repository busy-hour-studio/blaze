import type { BlazeAction } from '../../types/action.ts';
import type { BlazeService } from '../../types/service.ts';
import {
  hasOwnProperty,
  isNil,
  removeTrailingSlash,
} from '../../utils/common/index.ts';
import { loadFile } from '../../utils/common/loader.ts';
import { REST_METHOD } from '../../utils/constants/rest/index.ts';
import { extractRestParams } from '../rests/helper.ts';

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

export function getRestMiddlewares(service: BlazeService, action: BlazeAction) {
  if (!service.middlewares || !action.rest) return [];

  const [method] = extractRestParams(action.rest);

  const middlewares = service.middlewares.filter(
    ([m]) => m === method || m === REST_METHOD.ALL
  );

  return middlewares.map(([, middleware]) => middleware);
}

export async function loadService(filePath: string) {
  const file:
    | BlazeService
    | {
        default: BlazeService;
      } = await loadFile(filePath);

  let service: BlazeService;

  if (
    // use __esModule as indicator for bun
    hasOwnProperty<BlazeService>(file, '__esModule') ||
    // use default as indicator for node
    hasOwnProperty<BlazeService>(file, 'default')
  ) {
    service = file.default;

    // In case it exports default twice
    if (hasOwnProperty<BlazeService>(service, 'default')) {
      service = service.default;
    }
  } else {
    service = file;
  }

  return service;
}
