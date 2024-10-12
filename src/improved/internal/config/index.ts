import { z } from 'zod';
import { crossRequire } from '../../utils/common/loader.ts';
import {
  DepedencyModuleMap,
  ExternalModule,
  RunTimeName,
} from '../../utils/constants/config.ts';
import {
  isWorkerd,
  isDeno,
  isBun,
  isFastly,
  isEdgeLight,
  isNetlify,
  isNode,
} from '../../utils/constants/runtime.ts';
import { Logger } from '../logger/index.ts';
import type { BlazeDepedency } from './types.ts';

export class BlazeConfig {
  public readonly runTime: RunTimeName;
  public readonly modules: BlazeDepedency;

  constructor() {
    this.runTime = this.getRunTime();

    this.modules = {
      [ExternalModule.NodeAdapter]: null,
      [ExternalModule.ZodApi]: this.loadModule(ExternalModule.ZodApi),
      [ExternalModule.Trpc]: this.loadModule(ExternalModule.Trpc),
      [ExternalModule.TrpcAdapter]: this.loadModule(ExternalModule.TrpcAdapter),
    };

    if (this.runTime === RunTimeName.BUN || RunTimeName.DENO) return;

    this.modules[ExternalModule.NodeAdapter] = this.loadModule(
      ExternalModule.NodeAdapter
    );
  }

  private getRunTime() {
    if (isNetlify) return RunTimeName.NETLIFY;
    if (isEdgeLight) return RunTimeName.EDGE_LIGHT;
    if (isWorkerd) return RunTimeName.WORKER_D;
    if (isFastly) return RunTimeName.FASTLY;
    if (isDeno) return RunTimeName.DENO;
    if (isBun) return RunTimeName.BUN;
    if (isNode) return RunTimeName.NODE;

    return RunTimeName.OTHER;
  }

  private loadModule<T extends ExternalModule>(module: T) {
    try {
      return crossRequire(module);
    } catch {
      return null;
    }
  }

  public module<
    T extends ExternalModule,
    U extends (typeof DepedencyModuleMap)[T],
    V extends U extends null ? never : U,
  >(mod: T): V {
    if (!this.modules[mod]) {
      throw Logger.throw(`${DepedencyModuleMap[mod]} is not installed`);
    }

    return this.modules[mod] as unknown as V;
  }

  /**
   * Load necessary module directly that will be used in the app. Recommended if you want to bundle the app with Bun
   * @example
   * ```ts
   * import *  as nodeAdapter from '@hono/node-server'
   *
   * app.setModule(ExternalModule.NodeAdapter, nodeAdapter)
   * ```
   */
  public setModule<T extends ExternalModule>(id: T, mod: BlazeDepedency[T]) {
    this.modules[id] = mod as unknown as BlazeDepedency[T];

    if (id === ExternalModule.ZodApi && mod) {
      // @ts-expect-error OpenAPI is not loaded properly
      delete z.ZodType.prototype.openapi;

      const zodApi = mod as NonNullable<
        BlazeDepedency[typeof ExternalModule.ZodApi]
      >;

      zodApi.extendZodWithOpenApi(z);
    }
  }
}
