import { BlazeDependency } from '../../config';
import type { Blaze } from '../../router';
import type { BlazeTrpc, TrpcOption } from '../../types/trpc';
import { ExternalModule } from '../constant';
import { TrpcConstructor } from './constructor';

export function loadTrpc(app: Blaze): BlazeTrpc {
  const instance = BlazeDependency.module(
    ExternalModule.Trpc
  ).initTRPC.create();

  const trpcLoader = new TrpcConstructor(app, instance.procedure);
  const router = instance.router(trpcLoader.procedures);

  return {
    router,
    instance,
    procedure: instance.procedure,
  };
}

/**
 * Load all the service actions to Trpc adapter
 * @example
 * ```ts
 *
 * const { router } = app.trpc('/trpc/*', {
 *    middlewares: [cors()],
 *  })
 *
 * // Re-export the router like this
 * export type BlazeTrpcRouter = typeof router;
 * // or export the types from the modules
 * export { BlazeTrpcRouter } from '@busy-hour/blaze/trpc'
 * ```
 */
export function useTrpc(
  this: Blaze,
  path: string,
  { endpoint = '/trpc', middlewares = [], ...options }: TrpcOption = {}
) {
  const trpc = loadTrpc(this);

  this.use(path, ...middlewares, async (ctx) => {
    const response = await BlazeDependency.module(
      ExternalModule.TrpcAdapter
    ).fetchRequestHandler({
      ...options,
      router: trpc.router,
      createContext: async () => ({}),
      endpoint,
      req: ctx.req.raw,
    });

    ctx.body(response.body, response);

    return response;
  });

  return trpc;
}

export type UseTrpc = typeof useTrpc;
