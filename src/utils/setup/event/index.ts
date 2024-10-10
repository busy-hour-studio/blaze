import { BlazeContext, BlazeEventEmitter } from '../../../internal';
import type { RecordUnknown } from '../../../types/common';
import type { BlazeEvent } from '../../../types/event';
import type { BlazeContextValidation } from '../../../types/validator';
import { RESERVED_KEYWORD } from '../../constant/broker';
import { eventHandler } from '../../helper/handler';
import type { BlazeServiceEventOption } from './types';

export class BlazeServiceEvent {
  public readonly serviceName: string;
  public readonly eventName: string;
  public readonly event: BlazeEvent;
  private readonly validator: BlazeContextValidation;

  constructor(options: BlazeServiceEventOption) {
    this.serviceName = options.serviceName;
    this.eventName = [
      RESERVED_KEYWORD.PREFIX.EVENT,
      this.serviceName,
      options.eventAlias,
    ].join('.');
    this.event = options.event;
    this.validator = {
      body: this.event.validator,
    };

    BlazeEventEmitter.on(this.eventName, this.eventHandler.bind(this));
  }

  public async eventHandler(body: RecordUnknown) {
    const context = await BlazeContext.create({
      honoCtx: null,
      body,
      params: null,
      headers: null,
      query: null,
      validator: this.validator ?? null,
      meta: null,
      onValidationError: this.event.onValidationError ?? null,
    });

    const options = {
      handler: this.event.handler,
    };

    return eventHandler(options, context);
  }
}
