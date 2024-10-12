import { BlazeContext, BlazeEvent } from '../../internal/index.ts';
import type { BlazeAction } from '../../types/action.ts';
import type { Random } from '../../types/common.ts';
import { eventHandler } from '../helpers/index.ts';
import type { BlazeActionServiceOption } from './types.ts';

export class BlazeServiceAction {
  public readonly serviceName: string;
  public readonly actionName: string;
  public readonly action: BlazeAction;

  constructor(options: BlazeActionServiceOption) {
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
      onError: this.action.onError ?? null,
    });

    return eventHandler(this.action, ctx);
  }
}
