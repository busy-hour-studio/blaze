import type { Context as HonoCtx } from 'hono';
import type { BlazeContext } from '../internal/context/index.ts';
import type { BlazeRouter } from '../router/BlazeRouter.ts';
import type {
  RESPONSE_TYPE,
  REST_METHOD,
} from '../utils/constant/rest/index.ts';
import type { STATUS_CODE } from '../utils/constant/rest/status-code.ts';
import type { Action } from './action.ts';
import type { Middleware, Service } from './service.ts';

export type StatusCode = (typeof STATUS_CODE)[keyof typeof STATUS_CODE];

export type GenericStatusCode =
  | (typeof STATUS_CODE)[keyof typeof STATUS_CODE]
  | (NonNullable<unknown> & number);

export type Method = (typeof REST_METHOD)[keyof typeof REST_METHOD];

export type ExposedMethod = Exclude<Method, 'USE'>;

export type ResponseType = (typeof RESPONSE_TYPE)[keyof typeof RESPONSE_TYPE];

export type RestRoute = `${Method} /${string}` | `/${string}`;

export interface RestParamOption {
  method?: Method | null;
  path: string;
}

export type RestParam = RestParamOption | RestRoute;

export interface RestHandlerOption {
  service: Service;
  action: Omit<Action, 'name'>;
  router: BlazeRouter;
  middlewares: Middleware[];
}

export interface RestErrorHandlerOption {
  err: Error | unknown;
  ctx: BlazeContext;
  honoCtx: HonoCtx;
}
export interface RestResponseHandlerOption {
  ctx: BlazeContext;
  honoCtx: HonoCtx;
  result: unknown;
}
