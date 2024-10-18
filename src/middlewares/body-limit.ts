/*
    This body-limit implementation are modified a version of hono/body-limit so it can be used with Blaze
    https://github.com/honojs/hono/blob/main/src/middleware/body-limit/index.ts
    MIT License
    Copyright (c) 2022 Yusuke Wada
*/
import type { Context as HonoCtx, Next as HonoNext } from 'hono';
import { handleRestError, handleRestResponse } from '../handler/rest.ts';
import { BlazeContext } from '../internal/context/index.ts';
import { BlazeError } from '../internal/errors/index.ts';
import type { ActionHandler } from '../types/action.ts';
import { resolvePromise } from '../utils/common.ts';

export interface BodyLimitOptions {
  maxSize: number;
  onError?: ActionHandler;
}

function errorHandler(onError: ActionHandler) {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  return async function errorHandler(honoCtx: HonoCtx) {
    const ctx = new BlazeContext({
      body: null,
      honoCtx,
      headers: null,
      meta: null,
      params: null,
      query: null,
    });

    const [result, err] = await resolvePromise(onError(ctx));

    if (err) {
      return handleRestError({
        honoCtx,
        ctx,
        err,
      });
    }

    return handleRestResponse({
      honoCtx,
      result,
      ctx,
    });
  };
}

/**
 * Limit request body size
 * @example
 * ```ts
 * const action = BlazeCreator.action({
 *   rest: 'POST /',
 *   middlewares: [
 *     [
 *       'ALL',
 *       bodyLimit({
 *        maxSize: 100 * 1024, // 100kb
 *        async onError() {
 *          throw new BlazeError('Payload too large', 413)
 *         }
 *       })
 *     ]
 *   ],
 *   async handler(ctx) {
 *      /// Do something with the request
 *      /// when the request size is less than 100kb
 *   }
 * })
 * ```
 */
export function bodyLimit(options: BodyLimitOptions) {
  const handler =
    options.onError ??
    (async () => {
      throw new BlazeError('Payload too large', 413);
    });
  const onError = errorHandler(handler);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  return async function bodyLimit(honoCtx: HonoCtx, next: HonoNext) {
    if (!honoCtx.req.raw.body) {
      return next();
    }

    if (honoCtx.req.raw.headers.has('content-length')) {
      const contentLength = parseInt(
        honoCtx.req.raw.headers.get('content-length') || '0',
        10
      );

      return contentLength > options.maxSize ? onError(honoCtx) : next();
    }

    let size = 0;
    const rawReader = honoCtx.req.raw.body.getReader();
    const reader = new ReadableStream({
      async start(controller) {
        try {
          for (;;) {
            const { done, value } = await rawReader.read();

            if (done) break;

            size += value.length;

            if (size > options.maxSize) {
              controller.error(new BlazeError('Request too large', 413));
              break;
            }

            controller.enqueue(value);
          }
        } finally {
          controller.close();
        }
      },
    });

    // eslint-disable-next-line no-param-reassign
    honoCtx.req.raw = new Request(honoCtx.req.raw, { body: reader });

    await next();

    if (honoCtx.error instanceof BlazeError) {
      // eslint-disable-next-line no-param-reassign
      honoCtx.res = await onError(honoCtx);
    }
  };
}
