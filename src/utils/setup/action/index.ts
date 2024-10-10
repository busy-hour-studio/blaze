import { BlazeContext, BlazeEventEmitter } from '../../../internal';
import type { BlazeAction } from '../../../types/action';
import type { Random } from '../../../types/common';
import { eventHandler } from '../../helper/handler';
import { BlazeServiceActionOption } from './types';

export class BlazeServiceAction {
  public readonly serviceName: string;
  public readonly actionName: string;
  public readonly action: BlazeAction;

  constructor(options: BlazeServiceActionOption) {
    this.serviceName = options.serviceName;
    this.actionName = [this.serviceName, options.actionAlias].join('.');
    this.action = options.action;

    BlazeEventEmitter.on(this.actionName, this.actionHandler.bind(this));
  }

  public async actionHandler(...values: Random[]) {
    const [body, params, headers, query] = values;

    const context = await BlazeContext.create({
      honoCtx: null,
      body,
      headers,
      params,
      query,
      validator: this.action.validator ?? null,
      meta: this.action.meta ?? null,
      onValidationError: this.action.onValidationError ?? null,
    });

    return eventHandler(this.action, context);
  }
}
