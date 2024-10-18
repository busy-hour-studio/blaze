import type {
  OpenAPIDefinitions,
  RouteConfig,
} from '@asteasolutions/zod-to-openapi/dist/openapi-registry';
import type { Env, Schema } from 'hono';
import { mergePath } from 'hono/utils/url';
import { Logger } from '../../errors/Logger';
import type { BlazeRouter } from '../../router';
import type { BlazeOpenAPIOption } from '../../types/router';
import { REST_METHOD } from '../constant/rest';

export function assignOpenAPIRegistry<
  E extends Env = Env,
  S extends Schema = NonNullable<unknown>,
  BasePath extends string = '/',
>(
  router: BlazeRouter<E, S, BasePath>,
  docPath: string,
  def: OpenAPIDefinitions
) {
  if (!router.openAPIRegistry) return;

  switch (def.type) {
    case 'component':
      return router.openAPIRegistry.registerComponent(
        def.componentType,
        def.name,
        def.component
      );

    case 'route':
      return router.openAPIRegistry.registerPath({
        ...def.route,
        path: mergePath(docPath, def.route.path),
      });

    case 'webhook':
      return router.openAPIRegistry.registerWebhook({
        ...def.webhook,
        path: mergePath(docPath, def.webhook.path),
      });

    case 'schema':
      return router.openAPIRegistry.register(
        def.schema._def.openapi._internal.refId,
        def.schema
      );

    case 'parameter':
      return router.openAPIRegistry.registerParameter(
        def.schema._def.openapi._internal.refId,
        def.schema
      );

    default: {
      const errorIfNotExhaustive: never = def;
      throw Logger.throw(`Unknown registry type: ${errorIfNotExhaustive}`);
    }
  }
}

export function fixOpenApiPath(path: string) {
  return path.replaceAll(/:([^/]+)/g, '{$1}');
}

export function createOpenApiRouter(route: BlazeOpenAPIOption) {
  const method =
    route.method === REST_METHOD.ALL ? REST_METHOD.POST : route.method;

  return {
    ...route,
    path: fixOpenApiPath(route.path),
    method: method.toLowerCase(),
  } as RouteConfig;
}
