import { BlazeEvent } from '@/event/BlazeEvent';
import type { Action } from '@/types/action';
import type { EventActionHandler } from '@/types/event';
import type { RecordString, RecordUnknown } from '@/types/helper';
import type { Service } from '@/types/service';
import { Hono } from 'hono';
import { createContext, getServiceName } from '../common';
import { eventHandler } from '../helper/handler';
import { BlazeServiceRest } from './rest';

export class BlazeServiceAction {
  public readonly serviceName: string;
  public readonly handlers: EventActionHandler[];
  public readonly rests: BlazeServiceRest[];
  public readonly router: Hono | null;

  constructor(options: Service) {
    this.serviceName = getServiceName(options);
    this.handlers = [];
    this.rests = [];
    this.router = null;

    if (!options.actions) return;

    this.router = new Hono({
      strict: false,
      router: options.router,
    });

    this.handlers = Object.entries<Action>(
      options.actions
    ).map<EventActionHandler>(([actionAlias, action]) => {
      const actionName = [this.serviceName, actionAlias].join('.');

      if (action.rest) {
        const rest = new BlazeServiceRest({
          handler: action.handler,
          rest: action.rest,
          hooks: action.hooks,
          router: this.router!,
        });

        this.rests.push(rest);
      }

      const actionHandler = this.actionHandler(action);

      BlazeEvent.on(actionName, actionHandler);

      return {
        name: actionName,
        handler: actionHandler,
      };
    });
  }

  private actionHandler(action: Action) {
    return async function actionHandler(
      body: RecordUnknown,
      params: RecordUnknown,
      headers: RecordString
    ) {
      const contextRes = await createContext({
        honoCtx: null,
        body,
        headers,
        params,
      });

      if (!contextRes.ok) return contextRes;

      const { result: blazeCtx } = contextRes;

      return eventHandler(action, blazeCtx);
    };
  }
}
