import { BlazeError } from '../errors/BlazeError';
import { crossRequire } from '../utils/common';

export class BlazeDependency {
  private $runTime: 'node' | 'other';
  private $nodeAdapter: typeof import('@hono/node-server') | null;
  public readonly moduleExist: Record<'node-adapter', boolean>;

  constructor() {
    const node = this.loadNodeAdapter();

    this.$nodeAdapter = node.adapter;
    this.moduleExist = {
      'node-adapter': node.isExist,
    };
    this.$runTime = this.getRunTime();
  }

  public load<T>(pkg: string) {
    return crossRequire<T>(pkg);
  }

  private getRunTime() {
    if (process.versions.node) return 'node';

    return 'other';
  }

  private loadNodeAdapter() {
    try {
      return {
        isExist: true,
        adapter:
          this.load<typeof import('@hono/node-server')>('@hono/node-server'),
      } as const;
    } catch {
      return {
        isExist: false,
        adapter: null,
      } as const;
    }
  }

  public get nodeAdapter() {
    if (!this.$nodeAdapter) {
      throw new BlazeError('Node Adapter is not installed');
    }

    return this.$nodeAdapter;
  }

  public get runTime() {
    return this.$runTime;
  }
}
