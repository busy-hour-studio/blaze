import { BlazeContext, BlazeEvent } from '../../internal';
import type { Event } from '../../types/event';
import type { ContextValidation, RecordUnknown } from '../../types/helper';
import type { CreateEventOption } from '../../types/service';
import { RESERVED_KEYWORD } from '../constant';
import { eventHandler } from '../helper/handler';

export class BlazeServiceEvent {
  public readonly serviceName: string;
  public readonly eventName: string;
  public readonly event: Event;
  private readonly validator: ContextValidation;

  constructor(options: CreateEventOption) {
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

    BlazeEvent.on(this.eventName, this.eventHandler.bind(this));
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
      onError: this.event.onError ?? null,
    });

    const options = {
      handler: this.event.handler,
    };

    return eventHandler(options, context);
  }
}
