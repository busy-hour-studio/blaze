import { z } from 'zod';
import { Logger } from '../../internal/logger';
import { DEPENDENCY_MODULE_MAP, DependencyModule } from '../../types/config';
import { crossRequire } from '../../utils/common';
import { ExternalModule, PossibleRunTime } from '../../utils/constant';

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

    if (this.runTime === PossibleRunTime.Bun) return;

    this.modules[ExternalModule.NodeAdapter] = this.loadModule(
      ExternalModule.NodeAdapter
    );
  }

  private getRunTime() {
    if (process.versions.bun) return PossibleRunTime.Bun;
    if (process.versions.node) return PossibleRunTime.Node;

    return PossibleRunTime.Other;
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
      throw Logger.throw(`${DEPENDENCY_MODULE_MAP[module]} is not installed`);
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
