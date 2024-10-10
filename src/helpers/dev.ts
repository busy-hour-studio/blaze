// Re-export all the hono dev functions
//  So it will be easier to use
// Ref: https://github.com/honojs/hono/blob/main/src/helper/dev/index.ts
import {
  getRouterName as honoGetRouterName,
  inspectRoutes as honoInspectRoutes,
  showRoutes as honoShowRoutes,
} from 'hono/dev';
import type { Blaze } from '../router';
import type { Random } from '../types/common';

export interface RouteData {
  path: string;
  method: string;
  name: string;
  isMiddleware: boolean;
}

export function getRouterName(app: Blaze) {
  return honoGetRouterName(app.router as Random);
}

export function showRoutes(app: Blaze) {
  return honoShowRoutes(app.router as Random);
}

export function inspectRoutes(app: Blaze): RouteData[] {
  return honoInspectRoutes(app.router as Random);
}
