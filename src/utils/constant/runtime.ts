// The following code are copied from https://github.com/unjs/std-env/blob/main/src/runtimes.ts

/**
 * Indicates if running in Node.js or a Node.js compatible runtime.
 *
 * **Note:** When running code in Bun and Deno with Node.js compatibility mode, `isNode` flag will be also `true`, indicating running in a Node.js compatible runtime.
 *
 * Use `runtime === "node"` if you need strict check for Node.js runtime.
 */
export const isNode = globalThis.process?.release?.name === 'node';

/**
 * Indicates if running in Bun runtime.
 */
export const isBun = !!globalThis.Bun || !!globalThis.process?.versions?.bun;

/**
 * Indicates if running in Deno runtime.
 */
export const isDeno = !!globalThis.Deno;

/**
 * Indicates if running in Fastly runtime.
 */
export const isFastly = !!globalThis.fastly;

/**
 * Indicates if running in Netlify runtime.
 */
export const isNetlify = !!globalThis.Netlify;

/**
 *
 * Indicates if running in EdgeLight (Vercel Edge) runtime.
 */
export const isEdgeLight = !!globalThis.EdgeRuntime;
// https://developers.cloudflare.com/workers/runtime-apis/web-standards/#navigatoruseragent

/**
 * Indicates if running in Cloudflare Workers runtime.
 */
export const isWorkerd =
  globalThis.navigator?.userAgent === 'Cloudflare-Workers';
