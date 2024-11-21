import { z } from 'zod';
import { crossRequire } from '../../utils/common';
import {
  DependencyModuleMap,
  ExternalModule,
  PossibleRunTime,
} from '../../utils/constant/config/index';
import {
  isBun,
  isDeno,
  isEdgeLight,
  isFastly,
  isNetlify,
  isNode,
  isWorkerd,
} from '../../utils/constant/config/runtime';
import { Logger } from '../logger/index';
import type { DependencyModule } from './types';

export class BlazeConfig {
  public readonly runTime: PossibleRunTime;
  public readonly modules: DependencyModule;

  constructor() {
    this.runTime = this.getRunTime();

    this.modules = {
      [ExternalModule.NodeAdapter]: null,
      [ExternalModule.ZodApi]: this.loadModule(ExternalModule.ZodApi),
      [ExternalModule.Trpc]: this.loadModule(ExternalModule.Trpc),
      [ExternalModule.TrpcAdapter]: this.loadModule(ExternalModule.TrpcAdapter),
    };

    if (this.runTime !== PossibleRunTime.NODE) return;

    this.modules[ExternalModule.NodeAdapter] = this.loadModule(
      ExternalModule.NodeAdapter
    );
  }

  private getRunTime() {
    if (isNetlify) return PossibleRunTime.NETLIFY;
    if (isEdgeLight) return PossibleRunTime.EDGE_LIGHT;
    if (isWorkerd) return PossibleRunTime.WORKER_D;
    if (isFastly) return PossibleRunTime.FASTLY;
    if (isDeno) return PossibleRunTime.DENO;
    if (isBun) return PossibleRunTime.BUN;
    if (isNode) return PossibleRunTime.NODE;

    return PossibleRunTime.OTHER;
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
    U extends DependencyModule[T],
    V extends U extends null ? never : U,
  >(module: T): V {
    if (!this.modules[module]) {
      throw Logger.throw(`${DependencyModuleMap[module]} is not installed`);
    }

    return this.modules[module] as V;
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
  public setModule<T extends ExternalModule>(
    id: T,
    module: DependencyModule[T]
  ) {
    this.modules[id] = module;

    if (id === ExternalModule.ZodApi && module) {
      // @ts-expect-error OpenAPI is not loaded properly
      delete z.ZodType.prototype.openapi;

      const zodApi = module as NonNullable<
        DependencyModule[typeof ExternalModule.ZodApi]
      >;

      zodApi.extendZodWithOpenApi(z);
    }
  }
}
