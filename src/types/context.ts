import { type Context as HonoCtx } from 'hono';

export interface CreateContextOption<
  Body extends Record<string, unknown> = Record<string, unknown>,
  Params extends Record<string, unknown> = Record<string, unknown>,
  Headers extends Record<string, string> = Record<string, string>,
> {
  honoCtx: HonoCtx | null;
  body: Body | null;
  params: Params | null;
  headers: Headers | null;
}
