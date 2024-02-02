import { type Context as HonoCtx } from 'hono';

export type CreateContextOption<
  Body extends Record<string, unknown> = Record<string, unknown>,
  Params extends Record<string, unknown> = Record<string, unknown>,
> = {
  honoCtx: HonoCtx | null;
  body: Body | null;
  params: Params | null;
};
