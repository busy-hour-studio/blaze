import fs from 'node:fs';
import type { AddressInfo } from 'node:net';
import { BlazeDependency } from '../config';
import { BlazeError } from '../errors/BlazeError';
import { BlazeContext } from '../internal';
import { DependencyModule } from '../types/config';
import type {
  BlazeFetch,
  CreateBlazeOption,
  ServeConfig,
} from '../types/router';
import type { ImportServiceOption, LoadServicesOption } from '../types/service';
import { isNil } from '../utils/common';
import { ExternalModule, PossibleRunTime } from '../utils/constant';
import { BlazeService } from '../utils/setup/service';
import { useTrpc, type UseTrpc } from '../utils/trpc';
import { BlazeRouter } from './BlazeRouter';

export class Blaze {
  /**
   * List of all the loaded services
   * @see {@link BlazeService}
   */
  public readonly services: BlazeService[];
  public readonly router: BlazeRouter;
  /**
   * Shorthand for `app.router.doc`.
   * It allows you to generate OpenAPI documents and serve it at the given path.
   * @example
   * ```ts
   *  app.doc('/doc', {
   *    openapi: '3.0.0',
   *    info: {
   *      version: '1.0.0',
   *      title: 'Blaze OpenAPI Example'
   *    }
   *  })
   * ```
   * @see {@link BlazeRouter.doc}
   */
  public readonly doc: BlazeRouter['doc'];
  /**
   * Shorthand for `app.router.doc31`.
   * It allows you to generate OpenAPI documents and serve it at the given path.
   * @example
   * ```ts
   *  app.doc31('/doc', {
   *    openapi: '3.1.0',
   *    info: {
   *      version: '1.0.0',
   *      title: 'Blaze OpenAPI Example'
   *    }
   *  })
   * ```
   * @see {@link BlazeRouter.doc}
   */
  public readonly doc31: BlazeRouter['doc31'];
  /**
   * Shorthand for `app.router.use`.
   * It allows you to add middleware to the router
   * @example
   * ```ts
   *  app.use(cors())
   * ```
   * @see {@link BlazeRouter.use}
   */
  public readonly use: BlazeRouter['use'];
  private readonly blazeCtx: BlazeContext;
  private readonly adapter: DependencyModule[ExternalModule.NodeAdapter];

  public readonly fetch: BlazeFetch;
  public readonly trpc: UseTrpc;

  constructor(options: CreateBlazeOption = {}) {
    this.services = [];
    this.router = new BlazeRouter(options);
    this.doc = this.router.doc.bind(this.router);
    this.doc31 = this.router.doc31.bind(this.router);
    this.blazeCtx = new BlazeContext({
      body: null,
      params: null,
      headers: null,
      honoCtx: null,
      meta: null,
      query: null,
      validations: null,
    });
    this.adapter = BlazeDependency.modules[ExternalModule.NodeAdapter];
    this.fetch = this.router.fetch.bind(this.router) as BlazeFetch;
    this.use = this.router.use.bind(this.router);
    this.trpc = useTrpc.bind(this);

    if (!options.path) return;

    this.load({
      path: options.path,
      autoStart: options.autoStart,
      middlewares: options.middlewares,
    });
  }

  /**
   * Start all the loaded services
   * @example
   * ```ts
   *  app.start()
   * ```
   * passing `autoStart: true` on app creation (`new Blaze({ autoStart: true })`) will also start all the services
   */
  public start() {
    this.services.forEach((service) => service.onStarted());
  }

  /**
   * `load` all the services from the given path
   * @example
   * ```ts
   *  app.load({
   *    path: path.resolve(__dirname, 'services'),
   *    autoStart: true
   *  })
   * ```
   * `autoStart` options will start all the services when all the services are loaded
   */
  public async load(options: LoadServicesOption) {
    const { autoStart, path: sourcePath, middlewares } = options;

    // Load all the services
    if (!fs.existsSync(sourcePath)) {
      throw new BlazeError("Service path doesn't exist");
    }

    const serviceFiles = fs.readdirSync(sourcePath);

    const services = await Promise.all(
      serviceFiles.map((servicePath) => {
        const service = BlazeService.create({
          app: this.router,
          servicePath,
          blazeCtx: this.blazeCtx,
          sourcePath,
          middlewares: middlewares ?? [],
        });

        return service;
      })
    );

    this.services.push(...services);

    if (!autoStart) return;

    this.start();
  }

  /**
   * Same as `load` but requires an array of services instead of a path. Recommended if you want to bundle those services with Bun
   * @example
   * ```ts
   * app.import({
   *  services: [userService, authService, ...],
   *  autoStart: true
   * })
   * ```
   */
  public import(options: ImportServiceOption) {
    options.services.forEach((serv) => {
      const services = new BlazeService({
        app: this.router,
        blazeCtx: this.blazeCtx,
        middlewares: options.middlewares ?? [],
        service: serv,
        servicePath: '',
      });

      this.services.push(services);
    });

    if (!options.autoStart) return;

    this.start();
  }

  private getServeConfig(
    port?: number,
    listener?: (addressInfo: AddressInfo) => void
  ) {
    const config = {
      fetch: this.fetch,
      reusePort: true,
      port,
    };

    return [config, listener] as const;
  }

  /**
   * Start the server at the given port
   * @param listener - [Only for Node] a listener that will be called when the server is started.
   * @example
   * ```ts
   * // Start server at port 3000
   * app.serve(3000)
   *
   * // Pass a listener after server started
   * app.serve(3000, (addressInfo) => {
   *   console.log(`Server started at ${addressInfo.address}:${addressInfo.port}`)
   * })
   * ```
   */
  public serve(port?: number): ServeConfig;
  public serve<Listener extends (addressInfo: AddressInfo) => void>(
    port: number,
    listener: Listener
  ): [ServeConfig, Listener];
  public serve(port?: number, listener?: (addressInfo: AddressInfo) => void) {
    const args = this.getServeConfig(port, listener);

    if (!isNil(port)) {
      if (BlazeDependency.runTime === PossibleRunTime.Node && this.adapter) {
        this.adapter.serve(...args);
      }

      if (isNil(listener)) {
        return args[0];
      }

      return args;
    }

    if (BlazeDependency.runTime === PossibleRunTime.Node && this.adapter) {
      this.adapter.serve(...args);
    }

    return this.fetch as BlazeFetch;
  }
}
