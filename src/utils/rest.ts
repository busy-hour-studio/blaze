import { type RestHandlerOption } from '@/types/rest';
import { createRestHandler } from './helper/handler';
import { extractRestParams, getRouteHandler } from './helper/rest';

export function setupRestHandler(options: RestHandlerOption) {
  const [method, path] = extractRestParams(options.rest);
  const apiHandler = createRestHandler({
    handler: options.handler,
    hooks: options.hooks,
  });
  const routeHandler = getRouteHandler(options.router, method);

  routeHandler(path, apiHandler);
}
