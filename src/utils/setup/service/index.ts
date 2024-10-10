import path from 'node:path';
import { BlazeContext } from '../../../internal';
import { BlazeRouter } from '../../../router/BlazeRouter';
import type { BlazeAction } from '../../../types/action';
import type { Middleware } from '../../../types/rest';
import type { AnyBlazeService } from '../../../types/service';
import { getRestPath, getServiceName } from '../../common';
import { getRestMiddlewares } from '../../helper/rest';
import { loadService } from '../../helper/service';
import { BlazeServiceAction } from '../action';
import { BlazeServiceEvent } from '../event';
import { BlazeServiceRest } from '../rest';
import type {
  BlazeEventActionHandler,
  BlazeServiceOption,
  CreateServiceOption,
} from './types';

export class BlazeService {
  public readonly servicePath: string;
  public readonly serviceName: string;
  public readonly restPath: string;
  public readonly mainRouter: BlazeRouter;
  public readonly actions: BlazeServiceAction[];
  public readonly events: BlazeServiceEvent[];
  public readonly rests: BlazeServiceRest[];
  public readonly handlers: BlazeEventActionHandler[];
  public readonly middlewares: Middleware[];
  public router: BlazeRouter | null;

  private readonly blazeCtx: BlazeContext;
  private readonly service: AnyBlazeService;
  private isStarted: boolean;

  constructor(options: BlazeServiceOption) {
    const { service, blazeCtx, servicePath, app, middlewares } = options;

    this.service = service;
    this.servicePath = servicePath;
    this.blazeCtx = blazeCtx;
    this.serviceName = getServiceName(service);
    this.restPath = getRestPath(service);
    this.mainRouter = app;
    this.isStarted = false;

    this.actions = [];
    this.events = [];
    this.rests = [];
    this.handlers = [];
    this.middlewares = service.middlewares ?? [];

    if (middlewares) {
      this.middlewares.unshift(...middlewares);
    }

    this.router = null;

    this.loadServiceActions();
    this.loadServiceEvents();
  }

  private loadRest(action: BlazeAction) {
    if (!this.router) {
      this.router = new BlazeRouter({
        router: this.service.router,
      });
    }

    const middlewares = getRestMiddlewares(this.service, action);

    const restInstance = new BlazeServiceRest({
      action,
      router: this.router,
      service: this.service,
      middlewares,
    });

    this.rests.push(restInstance);
  }

  private loadServiceActions() {
    if (!this.service.actions) return this.actions;

    // eslint-disable-next-line guard-for-in
    for (const actionAlias in this.service.actions) {
      const action = this.service.actions[actionAlias];

      if (action.rest) this.loadRest(action);

      const instance = new BlazeServiceAction({
        action,
        actionAlias,
        serviceName: this.serviceName,
      });

      this.actions.push(instance);
    }

    return this.actions;
  }

  private loadServiceEvents() {
    if (!this.service.events) return this.events;

    // eslint-disable-next-line guard-for-in
    for (const eventAlias in this.service.events) {
      const event = this.service.events[eventAlias];

      const instance = new BlazeServiceEvent({
        event,
        eventAlias,
        serviceName: this.serviceName,
      });

      this.events.push(instance);
    }

    return this.events;
  }

  private assignRestRoute() {
    if (!this.router) return;

    this.mainRouter.route(`/${this.restPath}`, this.router);
  }

  public onStarted() {
    if (this.isStarted) return;

    this.assignRestRoute();
    this.service.onStarted?.(this.blazeCtx);
    this.isStarted = true;
  }

  public static async create(options: CreateServiceOption) {
    const servicePath = path.resolve(options.sourcePath, options.servicePath);
    const serviceFile = await loadService(servicePath);

    const service = new BlazeService({
      app: options.app,
      blazeCtx: options.blazeCtx,
      servicePath,
      service: serviceFile,
      middlewares: options.middlewares,
    });

    return service;
  }
}
