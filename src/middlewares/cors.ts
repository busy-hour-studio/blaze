/*
    This cors implementation are modified a version of hono/cors so it can be used with Blaze
    https://github.com/honojs/hono/blob/main/src/middleware/cors/index.ts
    MIT License
    Copyright (c) 2022 Yusuke Wada
*/
import type { Context as HonoCtx, Next as HonoNext } from 'hono';
import { BlazeContext } from '../internal';
import type { AnyContext } from '../types/context';
import { ExposedMethod } from '../types/rest';

export interface CORSOptions {
  origin:
    | string
    | string[]
    | ((origin: string, ctx: BlazeContext) => string | undefined | null);
  allowMethods?: Exclude<ExposedMethod, 'ALL'>[];
  allowHeaders?: string[];
  maxAge?: number;
  credentials?: boolean;
  exposeHeaders?: string[];
}

const defaults: CORSOptions = {
  origin: '*',
  allowMethods: ['HEAD', 'POST', 'PUT', 'PATCH', 'GET', 'DELETE'],
  allowHeaders: [],
  exposeHeaders: [],
};

function findAllowOrigin(optsOrigin: CORSOptions['origin']) {
  if (typeof optsOrigin === 'string') {
    return () => optsOrigin;
  }

  if (typeof optsOrigin === 'function') {
    return optsOrigin;
  }

  return (origin: string) =>
    optsOrigin.includes(origin) ? origin : optsOrigin[0];
}

function set(honoCtx: HonoCtx) {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  return function set(key: string, value: string) {
    honoCtx.res.headers.set(key, value);
  };
}

/**
 * Enable CORS for specific services/routes
 * @example
 * ```ts
 * const action = BlazeCreator.action({
 *   rest: 'POST /',
 *   middlewares: [
 *     [
 *       'ALL',
 *       cors({
 *         origin: '*',
 *       })
 *     ]
 *   ],
 *   async handler(ctx) {
 *      /// Do something with the request
 *   }
 * })
 * ```
 */
export function cors(options: CORSOptions = defaults) {
  const opts = {
    ...defaults,
    ...options,
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  return async function cors(honoCtx: HonoCtx, next: HonoNext) {
    const setRes = set(honoCtx);
    const ctx: AnyContext =
      honoCtx.get('blaze') ??
      new BlazeContext({
        body: null,
        honoCtx,
        headers: null,
        meta: null,
        params: null,
        query: null,
        validations: null,
      });

    // Re-use the BlazeContext later on
    honoCtx.set('blaze', ctx);

    const allowOrigin = findAllowOrigin(opts.origin)(
      honoCtx.req.header('origin') || '',
      ctx
    );

    if (allowOrigin) {
      setRes('Access-Control-Allow-Origin', allowOrigin);
    }

    // Suppose the server sends a response with an Access-Control-Allow-Origin value with an explicit origin (rather than the "*" wildcard).
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin
    if (opts.origin !== '*') {
      setRes('Vary', 'Origin');
    }

    if (opts.credentials) {
      setRes('Access-Control-Allow-Credentials', 'true');
    }

    if (opts.exposeHeaders?.length) {
      setRes('Access-Control-Expose-Headers', opts.exposeHeaders.join(','));
    }

    if (honoCtx.req.method === 'OPTIONS') {
      if (opts.maxAge != null) {
        setRes('Access-Control-Max-Age', opts.maxAge.toString());
      }

      if (opts.allowMethods?.length) {
        setRes('Access-Control-Allow-Methods', opts.allowMethods.join(','));
      }

      let headers = opts.allowHeaders;

      if (!headers?.length) {
        const requestHeaders = honoCtx.req.header(
          'Access-Control-Request-Headers'
        );

        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }

      if (headers?.length) {
        setRes('Access-Control-Allow-Headers', headers.join(','));
        honoCtx.res.headers.append('Vary', 'Access-Control-Request-Headers');
      }

      honoCtx.res.headers.delete('Content-Length');
      honoCtx.res.headers.delete('Content-Type');

      return new Response(null, {
        headers: honoCtx.res.headers,
        status: 204,
        statusText: honoCtx.res.statusText,
      });
    }

    await next();
  };
}
