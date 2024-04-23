import { DependencyModule } from '../types/config';
import { crossRequire } from '../utils/common';
import { ExternalModule, PossibleRunTime } from '../utils/constant';

export class BlazeDependency {
  private readonly $runTime: PossibleRunTime;
  public readonly modules: DependencyModule;

  constructor() {
    this.modules = {
      [ExternalModule.NodeAdapter]: this.loadNodeAdapter(),
      [ExternalModule.ZodApi]: this.loadZodApi(),
    };
    this.$runTime = this.getRunTime();
  }

  private getRunTime() {
    if (process.versions.node) return PossibleRunTime.Node;

    return PossibleRunTime.Other;
  }

  private loadNodeAdapter() {
    try {
      return crossRequire(ExternalModule.NodeAdapter);
    } catch {
      return null;
    }
  }

  private loadZodApi() {
    try {
      return crossRequire(ExternalModule.ZodApi);
    } catch {
      return null;
    }
  }

  public get runTime() {
    return this.$runTime;
  }
}
