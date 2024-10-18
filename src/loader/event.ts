import { eventHandler } from '../handler/index.ts';
import { BlazeContext } from '../internal/context/index.ts';
import type { ContextValidator } from '../internal/context/types.ts';
import { BlazeEvent } from '../internal/event-emitter/instance.ts';
import type { RecordUnknown } from '../types/common.ts';
import type { Event } from '../types/event.ts';
import type { CreateEventOption } from '../types/service.ts';
import { RESERVED_KEYWORD } from '../utils/constant/index.ts';

export class BlazeServiceEvent {
  public readonly serviceName: string;
  public readonly eventName: string;
  public readonly event: Event;
  private readonly validator: ContextValidator;

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
    const ctx = await BlazeContext.create({
      honoCtx: null,
      body,
      params: null,
      headers: null,
      query: null,
      validator: this.validator ?? null,
      meta: null,
    });

    const options = {
      handler: this.event.handler,
    };

    return eventHandler(options, ctx);
  }
}
