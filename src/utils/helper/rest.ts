import { Hono } from 'hono';
import { Method, RestParam, RestRoute } from '@/types/rest';

export function extractRestPath(restRoute: RestRoute) {
  const restPath = restRoute.split(' ');

  if (restPath.length === 1) {
    return [null, restPath[0]] as const;
  }

  return [restPath[0] as Method, restPath[1]] as const;
}

export function extractRestParams(params: RestParam) {
  if (typeof params === 'string') return extractRestPath(params);

  return [params.method ?? null, params.path] as const;
}

export function getRouteHandler(router: Hono, method: Method | null) {
  if (!method) return router.all;

  return router[method.toLowerCase() as Lowercase<Method>];
}
