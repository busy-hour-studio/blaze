import fs from 'node:fs';
import { AddressInfo } from 'node:net';
import { BlazeDependency } from '../config';
import { BlazeError } from '../errors/BlazeError';
import { BlazeContext } from '../event';
import { DependencyModule } from '../types/config';
import type { BlazeFetch, CreateBlazeOption } from '../types/router';
import { LoadServicesOption } from '../types/service';
import { isNil } from '../utils/common';
import { ExternalModule, PossibleRunTime } from '../utils/constant';
import { BlazeService } from '../utils/setup/service';
import { BlazeRouter } from './BlazeRouter';

export class Blaze {
  public readonly services: BlazeService[];
  public readonly router: BlazeRouter;
  public readonly doc: BlazeRouter['doc'];
  public readonly doc31: BlazeRouter['doc31'];
  private readonly blazeCtx: BlazeContext;
  private readonly adapter: DependencyModule[ExternalModule.NodeAdapter];

  public readonly fetch: BlazeFetch;

  constructor(options: CreateBlazeOption) {
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
      validations: null,
    });
    this.adapter = BlazeDependency.modules[ExternalModule.NodeAdapter];
    this.fetch = this.router.fetch.bind(this.router) as BlazeFetch;

    if (!options.path) return;

    this.load({
      path: options.path,
      autoStart: options.autoStart,
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
   * `load` load all the services from the given path
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
    // Load all the services
    if (!fs.existsSync(options.path)) {
      throw new BlazeError("Service path doesn't exist");
    }

    const serviceFiles = fs.readdirSync(options.path);

    const services = await Promise.all(
      serviceFiles.map((servicePath) => {
        const service = BlazeService.create({
          app: this.router,
          servicePath,
          blazeCtx: this.blazeCtx,
          sourcePath: options.path,
        });

        return service;
      })
    );

    this.services.push(...services);

    if (!options.autoStart) return;

    this.start();
  }

  private getServeConfig(
    port?: number,
    listener?: (addressInfo: AddressInfo) => void
  ) {
    const config = {
      fetch: this.fetch,
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
  public serve(): BlazeFetch;
  public serve(port: number): {
    fetch: BlazeFetch;
    port: number;
  };
  public serve<Listener extends (addressInfo: AddressInfo) => void>(
    port: number,
    listener: Listener
  ): [{ fetch: BlazeFetch; port: number }, Listener];
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
