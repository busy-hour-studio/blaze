import type { Context as HonoCtx, MiddlewareHandler } from 'hono';
import type { BlazeContext } from '../internal';
import type { BlazeRouter } from '../router/BlazeRouter';
import {
  RESPONSE_TYPE,
  REST_METHOD,
  STATUS_CODE,
} from '../utils/constant/rest';
import type { BlazeAction } from './action';
import type { Random } from './common';
import type { BlazeService } from './service';

export type BlazeRestMethod = (typeof REST_METHOD)[keyof typeof REST_METHOD];

export type ExposedBlazeRestMethod = Exclude<BlazeRestMethod, 'USE'>;

export type Middleware = [BlazeRestMethod, MiddlewareHandler];

export type BlazeRestRoute =
  | `${ExposedBlazeRestMethod} /${string}`
  | `/${string}`;

export interface BlazeRestOption {
  method?: ExposedBlazeRestMethod | null;
  path: string;
}

export type BlazeRestParam = BlazeRestRoute | BlazeRestOption;

export type StatusCode =
  | (typeof STATUS_CODE)[keyof typeof STATUS_CODE]
  | (number & NonNullable<unknown>);

export type ResponseType = (typeof RESPONSE_TYPE)[keyof typeof RESPONSE_TYPE];

export interface CreateBlazeRestOption {
  service: BlazeService;
  action: Omit<BlazeAction, 'name'>;
  middlewares: Middleware[];
  router: BlazeRouter;
}

export interface BlazeRestSuccessHandlerOption<T = Random> {
  ctx: BlazeContext;
  honoCtx: HonoCtx;
  result: T;
}

export interface BlazeRestErrorHandlerOption<T = Random> {
  err: Error | T;
  ctx: BlazeContext;
  honoCtx: HonoCtx;
}
