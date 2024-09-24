import { BlazeError } from '../errors/BlazeError';
import { DEPENDENCY_MODULE_MAP, DependencyModule } from '../types/config';
import { crossRequire } from '../utils/common';
import { ExternalModule, PossibleRunTime } from '../utils/constant';

export class BlazeDependency {
  private readonly $runTime: PossibleRunTime;
  public readonly modules: DependencyModule;

  constructor() {
    this.$runTime = this.getRunTime();

    this.modules = {
      [ExternalModule.NodeAdapter]: null,
      [ExternalModule.ZodApi]: this.loadModule(ExternalModule.ZodApi),
      [ExternalModule.Trpc]: this.loadModule(ExternalModule.Trpc),
      [ExternalModule.TrpcAdapter]: this.loadModule(ExternalModule.TrpcAdapter),
    };

    if (this.$runTime === PossibleRunTime.Bun) return;

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

  public get runTime() {
    return this.$runTime;
  }

  public module<
    T extends ExternalModule,
    U extends DependencyModule[T],
    V extends U extends null ? never : U,
  >(module: T): V {
    if (!this.modules[module]) {
      throw new BlazeError(
        `\x1b[31m[Blaze - ERROR]\t${DEPENDENCY_MODULE_MAP[module]} is not installed\x1b[0m`
      );
    }

    return this.modules[module] as V;
  }
}
