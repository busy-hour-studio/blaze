import fs from 'node:fs';
import type { AddressInfo } from 'node:net';
import { BlazeConfig } from '../internal/config/instance';
import { DependencyModule } from '../internal/config/types';
import { BlazeContext } from '../internal/context/index';
import { Logger } from '../internal/logger/index';
import { BlazeService } from '../loader/service';
import { useTrpc, type UseTrpc } from '../loader/trpc/index';
import type {
  BlazeFetch,
  CreateBlazeOption,
  ServeConfig,
} from '../types/router';
import type { ImportServiceOption, LoadServicesOption } from '../types/service';
import { isNil, toArray } from '../utils/common';
import {
  ExternalModule,
  PossibleRunTime,
} from '../utils/constant/config/index';
import { BlazeRouter } from './BlazeRouter';

export class Blaze {
  private readonly $services: Map<BlazeService['serviceName'], BlazeService>;
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
  private readonly ctx: BlazeContext;
  private readonly adapter: DependencyModule[typeof ExternalModule.NodeAdapter];

  public readonly fetch: BlazeFetch;
  public readonly trpc: UseTrpc;

  constructor(options: CreateBlazeOption = {}) {
    this.$services = new Map();
    this.router = new BlazeRouter(options);
    this.doc = this.router.doc.bind(this.router);
    this.doc31 = this.router.doc31.bind(this.router);
    this.ctx = new BlazeContext({
      body: null,
      params: null,
      headers: null,
      honoCtx: null,
      meta: null,
      query: null,
    });

    this.adapter = BlazeConfig.modules[ExternalModule.NodeAdapter];
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
    this.$services.forEach((service) => service.onStarted());
  }

  private addServices(service: BlazeService | BlazeService[]) {
    const services = toArray(service);

    services.forEach((serv) => {
      if (this.$services.has(serv.serviceName)) return;

      this.$services.set(serv.serviceName, serv);
    });
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
      throw Logger.throw("Service path doesn't exist");
    }

    const serviceFiles = fs.readdirSync(sourcePath);

    const services = await Promise.all(
      serviceFiles.map((servicePath) => {
        const service = BlazeService.create({
          app: this.router,
          servicePath,
          ctx: this.ctx,
          sourcePath,
          middlewares: middlewares ?? [],
        });

        return service;
      })
    );

    this.addServices(services);

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
    const services = options.services.map((serv) => {
      const service = new BlazeService({
        app: this.router,
        ctx: this.ctx,
        middlewares: options.middlewares ?? [],
        service: serv,
        servicePath: '',
      });

      return service;
    });

    this.addServices(services);

    if (!options.autoStart) return;

    this.start();
  }

  /**
   * List of all the loaded services
   * @see {@link BlazeService}
   */
  public get services() {
    return [...this.$services.values()];
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
      if (BlazeConfig.runTime === PossibleRunTime.NODE && this.adapter) {
        this.adapter.serve(...args);
      }

      if (isNil(listener)) {
        return args[0];
      }

      return args;
    }

    if (BlazeConfig.runTime === PossibleRunTime.NODE && this.adapter) {
      this.adapter.serve(...args);
    }

    return this.fetch as BlazeFetch;
  }
}
