// Re-export all the hono compress middleware
//  So it will be easier to use
// Ref: https://github.com/honojs/hono/blob/main/src/middleware/compress/index.ts

import { compress as honoCompress } from 'hono/compress';

/**
 * Compress the REST response
 * @example
 * ```ts
 * const action = BlazeCreator.action({
 *   rest: 'POST /',
 *   middlewares: [
 *     ['ALL', compress()]
 *   ],
 *   async handler(ctx) {
 *      /// Do something with the request
 *   }
 * })
 * ```

 */
export function compress(options: Parameters<typeof honoCompress>[0] = {}) {
  return honoCompress(options);
}
