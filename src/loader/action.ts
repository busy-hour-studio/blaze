import { eventHandler } from '../handler/index';
import { BlazeContext } from '../internal/context/index';
import { BlazeEvent } from '../internal/event-emitter/instance';
import type { Action } from '../types/action';
import type { Random } from '../types/common';
import type { CreateActionOption } from '../types/service';

export class BlazeServiceAction {
  public readonly serviceName: string;
  public readonly actionName: string;
  public readonly action: Action;

  constructor(options: CreateActionOption) {
    this.serviceName = options.serviceName;
    this.actionName = [this.serviceName, options.actionAlias].join('.');
    this.action = options.action;

    BlazeEvent.on(this.actionName, this.actionHandler.bind(this));
  }

  public async actionHandler(...values: Random[]) {
    const [body, params, headers, query] = values;

    const ctx = await BlazeContext.create({
      honoCtx: null,
      body,
      headers,
      params,
      query,
      validator: this.action.validator ?? null,
      meta: this.action.meta ?? null,
    });

    return eventHandler(this.action, ctx);
  }
}
