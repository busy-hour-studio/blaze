import type {
  AnyRouter,
  CreateRouterInner,
  DefaultDataTransformer,
  DefaultErrorShape,
  initTRPC,
  ProcedureType,
  RootConfig,
} from '@trpc/server';
import type { FetchHandlerRequestOptions } from '@trpc/server/adapters/fetch';
import type { MiddlewareHandler } from 'hono';
import type { BlazeServiceAction } from '../loader/action.ts';
import type {
  TrpcMutationCallRecord,
  TrpcQueryCallRecord,
} from './external.ts';

export type BlazeTrpcRouter = CreateRouterInner<
  RootConfig<{
    ctx: object;
    meta: object;
    errorShape: DefaultErrorShape;
    transformer: DefaultDataTransformer;
  }>,
  // @ts-expect-error no-defined-name-props
  TrpcMutationCallRecord & TrpcQueryCallRecord
>;

type Trpc = ReturnType<(typeof initTRPC)['create']>;

export type TrpcProcedure = Trpc['procedure'];

export type GroupTrpcAction = { [T in ProcedureType]: BlazeServiceAction[] };

export interface BlazeTrpc {
  instance: Trpc;
  router: BlazeTrpcRouter;
  procedure: Trpc['procedure'];
}

export interface TrpcOption
  extends Partial<
    Omit<
      FetchHandlerRequestOptions<AnyRouter>,
      'req' | 'createContext' | 'router'
    >
  > {
  middlewares?: MiddlewareHandler[];
}
