import { BlazeError } from '@/errors/BlazeError';
import { BlazeContext } from '@/event/BlazeContext';
import { BlazeEvent } from '@/event/BlazeEvent';
import { Blaze } from '@/router';
import type { Action } from '@/types/action';
import type { EventActionHandler } from '@/types/event';
import type { Method } from '@/types/rest';
import type { CreateServiceOption, Service } from '@/types/service';
import path from 'node:path';
import { getRestPath, getServiceName } from '../common';
import { loadService } from '../helper/service';
import { BlazeServiceAction } from './action';
import { BlazeServiceEvent } from './event';
import { BlazeServiceRest } from './rest';

export class BlazeService {
  public readonly servicePath: string;
  public readonly serviceName: string;
  public readonly restPath: string;
  public readonly mainRouter: Blaze;
  public readonly actions: BlazeServiceAction[];
  public readonly events: BlazeServiceEvent[];
  public readonly rests: BlazeServiceRest[];
  public readonly handlers: EventActionHandler[];
  public router: Blaze | null;

  private readonly blazeCtx: BlazeContext;
  private readonly service: Service;

  constructor(options: CreateServiceOption) {
    this.servicePath = path.resolve(options.sourcePath, options.servicePath);

    const service = loadService(this.servicePath);

    if (typeof service.name === 'undefined' || service.name === null) {
      throw new BlazeError('Service name is required');
    }

    this.blazeCtx = options.blazeCtx;
    this.serviceName = getServiceName(service);
    this.restPath = getRestPath(service);
    this.mainRouter = options.app;

    this.actions = [];
    this.events = [];
    this.rests = [];
    this.handlers = [];

    this.service = service;
    this.router = null;

    this.loadServiceActions();
    this.loadServiceEvents();
  }

  private loadRest(action: Action) {
    if (!this.router) {
      this.router = new Blaze({
        router: this.service.router,
      });
    }

    const restInstance = new BlazeServiceRest({
      action,
      router: this.router,
    });

    this.rests.push(restInstance);
  }

  private loadServiceActions() {
    if (!this.service.actions) return [];

    const actions = Object.entries(this.service.actions).map(
      ([actionAlias, action]) => {
        if (action.rest) this.loadRest(action);

        const actionInstace = new BlazeServiceAction({
          action,
          actionAlias,
          serviceName: this.serviceName,
        });

        this.handlers.push({
          name: actionInstace.actionName,
          handler: actionInstace.actionHandler,
        });

        return actionInstace;
      }
    );

    return this.actions.concat(actions);
  }

  private loadServiceEvents() {
    if (!this.service.events) return;

    const events = Object.entries(this.service.events).map(
      ([eventAlias, event]) => {
        const eventInstance = new BlazeServiceEvent({
          event,
          eventAlias,
          serviceName: this.serviceName,
        });

        this.handlers.push({
          name: eventInstance.eventName,
          handler: eventInstance.eventHandler,
        });

        return eventInstance;
      }
    );

    return this.events.concat(events);
  }

  private assignRestRoute() {
    if (!this.router) return;

    this.mainRouter.route(`/${this.restPath}`, this.router);
  }

  public onStopped() {
    // Trigger the on stopped listener
    this.service.onStopped?.(this.handlers);

    // Remove all the rest
    this.rests.forEach((rest) => {
      const method: Method = rest.method ?? 'ALL';

      // this.router?.off?.(method, rest.path);
      this.mainRouter?.off?.(method, rest.path);
    });

    // Remove all the action
    this.actions.forEach((action) => {
      BlazeEvent.off(action.actionName, action.actionHandler);
    });
  }

  public onRestarted() {
    // Trigger the on restarted listener
    // this.service.onRestarted?.(this.handlers);

    // Re-assign the rest
    this.rests.forEach((rest) => {
      const method: Method = rest.method ?? 'ALL';

      this.router?.on?.(method, rest.path, rest.restHandler);
    });

    // Re-assign the action
    this.actions.forEach((action) => {
      BlazeEvent.on(action.actionName, action.actionHandler);
    });
  }

  public onStarted() {
    this.assignRestRoute();
    this.service.onStarted?.(this.blazeCtx);
  }
}
