/*
    This Blaze class are heavily inspired by hono/cors
    https://github.com/honojs/hono/blob/main/src/middleware/cors/index.ts
    MIT License
    Copyright (c) 2022 Yusuke Wada

    The main difference is that we use `BlazeContext` instead of `HonoCtx`
*/
import type { Context as HonoCtx, Next as HonoNext } from 'hono';
import { BlazeContext } from '../event';
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

export function cors(options?: CORSOptions) {
  const opts = {
    ...defaults,
    ...options,
  };

  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === 'string') {
      return () => optsOrigin;
    }

    if (typeof optsOrigin === 'function') {
      return optsOrigin;
    }

    return (origin: string) =>
      optsOrigin.includes(origin) ? origin : optsOrigin[0];
  })(opts.origin);

  // eslint-disable-next-line func-names
  return async function (honoCtx: HonoCtx, next: HonoNext) {
    const ctx: BlazeContext =
      honoCtx.get('blaze') ??
      new BlazeContext({
        body: null,
        honoCtx,
        headers: null,
        meta: null,
        params: null,
        validations: null,
      });

    // Re-use the BlazeContext later on
    honoCtx.set('blaze', ctx);

    function set(key: string, value: string) {
      honoCtx.res.headers.set(key, value);
    }

    const allowOrigin = findAllowOrigin(
      honoCtx.req.header('origin') || '',
      ctx
    );

    if (allowOrigin) {
      set('Access-Control-Allow-Origin', allowOrigin);
    }

    // Suppose the server sends a response with an Access-Control-Allow-Origin value with an explicit origin (rather than the "*" wildcard).
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin
    if (opts.origin !== '*') {
      set('Vary', 'Origin');
    }

    if (opts.credentials) {
      set('Access-Control-Allow-Credentials', 'true');
    }

    if (opts.exposeHeaders?.length) {
      set('Access-Control-Expose-Headers', opts.exposeHeaders.join(','));
    }

    if (honoCtx.req.method === 'OPTIONS') {
      if (opts.maxAge != null) {
        set('Access-Control-Max-Age', opts.maxAge.toString());
      }

      if (opts.allowMethods?.length) {
        set('Access-Control-Allow-Methods', opts.allowMethods.join(','));
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
        set('Access-Control-Allow-Headers', headers.join(','));
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

    honoCtx.res.headers.forEach((value, key) => {
      ctx.headers.set(key, value);
    });

    await next();
  };
}